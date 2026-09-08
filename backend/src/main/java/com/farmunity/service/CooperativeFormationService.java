package com.farmunity.service;

import com.farmunity.dto.response.BatchFormationResponse;
import com.farmunity.entity.*;
import com.farmunity.entity.enums.BatchStatus;
import com.farmunity.entity.enums.ProduceListingStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.*;
import com.farmunity.util.HaversineUtil;
import com.farmunity.util.PriceRange;
import com.farmunity.util.PriceResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CooperativeFormationService {

    private final ProduceListingRepository produceListingRepository;
    private final BuyerRequirementRepository buyerRequirementRepository;
    private final CooperativeBatchRepository cooperativeBatchRepository;
    private final BatchMembershipRepository batchMembershipRepository;
    private final CropConfigRepository cropConfigRepository;
    private final ThresholdPricingService thresholdPricingService;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Standalone testable pure algorithm method for forming a cooperative batch from supply pool.
     */
    public BatchFormationResult formBatch(BuyerRequirement req, List<ProduceListing> pool, CropConfig cropConfig) {
        BigDecimal targetQty = req.getQuantityKg();
        BigDecimal remainingQty = targetQty;
        List<CandidateMembership> allocatedMembers = new ArrayList<>();

        double destLat = req.getDestinationLatitude() != null ? req.getDestinationLatitude() : 12.9716;
        double destLon = req.getDestinationLongitude() != null ? req.getDestinationLongitude() : 77.5946;
        double maxDist = cropConfig != null && cropConfig.getMaxDistanceKm() != null ?
                cropConfig.getMaxDistanceKm().doubleValue() : 100.0;
        int harvestWindow = cropConfig != null ? cropConfig.getHarvestWindowDays() : 30;

        // 1. Hard filters
        List<EligibleCandidate> eligibleList = new ArrayList<>();
        PriceRange buyerRange = new PriceRange(req.getPriceMin(), req.getPriceMax());

        for (ProduceListing listing : pool) {
            // Filter a: Crop match
            if (!listing.getCrop().equalsIgnoreCase(req.getProduct())) {
                continue;
            }
            // Filter b: Status must be VERIFIED_COMPATIBLE
            if (listing.getStatus() != ProduceListingStatus.VERIFIED_COMPATIBLE) {
                continue;
            }
            // Filter c: Verified quantity must be positive
            if (listing.getVerifiedQty() == null || listing.getVerifiedQty().compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }
            // Filter d: Distance filter
            double distance = 0.0;
            if (listing.getLatitude() != null && listing.getLongitude() != null) {
                distance = HaversineUtil.distanceKm(listing.getLatitude(), listing.getLongitude(), destLat, destLon);
                if (distance > maxDist) {
                    continue;
                }
            }
            // Filter e: Harvest window
            if (listing.getHarvestDate() != null) {
                long daysDiff = Math.abs(java.time.temporal.ChronoUnit.DAYS.between(listing.getHarvestDate(), LocalDate.now()));
                if (daysDiff > harvestWindow) {
                    continue;
                }
            }
            // Filter f: Price overlap check
            PriceResult priceCheck = thresholdPricingService.computeFeasiblePrice(listing.getMinPricePerKg(), buyerRange, null);
            if (!priceCheck.isFeasible()) {
                continue;
            }

            eligibleList.add(new EligibleCandidate(listing, distance, priceCheck));
        }

        // 2. Sort eligible candidates by reliability score DESC, then distance ASC
        eligibleList.sort((a, b) -> {
            int relComp = b.listing.getFarmer().getReliabilityScore().compareTo(a.listing.getFarmer().getReliabilityScore());
            if (relComp != 0) return relComp;
            return Double.compare(a.distanceKm, b.distanceKm);
        });

        // 3. Greedy allocation
        BigDecimal totalAllocated = BigDecimal.ZERO;
        for (EligibleCandidate candidate : eligibleList) {
            if (remainingQty.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal availableQty = candidate.listing.getVerifiedQty();
            BigDecimal allocated = availableQty.min(remainingQty);

            String reason = String.format("reliability:%.1f,distance:%.1fkm,price_overlap:[₹%.2f-₹%.2f]",
                    candidate.listing.getFarmer().getReliabilityScore(),
                    candidate.distanceKm,
                    candidate.priceResult.getOverlapLow(),
                    candidate.priceResult.getOverlapHigh());

            allocatedMembers.add(new CandidateMembership(
                    candidate.listing,
                    allocated,
                    candidate.distanceKm,
                    reason
            ));

            totalAllocated = totalAllocated.add(allocated);
            remainingQty = remainingQty.subtract(allocated);
        }

        BigDecimal shortfall = targetQty.subtract(totalAllocated).max(BigDecimal.ZERO);
        boolean isFulfilled = shortfall.compareTo(BigDecimal.ZERO) == 0;

        return new BatchFormationResult(allocatedMembers, totalAllocated, shortfall, isFulfilled);
    }

    @Transactional
    public BatchFormationResponse formAndPersistBatch(Long buyerRequirementId, Long coordinatorId) {
        BuyerRequirement req = buyerRequirementRepository.findById(buyerRequirementId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer requirement not found: " + buyerRequirementId));

        List<ProduceListing> pool = produceListingRepository.findByCropIgnoreCaseAndStatus(
                req.getProduct(), ProduceListingStatus.VERIFIED_COMPATIBLE
        );

        CropConfig config = cropConfigRepository.findByCropNameIgnoreCase(req.getProduct()).orElse(null);

        BatchFormationResult result = formBatch(req, pool, config);

        CooperativeBatch batch = CooperativeBatch.builder()
                .buyerRequirement(req)
                .status(BatchStatus.FORMED)
                .shortfallQty(result.shortfallQty())
                .totalAllocatedQty(result.totalAllocatedQty())
                .build();

        CooperativeBatch savedBatch = cooperativeBatchRepository.save(batch);

        List<BatchFormationResponse.MemberBreakdown> memberBreakdowns = new ArrayList<>();

        for (CandidateMembership cm : result.members()) {
            BatchMembership membership = BatchMembership.builder()
                    .cooperativeBatch(savedBatch)
                    .farmer(cm.listing().getFarmer())
                    .produceListing(cm.listing())
                    .allocatedQty(cm.allocatedQty())
                    .inclusionReason(cm.reason())
                    .farmerDecision("PENDING")
                    .build();

            BatchMembership savedMembership = batchMembershipRepository.save(membership);

            // Update listing status to IN_BATCH
            ProduceListing listing = cm.listing();
            listing.setStatus(ProduceListingStatus.IN_BATCH);
            produceListingRepository.save(listing);

            memberBreakdowns.add(BatchFormationResponse.MemberBreakdown.builder()
                    .membershipId(savedMembership.getId())
                    .farmerId(membership.getFarmer().getId())
                    .farmerName(membership.getFarmer().getName())
                    .farmerTrustTier(membership.getFarmer().getTrustTier().name())
                    .farmerReliabilityScore(membership.getFarmer().getReliabilityScore())
                    .listingId(listing.getId())
                    .allocatedQty(membership.getAllocatedQty())
                    .verifiedQty(listing.getVerifiedQty())
                    .distanceKm(cm.distanceKm())
                    .inclusionReason(membership.getInclusionReason())
                    .farmerDecision(membership.getFarmerDecision())
                    .farmerNote(membership.getFarmerNote())
                    .build());
        }

        eventPublisher.publishEvent(new AuditEvent(
                this, "COOPERATIVE_BATCH", savedBatch.getId(), "BATCH_FORMED",
                coordinatorId, "COORDINATOR",
                String.format("Formed batch with %d farmers. Total allocated: %s kg. Shortfall: %s kg.",
                        result.members().size(), result.totalAllocatedQty(), result.shortfallQty()),
                null, savedBatch.getStatus().name()
        ));

        return BatchFormationResponse.builder()
                .id(savedBatch.getId())
                .buyerRequirementId(req.getId())
                .product(req.getProduct())
                .requiredQty(req.getQuantityKg())
                .totalAllocatedQty(result.totalAllocatedQty())
                .shortfallQty(result.shortfallQty())
                .isFullyAllocated(result.isFulfilled())
                .status(savedBatch.getStatus())
                .members(memberBreakdowns)
                .createdAt(savedBatch.getCreatedAt())
                .build();
    }

    public BatchFormationResponse getBatchById(Long batchId) {
        CooperativeBatch batch = cooperativeBatchRepository.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));

        List<BatchMembership> memberships = batchMembershipRepository.findByCooperativeBatchId(batchId);
        List<BatchFormationResponse.MemberBreakdown> memberBreakdowns = memberships.stream()
                .map(m -> BatchFormationResponse.MemberBreakdown.builder()
                        .membershipId(m.getId())
                        .farmerId(m.getFarmer().getId())
                        .farmerName(m.getFarmer().getName())
                        .farmerTrustTier(m.getFarmer().getTrustTier().name())
                        .farmerReliabilityScore(m.getFarmer().getReliabilityScore())
                        .listingId(m.getProduceListing().getId())
                        .allocatedQty(m.getAllocatedQty())
                        .verifiedQty(m.getProduceListing().getVerifiedQty())
                        .distanceKm(HaversineUtil.distanceKm(
                                m.getProduceListing().getLatitude() != null ? m.getProduceListing().getLatitude() : 12.97,
                                m.getProduceListing().getLongitude() != null ? m.getProduceListing().getLongitude() : 77.59,
                                batch.getBuyerRequirement().getDestinationLatitude() != null ? batch.getBuyerRequirement().getDestinationLatitude() : 12.97,
                                batch.getBuyerRequirement().getDestinationLongitude() != null ? batch.getBuyerRequirement().getDestinationLongitude() : 77.59
                        ))
                        .inclusionReason(m.getInclusionReason())
                        .farmerDecision(m.getFarmerDecision())
                        .farmerNote(m.getFarmerNote())
                        .build())
                .collect(Collectors.toList());

        return BatchFormationResponse.builder()
                .id(batch.getId())
                .buyerRequirementId(batch.getBuyerRequirement().getId())
                .product(batch.getBuyerRequirement().getProduct())
                .requiredQty(batch.getBuyerRequirement().getQuantityKg())
                .totalAllocatedQty(batch.getTotalAllocatedQty())
                .shortfallQty(batch.getShortfallQty())
                .isFullyAllocated(batch.getShortfallQty() == null || batch.getShortfallQty().compareTo(BigDecimal.ZERO) == 0)
                .status(batch.getStatus())
                .members(memberBreakdowns)
                .createdAt(batch.getCreatedAt())
                .build();
    }

    public record CandidateMembership(ProduceListing listing, BigDecimal allocatedQty, double distanceKm, String reason) {}
    public record EligibleCandidate(ProduceListing listing, double distanceKm, PriceResult priceResult) {}
    public record BatchFormationResult(List<CandidateMembership> members, BigDecimal totalAllocatedQty, BigDecimal shortfallQty, boolean isFulfilled) {}
}
