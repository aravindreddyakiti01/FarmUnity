package com.farmunity.service;

import com.farmunity.dto.request.ProduceListingRequest;
import com.farmunity.dto.response.ProduceListingResponse;
import com.farmunity.entity.Farmer;
import com.farmunity.entity.ProduceListing;
import com.farmunity.entity.enums.ProduceListingStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.FarmerRepository;
import com.farmunity.repository.ProduceListingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProduceListingService {

    private final ProduceListingRepository produceListingRepository;
    private final FarmerRepository farmerRepository;
    private final RateLimitService rateLimitService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ProduceListingResponse createListing(ProduceListingRequest req, Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer not found: " + farmerId));

        rateLimitService.checkListingRateLimit(farmerId, farmer.getTrustTier());

        // CRITICAL: verifiedQty is initialized as null.
        // It is strictly NEVER copied from declaredQty.
        ProduceListing listing = ProduceListing.builder()
                .farmer(farmer)
                .crop(req.getCrop().trim().toLowerCase())
                .variety(req.getVariety())
                .declaredQty(req.getDeclaredQty())
                .verifiedQty(null) // Deliberately null until coordinator inspection
                .harvestDate(req.getHarvestDate())
                .minPricePerKg(req.getMinPricePerKg())
                .moistureReading(req.getMoistureReading())
                .latitude(req.getLatitude() != null ? req.getLatitude() : farmer.getLatitude())
                .longitude(req.getLongitude() != null ? req.getLongitude() : farmer.getLongitude())
                .storageCondition(req.getStorageCondition())
                .status(ProduceListingStatus.DRAFT)
                .build();

        ProduceListing saved = produceListingRepository.save(listing);

        eventPublisher.publishEvent(new AuditEvent(
                this, "PRODUCE_LISTING", saved.getId(), "LISTING_CREATED",
                farmerId, "FARMER",
                "Created produce listing for " + saved.getCrop() + " (Declared Qty: " + saved.getDeclaredQty() + " kg)",
                null, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public ProduceListingResponse submitForVerification(Long listingId, Long farmerId) {
        ProduceListing listing = produceListingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + listingId));

        if (!listing.getFarmer().getId().equals(farmerId)) {
            throw new IllegalStateException("Unauthorized to submit listing " + listingId);
        }

        if (listing.getStatus() != ProduceListingStatus.DRAFT) {
            throw new IllegalStateException("Listing can only be submitted from DRAFT status");
        }

        String previousState = listing.getStatus().name();
        listing.setStatus(ProduceListingStatus.PENDING_VERIFICATION);
        ProduceListing saved = produceListingRepository.save(listing);

        eventPublisher.publishEvent(new AuditEvent(
                this, "PRODUCE_LISTING", saved.getId(), "LISTING_SUBMITTED_FOR_VERIFICATION",
                farmerId, "FARMER",
                "Listing submitted for coordinator verification",
                previousState, saved.getStatus().name()
        ));

        return mapToResponse(saved);
    }

    public List<ProduceListingResponse> getListingsForFarmer(Long farmerId) {
        return produceListingRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProduceListingResponse> getPendingVerificationListings() {
        return produceListingRepository.findByStatus(ProduceListingStatus.PENDING_VERIFICATION)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProduceListingResponse getListingById(Long id) {
        ProduceListing listing = produceListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + id));
        return mapToResponse(listing);
    }

    public ProduceListingResponse mapToResponse(ProduceListing listing) {
        return ProduceListingResponse.builder()
                .id(listing.getId())
                .farmerId(listing.getFarmer().getId())
                .farmerName(listing.getFarmer().getName())
                .farmerTrustTier(listing.getFarmer().getTrustTier().name())
                .farmerReliabilityScore(listing.getFarmer().getReliabilityScore())
                .crop(listing.getCrop())
                .variety(listing.getVariety())
                .declaredQty(listing.getDeclaredQty())
                .verifiedQty(listing.getVerifiedQty())
                .harvestDate(listing.getHarvestDate())
                .minPricePerKg(listing.getMinPricePerKg())
                .moistureReading(listing.getMoistureReading())
                .latitude(listing.getLatitude())
                .longitude(listing.getLongitude())
                .storageCondition(listing.getStorageCondition())
                .status(listing.getStatus())
                .createdAt(listing.getCreatedAt())
                .build();
    }
}
