package com.farmunity.service;

import com.farmunity.dto.request.ExecuteRecoveryRequest;
import com.farmunity.dto.response.FailureRecoveryResponse;
import com.farmunity.dto.response.ProduceListingResponse;
import com.farmunity.entity.*;
import com.farmunity.entity.enums.BatchStatus;
import com.farmunity.entity.enums.ProduceListingStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.*;
import com.farmunity.util.HashUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FailureRecoveryService {

    private final CooperativeBatchRepository cooperativeBatchRepository;
    private final BatchMembershipRepository batchMembershipRepository;
    private final ProduceListingRepository produceListingRepository;
    private final AgreementRepository agreementRepository;
    private final ProduceListingService produceListingService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public FailureRecoveryResponse detectFarmerCancellation(Long batchId, Long membershipId, String reason, Long actorId) {
        CooperativeBatch batch = cooperativeBatchRepository.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));

        BatchMembership membership = batchMembershipRepository.findById(membershipId)
                .orElseThrow(() -> new IllegalArgumentException("Batch membership not found: " + membershipId));

        BigDecimal shortfall = membership.getAllocatedQty();

        membership.setFarmerDecision("DECLINED");
        membership.setFarmerNote("Cancellation: " + (reason != null ? reason : "Unavailable for pickup"));
        batchMembershipRepository.save(membership);

        batch.setStatus(BatchStatus.FORMING);
        cooperativeBatchRepository.save(batch);

        String crop = batch.getBuyerRequirement().getProduct();
        List<ProduceListing> compatibleListings = produceListingRepository.findAll().stream()
                .filter(l -> l.getCrop().equalsIgnoreCase(crop))
                .filter(l -> l.getStatus() == ProduceListingStatus.VERIFIED_COMPATIBLE)
                .filter(l -> l.getVerifiedQty() != null && l.getVerifiedQty().compareTo(BigDecimal.ZERO) > 0)
                .filter(l -> !l.getId().equals(membership.getProduceListing().getId()))
                .collect(Collectors.toList());

        List<ProduceListingResponse> replacementDtos = compatibleListings.stream()
                .map(produceListingService::mapToResponse)
                .collect(Collectors.toList());

        List<FailureRecoveryResponse.RecoveryOption> options = new ArrayList<>();
        if (!compatibleListings.isEmpty()) {
            options.add(FailureRecoveryResponse.RecoveryOption.builder()
                    .optionId("OPTION_REPLACE_FARMER")
                    .title("Substitute Compatible Verified Producer")
                    .description("Allocate " + shortfall + " kg from compatible verified inventory within radius.")
                    .impactOnAgreement("Maintains contract target. Agreement re-locked at Version N+1 with updated SHA-256 hash.")
                    .recommended(true)
                    .build());
        }

        options.add(FailureRecoveryResponse.RecoveryOption.builder()
                .optionId("OPTION_REDUCE_QUANTITY")
                .title("Downscale Batch Volume to Verified Balance")
                .description("Deliver verified available quantity without replacement. Deduct " + shortfall + " kg.")
                .impactOnAgreement("Requires buyer consent. Buyer commitment ledger deposit adjusted proportionally.")
                .recommended(compatibleListings.isEmpty())
                .build());

        options.add(FailureRecoveryResponse.RecoveryOption.builder()
                .optionId("OPTION_RESCHEDULE")
                .title("Extend Pickup Window by 24 Hours")
                .description("Hold batch open to coordinate deferred collection with primary producer.")
                .impactOnAgreement("Delays dispatch timeline. Agreement version incremented.")
                .recommended(false)
                .build());

        eventPublisher.publishEvent(new AuditEvent(
                this,
                "COOPERATIVE_BATCH",
                batchId,
                "FAILURE_DETECTED",
                actorId,
                "COORDINATOR",
                "Farmer cancellation detected for membership " + membershipId + " (" + shortfall + " kg). Reason: " + reason,
                "AGREED",
                "RECOVERY_REQUIRED"
        ));

        return FailureRecoveryResponse.builder()
                .failureType("FARMER_CANCELLATION")
                .batchId(batchId)
                .affectedMembershipId(membershipId)
                .shortfallKg(shortfall)
                .status("RECOVERY_PROPOSED")
                .failureDescription("Producer " + membership.getFarmer().getName() + " is unavailable to fulfill " + shortfall + " kg contribution.")
                .proposedOptions(options)
                .compatibleReplacements(replacementDtos)
                .build();
    }

    @Transactional
    public FailureRecoveryResponse executeRecovery(Long batchId, Long affectedMembershipId, ExecuteRecoveryRequest req, Long actorId) {
        CooperativeBatch batch = cooperativeBatchRepository.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));

        BatchMembership oldMembership = batchMembershipRepository.findById(affectedMembershipId)
                .orElseThrow(() -> new IllegalArgumentException("Batch membership not found: " + affectedMembershipId));

        String resolution;

        if ("OPTION_REPLACE_FARMER".equalsIgnoreCase(req.getOptionId()) && req.getReplacementListingId() != null) {
            ProduceListing replacementListing = produceListingRepository.findById(req.getReplacementListingId())
                    .orElseThrow(() -> new IllegalArgumentException("Replacement listing not found: " + req.getReplacementListingId()));

            BigDecimal requiredQty = oldMembership.getAllocatedQty();
            BigDecimal available = replacementListing.getVerifiedQty() != null ? replacementListing.getVerifiedQty() : replacementListing.getDeclaredQty();
            BigDecimal allocatedFromReplacement = available.min(requiredQty);

            BatchMembership newMembership = BatchMembership.builder()
                    .cooperativeBatch(batch)
                    .farmer(replacementListing.getFarmer())
                    .produceListing(replacementListing)
                    .allocatedQty(allocatedFromReplacement)
                    .inclusionReason("Automated Failure Recovery: Replaced membership " + affectedMembershipId)
                    .farmerDecision("ACCEPTED")
                    .farmerNote("Emergency substitution accepted by coordinator desk")
                    .build();
            batchMembershipRepository.save(newMembership);

            resolution = "Substituted with Farmer " + replacementListing.getFarmer().getName() + " (" + allocatedFromReplacement + " kg).";

        } else if ("OPTION_REDUCE_QUANTITY".equalsIgnoreCase(req.getOptionId())) {
            BigDecimal shortfall = oldMembership.getAllocatedQty();
            batch.setTotalAllocatedQty(batch.getTotalAllocatedQty().subtract(shortfall));
            batch.setShortfallQty(shortfall);
            cooperativeBatchRepository.save(batch);

            resolution = "Batch quantity downscaled by " + shortfall + " kg. New total: " + batch.getTotalAllocatedQty() + " kg.";
        } else {
            resolution = "Rescheduled pickup run with producer grace window.";
        }

        batch.setStatus(BatchStatus.AGREED);
        cooperativeBatchRepository.save(batch);

        agreementRepository.findByCooperativeBatchId(batchId).ifPresent(agreement -> {
            agreement.setVersion(agreement.getVersion() + 1);
            agreement.setAmendmentReason("Failure recovery: " + resolution);
            agreement.setIntegrityHash(HashUtil.sha256CanonicalJson(Map.of(
                    "agreementId", agreement.getId().toString(),
                    "version", agreement.getVersion().toString(),
                    "totalQty", batch.getTotalAllocatedQty().toString(),
                    "pricePerKg", agreement.getAgreedPricePerKg() != null ? agreement.getAgreedPricePerKg().toString() : "26.00"
            )));
            agreementRepository.save(agreement);
        });

        eventPublisher.publishEvent(new AuditEvent(
                this,
                "COOPERATIVE_BATCH",
                batchId,
                "FAILURE_RECOVERED",
                actorId,
                "COORDINATOR",
                "Recovery executed: " + resolution + ". Reason: " + req.getReason(),
                "RECOVERY_REQUIRED",
                "RECOVERED_AGREED"
        ));

        return FailureRecoveryResponse.builder()
                .failureType("FARMER_CANCELLATION")
                .batchId(batchId)
                .affectedMembershipId(affectedMembershipId)
                .status("RECOVERED")
                .failureDescription("Producer shortfall addressed.")
                .selectedResolution(resolution)
                .build();
    }
}
