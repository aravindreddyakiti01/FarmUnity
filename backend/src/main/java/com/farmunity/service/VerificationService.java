package com.farmunity.service;

import com.farmunity.dto.request.VerificationRequest;
import com.farmunity.dto.response.VerificationResponse;
import com.farmunity.entity.Coordinator;
import com.farmunity.entity.CropConfig;
import com.farmunity.entity.ProduceListing;
import com.farmunity.entity.VerificationRecord;
import com.farmunity.entity.enums.ProduceListingStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.CoordinatorRepository;
import com.farmunity.repository.CropConfigRepository;
import com.farmunity.repository.ProduceListingRepository;
import com.farmunity.repository.VerificationRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationService {

    private final ProduceListingRepository produceListingRepository;
    private final VerificationRecordRepository verificationRecordRepository;
    private final CoordinatorRepository coordinatorRepository;
    private final CropConfigRepository cropConfigRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public VerificationResponse verifyListing(Long listingId, VerificationRequest req, Long coordinatorId) {
        ProduceListing listing = produceListingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Produce listing not found: " + listingId));

        Coordinator coordinator = coordinatorRepository.findById(coordinatorId)
                .orElseThrow(() -> new IllegalArgumentException("Coordinator not found: " + coordinatorId));

        CropConfig cropConfig = cropConfigRepository.findByCropNameIgnoreCase(listing.getCrop())
                .orElseGet(() -> CropConfig.builder()
                        .cropName(listing.getCrop())
                        .moistureMin(new BigDecimal("12.00"))
                        .moistureMax(new BigDecimal("14.00"))
                        .expectedYieldRatio(new BigDecimal("0.65"))
                        .maxDistanceKm(new BigDecimal("100.00"))
                        .harvestWindowDays(30)
                        .build());

        BigDecimal moisture = req.getMoistureReading();
        boolean isCompatible = moisture.compareTo(cropConfig.getMoistureMin()) >= 0 &&
                               moisture.compareTo(cropConfig.getMoistureMax()) <= 0;

        String previousState = listing.getStatus().name();
        ProduceListingStatus newStatus;
        BigDecimal verifiedQuantity;

        if (isCompatible) {
            newStatus = ProduceListingStatus.VERIFIED_COMPATIBLE;
            verifiedQuantity = req.getVerifiedQty();
            listing.applyVerification(verifiedQuantity, moisture);
            listing.setStatus(newStatus);
        } else {
            // Lot excluded from cooperative formation pool and routed to DRYING_REVIEW
            newStatus = ProduceListingStatus.DRYING_REVIEW;
            verifiedQuantity = null; // Incompatible lot cannot be allocated to pool
            listing.applyVerification(null, moisture);
            listing.setStatus(newStatus);
        }

        produceListingRepository.save(listing);

        VerificationRecord record = VerificationRecord.builder()
                .produceListing(listing)
                .verifiedQty(verifiedQuantity)
                .moistureReading(moisture)
                .verifier(coordinator)
                .timestamp(LocalDateTime.now())
                .evidenceNotes(req.getEvidenceNotes() + (isCompatible ? " [MOISTURE_PASS]" : " [MOISTURE_FAIL: Routed to DRYING_REVIEW]"))
                .photoUrls(req.getPhotoUrls())
                .build();

        VerificationRecord savedRecord = verificationRecordRepository.save(record);

        eventPublisher.publishEvent(new AuditEvent(
                this, "PRODUCE_LISTING", listing.getId(),
                isCompatible ? "VERIFICATION_PASSED_COMPATIBLE" : "VERIFICATION_FAILED_DRYING_REVIEW",
                coordinatorId, "COORDINATOR",
                String.format("Moisture: %.2f%% (Band: %.1f%%-%.1f%%). Status: %s. Verified Qty: %s kg.",
                        moisture, cropConfig.getMoistureMin(), cropConfig.getMoistureMax(),
                        newStatus, verifiedQuantity != null ? verifiedQuantity : "0 (Excluded)"),
                previousState, newStatus.name()
        ));

        return VerificationResponse.builder()
                .id(savedRecord.getId())
                .produceListingId(listing.getId())
                .declaredQty(listing.getDeclaredQty())
                .verifiedQty(verifiedQuantity)
                .moistureReading(moisture)
                .cropMoistureMin(cropConfig.getMoistureMin())
                .cropMoistureMax(cropConfig.getMoistureMax())
                .isCompatible(isCompatible)
                .status(newStatus)
                .verifierId(coordinator.getId())
                .verifierName(coordinator.getName())
                .evidenceNotes(savedRecord.getEvidenceNotes())
                .timestamp(savedRecord.getTimestamp())
                .build();
    }

    public VerificationResponse getVerificationForListing(Long listingId) {
        VerificationRecord record = verificationRecordRepository.findByProduceListingId(listingId)
                .orElseThrow(() -> new IllegalArgumentException("No verification record found for listing: " + listingId));

        ProduceListing listing = record.getProduceListing();
        CropConfig config = cropConfigRepository.findByCropNameIgnoreCase(listing.getCrop())
                .orElse(null);

        return VerificationResponse.builder()
                .id(record.getId())
                .produceListingId(listing.getId())
                .declaredQty(listing.getDeclaredQty())
                .verifiedQty(record.getVerifiedQty())
                .moistureReading(record.getMoistureReading())
                .cropMoistureMin(config != null ? config.getMoistureMin() : new BigDecimal("12.00"))
                .cropMoistureMax(config != null ? config.getMoistureMax() : new BigDecimal("14.00"))
                .isCompatible(listing.getStatus() == ProduceListingStatus.VERIFIED_COMPATIBLE)
                .status(listing.getStatus())
                .verifierId(record.getVerifier().getId())
                .verifierName(record.getVerifier().getName())
                .evidenceNotes(record.getEvidenceNotes())
                .timestamp(record.getTimestamp())
                .build();
    }
}
