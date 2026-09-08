package com.farmunity.service;

import com.farmunity.dto.response.SettlementResponse;
import com.farmunity.entity.Agreement;
import com.farmunity.entity.BatchMembership;
import com.farmunity.entity.Settlement;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.AgreementRepository;
import com.farmunity.repository.BatchMembershipRepository;
import com.farmunity.repository.SettlementRepository;
import com.farmunity.util.HashUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final AgreementRepository agreementRepository;
    private final BatchMembershipRepository batchMembershipRepository;
    private final PaymentService paymentService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public SettlementResponse computeAndSaveSettlement(Long agreementId, Long actorId) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found: " + agreementId));

        List<BatchMembership> memberships = batchMembershipRepository
                .findByCooperativeBatchId(agreement.getCooperativeBatch().getId());

        // Filter active delivered/confirmed members
        List<BatchMembership> eligibleMembers = memberships.stream()
                .filter(m -> "ACCEPTED".equalsIgnoreCase(m.getFarmerDecision()) ||
                             "PICKUP_CONFIRMED".equalsIgnoreCase(m.getFarmerDecision()))
                .collect(Collectors.toList());

        // Calculate total verified quantity
        BigDecimal totalVerifiedQty = eligibleMembers.stream()
                .map(m -> m.getProduceListing().getVerifiedQty() != null ?
                        m.getProduceListing().getVerifiedQty() : m.getAllocatedQty())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal grossTotal = paymentService.calculateGrossValue(totalVerifiedQty, agreement.getAgreedPricePerKg());
        BigDecimal transportTotal = agreement.getTransportDeductionPerKg().multiply(totalVerifiedQty);
        BigDecimal feeRate = agreement.getPlatformFeeRate() != null ? agreement.getPlatformFeeRate() : new BigDecimal("0.0200");
        BigDecimal platformFeeTotal = grossTotal.multiply(feeRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal netPoolTotal = paymentService.calculateNetPool(grossTotal, transportTotal, feeRate);

        List<SettlementResponse.FarmerSettlementDetail> farmerDetails = new ArrayList<>();

        for (BatchMembership m : eligibleMembers) {
            BigDecimal farmerVerifiedQty = m.getProduceListing().getVerifiedQty() != null ?
                    m.getProduceListing().getVerifiedQty() : m.getAllocatedQty();

            BigDecimal farmerGross = paymentService.calculateGrossValue(farmerVerifiedQty, agreement.getAgreedPricePerKg());
            BigDecimal farmerTransport = agreement.getTransportDeductionPerKg().multiply(farmerVerifiedQty);
            BigDecimal farmerFee = farmerGross.multiply(feeRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal farmerNetPayout = paymentService.calculateFarmerPayout(farmerVerifiedQty, totalVerifiedQty, netPoolTotal);

            // Compute deterministic SHA-256 canonical hash for this individual farmer payout
            Map<String, Object> payoutData = new TreeMap<>();
            payoutData.put("agreementId", agreement.getId());
            payoutData.put("farmerId", m.getFarmer().getId());
            payoutData.put("verifiedQty", farmerVerifiedQty.toString());
            payoutData.put("agreedPrice", agreement.getAgreedPricePerKg().toString());
            payoutData.put("grossAmount", farmerGross.toString());
            payoutData.put("transportDeduction", farmerTransport.toString());
            payoutData.put("platformFee", farmerFee.toString());
            payoutData.put("netPayout", farmerNetPayout.toString());

            String hash = HashUtil.sha256CanonicalJson(payoutData);

            Settlement settlement = Settlement.builder()
                    .agreement(agreement)
                    .farmer(m.getFarmer())
                    .verifiedQty(farmerVerifiedQty)
                    .grossAmount(farmerGross)
                    .transportDeduction(farmerTransport)
                    .platformFee(farmerFee)
                    .netPayout(farmerNetPayout)
                    .isPaid(true)
                    .integrityHash(hash)
                    .build();

            Settlement savedSettlement = settlementRepository.save(settlement);

            farmerDetails.add(SettlementResponse.FarmerSettlementDetail.builder()
                    .settlementId(savedSettlement.getId())
                    .farmerId(m.getFarmer().getId())
                    .farmerName(m.getFarmer().getName())
                    .farmerPhone(m.getFarmer().getPhone())
                    .verifiedQty(farmerVerifiedQty)
                    .grossAmount(farmerGross)
                    .transportDeduction(farmerTransport)
                    .platformFee(farmerFee)
                    .netPayout(farmerNetPayout)
                    .isPaid(true)
                    .integrityHash(hash)
                    .build());
        }

        eventPublisher.publishEvent(new AuditEvent(
                this, "SETTLEMENT", agreement.getId(), "SETTLEMENT_FINALIZED",
                actorId, "BUYER",
                String.format("Settlement finalized for Agreement %d: Gross ₹%s, Deductions ₹%s, Net Pool ₹%s split across %d farmers.",
                        agreement.getId(), grossTotal, transportTotal.add(platformFeeTotal), netPoolTotal, farmerDetails.size()),
                null, "COMPLETED"
        ));

        return SettlementResponse.builder()
                .agreementId(agreement.getId())
                .grossTotal(grossTotal)
                .transportTotal(transportTotal)
                .platformFeeTotal(platformFeeTotal)
                .netPoolTotal(netPoolTotal)
                .agreementIntegrityHash(agreement.getIntegrityHash())
                .farmerSettlements(farmerDetails)
                .settledAt(LocalDateTime.now())
                .build();
    }

    public SettlementResponse getSettlementForAgreement(Long agreementId) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found: " + agreementId));

        List<Settlement> settlements = settlementRepository.findByAgreementId(agreementId);

        BigDecimal grossTotal = settlements.stream().map(Settlement::getGrossAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal transportTotal = settlements.stream().map(Settlement::getTransportDeduction).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal feeTotal = settlements.stream().map(Settlement::getPlatformFee).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal netTotal = settlements.stream().map(Settlement::getNetPayout).reduce(BigDecimal.ZERO, BigDecimal::add);

        List<SettlementResponse.FarmerSettlementDetail> details = settlements.stream()
                .map(s -> SettlementResponse.FarmerSettlementDetail.builder()
                        .settlementId(s.getId())
                        .farmerId(s.getFarmer().getId())
                        .farmerName(s.getFarmer().getName())
                        .farmerPhone(s.getFarmer().getPhone())
                        .verifiedQty(s.getVerifiedQty())
                        .grossAmount(s.getGrossAmount())
                        .transportDeduction(s.getTransportDeduction())
                        .platformFee(s.getPlatformFee())
                        .netPayout(s.getNetPayout())
                        .isPaid(s.getIsPaid())
                        .integrityHash(s.getIntegrityHash())
                        .build())
                .collect(Collectors.toList());

        return SettlementResponse.builder()
                .agreementId(agreementId)
                .grossTotal(grossTotal)
                .transportTotal(transportTotal)
                .platformFeeTotal(feeTotal)
                .netPoolTotal(netTotal)
                .agreementIntegrityHash(agreement.getIntegrityHash())
                .farmerSettlements(details)
                .settledAt(settlements.isEmpty() ? null : settlements.get(0).getCreatedAt())
                .build();
    }

    public List<Settlement> getSettlementsForFarmer(Long farmerId) {
        return settlementRepository.findByFarmerId(farmerId);
    }
}
