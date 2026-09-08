package com.farmunity.service;

import com.farmunity.dto.request.DeliveryConfirmationRequest;
import com.farmunity.dto.response.SettlementResponse;
import com.farmunity.entity.Agreement;
import com.farmunity.entity.CommitmentLedger;
import com.farmunity.entity.enums.CommitmentStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.AgreementRepository;
import com.farmunity.repository.CommitmentLedgerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryService {

    private final AgreementRepository agreementRepository;
    private final CommitmentLedgerRepository commitmentLedgerRepository;
    private final SettlementService settlementService;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Confirms institutional bulk delivery with structured feedback and triggers transparent settlement.
     * GOVERNING PRINCIPLE: Human buyer approval triggers downstream financial settlement.
     */
    @Transactional
    public SettlementResponse confirmDelivery(Long agreementId, DeliveryConfirmationRequest req, Long buyerId) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found: " + agreementId));

        CommitmentLedger ledger = commitmentLedgerRepository.findByAgreementId(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("Commitment ledger not found for agreement: " + agreementId));

        if (!ledger.getBuyer().getId().equals(buyerId)) {
            throw new IllegalStateException("Only the authorized buyer can confirm delivery");
        }

        ledger.setStatus(CommitmentStatus.DELIVERED);
        ledger.setDeliveredAt(LocalDateTime.now());
        commitmentLedgerRepository.save(ledger);

        eventPublisher.publishEvent(new AuditEvent(
                this, "AGREEMENT", agreementId, "DELIVERY_CONFIRMED_BY_BUYER",
                buyerId, "BUYER",
                String.format("Buyer confirmed delivery of %s kg. Quality rating: %d/5. Feedback: %s. Discrepancies: %s",
                        req.getReceivedQty(), req.getQualityRating() != null ? req.getQualityRating() : 5,
                        req.getNotes() != null ? req.getNotes() : "Delivered in full",
                        req.getDiscrepancyDetails() != null ? req.getDiscrepancyDetails() : "None"),
                "PICKUP_VERIFIED", "DELIVERED"
        ));

        // Trigger settlement computation upon human confirmation
        return settlementService.computeAndSaveSettlement(agreementId, buyerId);
    }
}
