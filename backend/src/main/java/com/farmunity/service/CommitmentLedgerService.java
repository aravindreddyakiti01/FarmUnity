package com.farmunity.service;

import com.farmunity.dto.response.CommitmentLedgerResponse;
import com.farmunity.entity.Agreement;
import com.farmunity.entity.Buyer;
import com.farmunity.entity.CommitmentLedger;
import com.farmunity.entity.enums.AgreementStatus;
import com.farmunity.entity.enums.CommitmentStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.AgreementRepository;
import com.farmunity.repository.BuyerRepository;
import com.farmunity.repository.CommitmentLedgerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommitmentLedgerService {

    private final CommitmentLedgerRepository commitmentLedgerRepository;
    private final AgreementRepository agreementRepository;
    private final BuyerRepository buyerRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public CommitmentLedgerResponse createCommitment(Long agreementId, Long buyerId, BigDecimal committedAmount, LocalDateTime deadline) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found: " + agreementId));

        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found: " + buyerId));

        Optional<CommitmentLedger> existing = commitmentLedgerRepository.findByAgreementId(agreementId);
        if (existing.isPresent()) {
            return mapToResponse(existing.get());
        }

        CommitmentLedger ledger = CommitmentLedger.builder()
                .agreement(agreement)
                .buyer(buyer)
                .committedAmount(committedAmount != null ? committedAmount : agreement.getTotalValueGross())
                .status(CommitmentStatus.PENDING)
                .deadline(deadline != null ? deadline : LocalDateTime.now().plusDays(3))
                .build();

        CommitmentLedger saved = commitmentLedgerRepository.save(ledger);

        eventPublisher.publishEvent(new AuditEvent(
                this, "COMMITMENT_LEDGER", saved.getId(), "COMMITMENT_INITIALIZED",
                buyerId, "BUYER",
                "Simulated commitment ledger record created for ₹" + saved.getCommittedAmount(),
                null, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    /**
     * Explicit buyer action to fund the simulated commitment deposit.
     */
    @Transactional
    public CommitmentLedgerResponse fundCommitment(Long ledgerId, Long buyerId) {
        CommitmentLedger ledger = commitmentLedgerRepository.findById(ledgerId)
                .orElseThrow(() -> new IllegalArgumentException("Commitment ledger not found: " + ledgerId));

        if (!ledger.getBuyer().getId().equals(buyerId)) {
            throw new IllegalStateException("Unauthorized to fund this commitment");
        }

        if (ledger.getStatus() != CommitmentStatus.PENDING) {
            throw new IllegalStateException("Commitment must be in PENDING state to fund");
        }

        String prevState = ledger.getStatus().name();
        ledger.setStatus(CommitmentStatus.FUNDED);
        ledger.setFundedAt(LocalDateTime.now());
        CommitmentLedger saved = commitmentLedgerRepository.save(ledger);

        eventPublisher.publishEvent(new AuditEvent(
                this, "COMMITMENT_LEDGER", saved.getId(), "COMMITMENT_FUNDED",
                buyerId, "BUYER",
                "Simulated commitment funded: ₹" + saved.getCommittedAmount(),
                prevState, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public CommitmentLedgerResponse markPickupVerified(Long agreementId, Long coordinatorId) {
        CommitmentLedger ledger = commitmentLedgerRepository.findByAgreementId(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("No commitment ledger found for agreement: " + agreementId));

        String prevState = ledger.getStatus().name();
        ledger.setStatus(CommitmentStatus.PICKUP_VERIFIED);
        ledger.setPickupVerifiedAt(LocalDateTime.now());
        CommitmentLedger saved = commitmentLedgerRepository.save(ledger);

        eventPublisher.publishEvent(new AuditEvent(
                this, "COMMITMENT_LEDGER", saved.getId(), "PICKUP_VERIFIED",
                coordinatorId, "COORDINATOR",
                "Batch pickup verified; ledger advanced to PICKUP_VERIFIED",
                prevState, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public CommitmentLedgerResponse markDelivered(Long agreementId, Long buyerId) {
        CommitmentLedger ledger = commitmentLedgerRepository.findByAgreementId(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("No commitment ledger found for agreement: " + agreementId));

        String prevState = ledger.getStatus().name();
        ledger.setStatus(CommitmentStatus.DELIVERED);
        ledger.setDeliveredAt(LocalDateTime.now());
        CommitmentLedger saved = commitmentLedgerRepository.save(ledger);

        eventPublisher.publishEvent(new AuditEvent(
                this, "COMMITMENT_LEDGER", saved.getId(), "DELIVERY_RECORDED",
                buyerId, "BUYER",
                "Delivery recorded on commitment ledger; ready for release",
                prevState, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public CommitmentLedgerResponse releasePayment(Long agreementId, Long coordinatorId) {
        CommitmentLedger ledger = commitmentLedgerRepository.findByAgreementId(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("No commitment ledger found for agreement: " + agreementId));

        if (ledger.getStatus() != CommitmentStatus.DELIVERED) {
            throw new IllegalStateException("Payment can only be released after DELIVERED status");
        }

        String prevState = ledger.getStatus().name();
        ledger.setStatus(CommitmentStatus.RELEASED);
        ledger.setReleasedAt(LocalDateTime.now());
        CommitmentLedger saved = commitmentLedgerRepository.save(ledger);

        eventPublisher.publishEvent(new AuditEvent(
                this, "COMMITMENT_LEDGER", saved.getId(), "PAYMENT_RELEASED",
                coordinatorId, "COORDINATOR",
                "Simulated payment released to farmers pool",
                prevState, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    /**
     * Periodic background monitor for past-deadline commitments.
     * GOVERNING PRINCIPLE: Flags for human coordinator action, NEVER auto-cancels or auto-releases.
     */
    @Scheduled(fixedRate = 1800000) // Every 30 minutes
    @Transactional
    public void monitorOverdueCommitments() {
        List<CommitmentLedger> overdue = commitmentLedgerRepository
                .findByStatusAndDeadlineBefore(CommitmentStatus.PENDING, LocalDateTime.now());

        for (CommitmentLedger cl : overdue) {
            log.warn("Commitment ledger ID {} is overdue (Deadline: {}). Flagging for coordinator review.",
                    cl.getId(), cl.getDeadline());

            eventPublisher.publishEvent(new AuditEvent(
                    this, "COMMITMENT_LEDGER", cl.getId(), "COMMITMENT_DEADLINE_EXPIRED",
                    null, "SYSTEM",
                    "Commitment deadline passed without funding. Coordinator action required for replacement buyer or rematch.",
                    cl.getStatus().name(), cl.getStatus().name()
            ));
        }
    }

    public CommitmentLedgerResponse getLedgerByAgreementId(Long agreementId) {
        CommitmentLedger ledger = commitmentLedgerRepository.findByAgreementId(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("No commitment ledger for agreement: " + agreementId));
        return mapToResponse(ledger);
    }

    public CommitmentLedgerResponse mapToResponse(CommitmentLedger ledger) {
        return CommitmentLedgerResponse.builder()
                .id(ledger.getId())
                .agreementId(ledger.getAgreement().getId())
                .buyerId(ledger.getBuyer().getId())
                .buyerName(ledger.getBuyer().getName())
                .committedAmount(ledger.getCommittedAmount())
                .status(ledger.getStatus())
                .deadline(ledger.getDeadline())
                .fundedAt(ledger.getFundedAt())
                .pickupVerifiedAt(ledger.getPickupVerifiedAt())
                .deliveredAt(ledger.getDeliveredAt())
                .releasedAt(ledger.getReleasedAt())
                .createdAt(ledger.getCreatedAt())
                .isSimulated(true)
                .build();
    }
}
