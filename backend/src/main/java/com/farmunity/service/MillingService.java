package com.farmunity.service;

import com.farmunity.dto.request.CreateWorkOrderRequest;
import com.farmunity.dto.request.MillingCompletionRequest;
import com.farmunity.dto.response.JobWorkOrderResponse;
import com.farmunity.entity.Agreement;
import com.farmunity.entity.CropConfig;
import com.farmunity.entity.JobWorkOrder;
import com.farmunity.entity.Processor;
import com.farmunity.entity.enums.WorkOrderStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.AgreementRepository;
import com.farmunity.repository.CropConfigRepository;
import com.farmunity.repository.JobWorkOrderRepository;
import com.farmunity.repository.ProcessorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MillingService {

    private final JobWorkOrderRepository jobWorkOrderRepository;
    private final AgreementRepository agreementRepository;
    private final ProcessorRepository processorRepository;
    private final CropConfigRepository cropConfigRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${app.yield-shortfall-threshold:0.05}")
    private double yieldShortfallThreshold;

    @Transactional
    public JobWorkOrderResponse createWorkOrder(CreateWorkOrderRequest req, Long coordinatorId) {
        Agreement agreement = agreementRepository.findById(req.getAgreementId())
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found: " + req.getAgreementId()));

        Processor processor = processorRepository.findById(req.getProcessorId())
                .orElseThrow(() -> new IllegalArgumentException("Processor not found: " + req.getProcessorId()));

        String crop = agreement.getCooperativeBatch().getBuyerRequirement().getProduct();
        CropConfig cropConfig = cropConfigRepository.findByCropNameIgnoreCase(crop)
                .orElseGet(() -> CropConfig.builder()
                        .cropName(crop)
                        .expectedYieldRatio(new BigDecimal("0.6500"))
                        .build());

        BigDecimal fee = req.getRawInputQty().multiply(processor.getFeePerKg());

        JobWorkOrder workOrder = JobWorkOrder.builder()
                .agreement(agreement)
                .processor(processor)
                .rawInputQty(req.getRawInputQty())
                .expectedYieldRatio(cropConfig.getExpectedYieldRatio())
                .fee(fee)
                .status(WorkOrderStatus.IN_PROGRESS)
                .flaggedForReview(false)
                .processorAdjustment(BigDecimal.ZERO)
                .build();

        JobWorkOrder saved = jobWorkOrderRepository.save(workOrder);

        eventPublisher.publishEvent(new AuditEvent(
                this, "JOB_WORK_ORDER", saved.getId(), "MILLING_JOB_CREATED",
                coordinatorId, "COORDINATOR",
                String.format("Milling work order created: %s kg raw %s assigned to %s (Expected yield: %.1f%%)",
                        req.getRawInputQty(), crop, processor.getName(),
                        cropConfig.getExpectedYieldRatio().doubleValue() * 100),
                null, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public JobWorkOrderResponse completeWorkOrder(Long workOrderId, MillingCompletionRequest req, Long coordinatorId) {
        JobWorkOrder workOrder = jobWorkOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Work order not found: " + workOrderId));

        if (workOrder.getStatus() == WorkOrderStatus.COMPLETED) {
            throw new IllegalStateException("Work order is already completed");
        }

        BigDecimal rawInput = workOrder.getRawInputQty();
        BigDecimal actualOutput = req.getActualOutputQty();
        BigDecimal actualYieldRatio = actualOutput.divide(rawInput, 4, RoundingMode.HALF_UP);
        BigDecimal expectedRatio = workOrder.getExpectedYieldRatio();

        workOrder.setActualOutputQty(actualOutput);
        workOrder.setActualYieldRatio(actualYieldRatio);

        // Check if yield shortfall exceeds threshold
        BigDecimal ratioDiff = expectedRatio.subtract(actualYieldRatio);
        boolean isShortfall = ratioDiff.compareTo(BigDecimal.valueOf(yieldShortfallThreshold)) > 0;

        String previousState = workOrder.getStatus().name();

        if (isShortfall) {
            workOrder.setStatus(WorkOrderStatus.FLAGGED);
            workOrder.setFlaggedForReview(true);
            String flagReason = String.format("Yield shortfall of %.2f%% detected (Expected: %.1f%%, Actual: %.1f%%). Exceeds %.1f%% threshold.",
                    ratioDiff.doubleValue() * 100, expectedRatio.doubleValue() * 100,
                    actualYieldRatio.doubleValue() * 100, yieldShortfallThreshold * 100);
            workOrder.setFlagReason(flagReason);

            // Pre-agreed adjustment: processor fee reduced proportionally to shortfall
            BigDecimal adjustment = workOrder.getFee().multiply(ratioDiff).setScale(2, RoundingMode.HALF_UP);
            workOrder.setProcessorAdjustment(adjustment);

            Processor processor = workOrder.getProcessor();
            processor.setWalletBalance(processor.getWalletBalance().subtract(adjustment));
            processorRepository.save(processor);

            eventPublisher.publishEvent(new AuditEvent(
                    this, "JOB_WORK_ORDER", workOrder.getId(), "MILLING_YIELD_SHORTFALL_FLAGGED",
                    coordinatorId, "COORDINATOR",
                    flagReason + " Processor fee adjusted by ₹" + adjustment,
                    previousState, workOrder.getStatus().name()
            ));
        } else {
            workOrder.setStatus(WorkOrderStatus.COMPLETED);
            workOrder.setFlaggedForReview(false);

            // Add fee to processor balance
            Processor processor = workOrder.getProcessor();
            processor.setWalletBalance(processor.getWalletBalance().add(workOrder.getFee()));
            processorRepository.save(processor);

            eventPublisher.publishEvent(new AuditEvent(
                    this, "JOB_WORK_ORDER", workOrder.getId(), "MILLING_COMPLETED_SUCCESS",
                    coordinatorId, "COORDINATOR",
                    String.format("Milling completed: %s kg output from %s kg input (Yield: %.2f%%). Fee ₹%s credited.",
                            actualOutput, rawInput, actualYieldRatio.doubleValue() * 100, workOrder.getFee()),
                    previousState, workOrder.getStatus().name()
            ));
        }

        JobWorkOrder saved = jobWorkOrderRepository.save(workOrder);
        return mapToResponse(saved);
    }

    public List<JobWorkOrderResponse> getWorkOrdersByAgreement(Long agreementId) {
        return jobWorkOrderRepository.findByAgreementId(agreementId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobWorkOrderResponse getWorkOrderById(Long id) {
        JobWorkOrder order = jobWorkOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work order not found: " + id));
        return mapToResponse(order);
    }

    public List<Processor> getAllProcessors() {
        return processorRepository.findByIsActiveTrue();
    }

    public JobWorkOrderResponse mapToResponse(JobWorkOrder order) {
        return JobWorkOrderResponse.builder()
                .id(order.getId())
                .agreementId(order.getAgreement().getId())
                .processorId(order.getProcessor().getId())
                .processorName(order.getProcessor().getName())
                .rawInputQty(order.getRawInputQty())
                .expectedYieldRatio(order.getExpectedYieldRatio())
                .actualOutputQty(order.getActualOutputQty())
                .actualYieldRatio(order.getActualYieldRatio())
                .fee(order.getFee())
                .status(order.getStatus())
                .flaggedForReview(order.getFlaggedForReview())
                .flagReason(order.getFlagReason())
                .processorAdjustment(order.getProcessorAdjustment())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
