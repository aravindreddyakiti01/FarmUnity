package com.farmunity.service;

import com.farmunity.dto.request.AmendmentRequest;
import com.farmunity.dto.request.CreateAgreementRequest;
import com.farmunity.dto.request.FarmerNegotiationRequest;
import com.farmunity.dto.response.AgreementResponse;
import com.farmunity.dto.response.BatchFormationResponse;
import com.farmunity.entity.Agreement;
import com.farmunity.entity.BatchMembership;
import com.farmunity.entity.CooperativeBatch;
import com.farmunity.entity.enums.AgreementStatus;
import com.farmunity.entity.enums.BatchStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.AgreementRepository;
import com.farmunity.repository.BatchMembershipRepository;
import com.farmunity.repository.CooperativeBatchRepository;
import com.farmunity.util.HashUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgreementService {

    private final AgreementRepository agreementRepository;
    private final CooperativeBatchRepository cooperativeBatchRepository;
    private final BatchMembershipRepository batchMembershipRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public AgreementResponse createAgreement(CreateAgreementRequest req, Long coordinatorId) {
        CooperativeBatch batch = cooperativeBatchRepository.findById(req.getCooperativeBatchId())
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + req.getCooperativeBatchId()));

        Optional<Agreement> existing = agreementRepository.findByCooperativeBatchId(batch.getId());
        if (existing.isPresent()) {
            return mapToResponse(existing.get());
        }

        BigDecimal grossValue = batch.getTotalAllocatedQty().multiply(req.getAgreedPricePerKg());
        BigDecimal transportDeduction = req.getTransportDeductionPerKg() != null ?
                req.getTransportDeductionPerKg() : BigDecimal.ZERO;

        Agreement agreement = Agreement.builder()
                .cooperativeBatch(batch)
                .version(1)
                .status(AgreementStatus.PENDING_APPROVAL)
                .agreedPricePerKg(req.getAgreedPricePerKg())
                .overlapLow(batch.getBuyerRequirement().getPriceMin())
                .overlapHigh(batch.getBuyerRequirement().getPriceMax())
                .totalValueGross(grossValue)
                .transportDeductionPerKg(transportDeduction)
                .platformFeeRate(new BigDecimal("0.0200"))
                .build();

        Agreement saved = agreementRepository.save(agreement);

        batch.setStatus(BatchStatus.NEGOTIATING);
        cooperativeBatchRepository.save(batch);

        eventPublisher.publishEvent(new AuditEvent(
                this, "AGREEMENT", saved.getId(), "AGREEMENT_CREATED",
                coordinatorId, "COORDINATOR",
                "Created Version 1 Agreement at ₹" + req.getAgreedPricePerKg() + "/kg for batch " + batch.getId(),
                null, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public AgreementResponse processFarmerNegotiation(Long agreementId, Long farmerId, FarmerNegotiationRequest req) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found: " + agreementId));

        if (agreement.getStatus() == AgreementStatus.LOCKED_V1 || agreement.getStatus() == AgreementStatus.LOCKED_V2) {
            throw new IllegalStateException("Cannot alter locked agreement. Propose an amendment to unlock a new version.");
        }

        BatchMembership membership = batchMembershipRepository
                .findByCooperativeBatchIdAndFarmerId(agreement.getCooperativeBatch().getId(), farmerId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer " + farmerId + " is not a member of batch " + agreement.getCooperativeBatch().getId()));

        String prevDecision = membership.getFarmerDecision();
        membership.setFarmerDecision(req.getDecision());
        membership.setFarmerNote(req.getNote());

        if ("REDUCED".equalsIgnoreCase(req.getDecision()) && req.getRevisedQuantity() != null) {
            membership.setAllocatedQty(req.getRevisedQuantity());
        }

        batchMembershipRepository.save(membership);

        eventPublisher.publishEvent(new AuditEvent(
                this, "BATCH_MEMBERSHIP", membership.getId(), "FARMER_DECISION",
                farmerId, "FARMER",
                "Farmer " + farmerId + " submitted decision: " + req.getDecision() + (req.getNote() != null ? " (" + req.getNote() + ")" : ""),
                prevDecision, req.getDecision()
        ));

        // Check if ALL farmers in the batch have ACCEPTED
        List<BatchMembership> allMembers = batchMembershipRepository.findByCooperativeBatchId(agreement.getCooperativeBatch().getId());
        boolean allAccepted = allMembers.stream().allMatch(m -> "ACCEPTED".equalsIgnoreCase(m.getFarmerDecision()));

        if (allAccepted) {
            lockAgreement(agreement);
        }

        return mapToResponse(agreement);
    }

    private void lockAgreement(Agreement agreement) {
        String previousState = agreement.getStatus().name();
        AgreementStatus nextLockedStatus = (agreement.getVersion() == 1) ? AgreementStatus.LOCKED_V1 : AgreementStatus.LOCKED_V2;
        agreement.setStatus(nextLockedStatus);

        // Compute deterministic SHA-256 canonical integrity hash
        Map<String, Object> agreementHashData = new TreeMap<>();
        agreementHashData.put("agreementId", agreement.getId());
        agreementHashData.put("version", agreement.getVersion());
        agreementHashData.put("agreedPricePerKg", agreement.getAgreedPricePerKg().toString());
        agreementHashData.put("totalValueGross", agreement.getTotalValueGross().toString());
        agreementHashData.put("batchId", agreement.getCooperativeBatch().getId());
        agreementHashData.put("lockedAt", System.currentTimeMillis());

        String hash = HashUtil.sha256CanonicalJson(agreementHashData);
        agreement.setIntegrityHash(hash);

        agreementRepository.save(agreement);

        CooperativeBatch batch = agreement.getCooperativeBatch();
        batch.setStatus(BatchStatus.AGREED);
        cooperativeBatchRepository.save(batch);

        eventPublisher.publishEvent(new AuditEvent(
                this, "AGREEMENT", agreement.getId(), "AGREEMENT_LOCKED",
                null, "SYSTEM",
                String.format("Agreement locked as %s with integrity hash: %s", nextLockedStatus, hash),
                previousState, nextLockedStatus.name()
        ));
    }

    @Transactional
    public AgreementResponse proposeAmendment(Long agreementId, AmendmentRequest req, Long coordinatorId) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found: " + agreementId));

        if (agreement.getStatus() != AgreementStatus.LOCKED_V1 && agreement.getStatus() != AgreementStatus.LOCKED_V2) {
            throw new IllegalStateException("Only locked agreements can have amendments proposed");
        }

        String previousState = agreement.getStatus().name();
        int newVersion = agreement.getVersion() + 1;

        agreement.setVersion(newVersion);
        agreement.setStatus(AgreementStatus.PENDING_V2);
        agreement.setAgreedPricePerKg(req.getNewPricePerKg());
        agreement.setTotalValueGross(agreement.getCooperativeBatch().getTotalAllocatedQty().multiply(req.getNewPricePerKg()));
        agreement.setAmendmentReason(req.getReason());
        agreement.setIntegrityHash(null); // Clear hash until re-approved and re-locked

        agreementRepository.save(agreement);

        // Reset all farmer decisions to PENDING for fresh approval
        List<BatchMembership> memberships = batchMembershipRepository.findByCooperativeBatchId(agreement.getCooperativeBatch().getId());
        for (BatchMembership m : memberships) {
            m.setFarmerDecision("PENDING");
            m.setFarmerNote("Requires re-approval for Version " + newVersion + ": " + req.getReason());
            batchMembershipRepository.save(m);
        }

        CooperativeBatch batch = agreement.getCooperativeBatch();
        batch.setStatus(BatchStatus.NEGOTIATING);
        cooperativeBatchRepository.save(batch);

        eventPublisher.publishEvent(new AuditEvent(
                this, "AGREEMENT", agreement.getId(), "AMENDMENT_PROPOSED",
                coordinatorId, "COORDINATOR",
                String.format("Proposed amendment to Version %d. New Price: ₹%s/kg. Reason: %s",
                        newVersion, req.getNewPricePerKg(), req.getReason()),
                previousState, agreement.getStatus().name()
        ));

        return mapToResponse(agreement);
    }

    public AgreementResponse getAgreementById(Long id) {
        Agreement agreement = agreementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agreement not found: " + id));
        return mapToResponse(agreement);
    }

    public AgreementResponse getAgreementByBatchId(Long batchId) {
        Agreement agreement = agreementRepository.findByCooperativeBatchId(batchId)
                .orElseThrow(() -> new IllegalArgumentException("No agreement for batch: " + batchId));
        return mapToResponse(agreement);
    }

    public AgreementResponse mapToResponse(Agreement agreement) {
        List<BatchMembership> memberships = batchMembershipRepository
                .findByCooperativeBatchId(agreement.getCooperativeBatch().getId());

        List<BatchFormationResponse.MemberBreakdown> members = memberships.stream()
                .map(m -> BatchFormationResponse.MemberBreakdown.builder()
                        .membershipId(m.getId())
                        .farmerId(m.getFarmer().getId())
                        .farmerName(m.getFarmer().getName())
                        .farmerTrustTier(m.getFarmer().getTrustTier().name())
                        .farmerReliabilityScore(m.getFarmer().getReliabilityScore())
                        .listingId(m.getProduceListing().getId())
                        .allocatedQty(m.getAllocatedQty())
                        .verifiedQty(m.getProduceListing().getVerifiedQty())
                        .inclusionReason(m.getInclusionReason())
                        .farmerDecision(m.getFarmerDecision())
                        .farmerNote(m.getFarmerNote())
                        .build())
                .collect(Collectors.toList());

        return AgreementResponse.builder()
                .id(agreement.getId())
                .cooperativeBatchId(agreement.getCooperativeBatch().getId())
                .buyerRequirementId(agreement.getCooperativeBatch().getBuyerRequirement().getId())
                .buyerName(agreement.getCooperativeBatch().getBuyerRequirement().getBuyer().getName())
                .product(agreement.getCooperativeBatch().getBuyerRequirement().getProduct())
                .version(agreement.getVersion())
                .versionLock(agreement.getVersionLock())
                .status(agreement.getStatus())
                .agreedPricePerKg(agreement.getAgreedPricePerKg())
                .overlapLow(agreement.getOverlapLow())
                .overlapHigh(agreement.getOverlapHigh())
                .totalValueGross(agreement.getTotalValueGross())
                .transportDeductionPerKg(agreement.getTransportDeductionPerKg())
                .platformFeeRate(agreement.getPlatformFeeRate())
                .amendmentReason(agreement.getAmendmentReason())
                .integrityHash(agreement.getIntegrityHash())
                .members(members)
                .createdAt(agreement.getCreatedAt())
                .updatedAt(agreement.getUpdatedAt())
                .build();
    }
}
