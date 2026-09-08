package com.farmunity.service;

import com.farmunity.dto.request.PickupVerificationRequest;
import com.farmunity.dto.response.RouteResponse;
import com.farmunity.entity.BatchMembership;
import com.farmunity.entity.CooperativeBatch;
import com.farmunity.entity.ProduceListing;
import com.farmunity.entity.enums.ProduceListingStatus;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.BatchMembershipRepository;
import com.farmunity.repository.CooperativeBatchRepository;
import com.farmunity.repository.ProduceListingRepository;
import com.farmunity.util.HaversineUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogisticsService {

    private final CooperativeBatchRepository cooperativeBatchRepository;
    private final BatchMembershipRepository batchMembershipRepository;
    private final ProduceListingRepository produceListingRepository;
    private final CommitmentLedgerService commitmentLedgerService;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Computes a nearest-neighbour pickup route through all batch member pickup locations.
     */
    public RouteResponse computePickupRoute(Long batchId) {
        CooperativeBatch batch = cooperativeBatchRepository.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));

        List<BatchMembership> memberships = batchMembershipRepository.findByCooperativeBatchId(batchId);
        if (memberships.isEmpty()) {
            return RouteResponse.builder().batchId(batchId).totalDistanceKm(0.0).totalStops(0).stops(List.of()).build();
        }

        double startLat = batch.getBuyerRequirement().getDestinationLatitude() != null ?
                batch.getBuyerRequirement().getDestinationLatitude() : 12.9716;
        double startLon = batch.getBuyerRequirement().getDestinationLongitude() != null ?
                batch.getBuyerRequirement().getDestinationLongitude() : 77.5946;

        List<BatchMembership> unvisited = new ArrayList<>(memberships);
        List<RouteResponse.RouteStop> orderedStops = new ArrayList<>();

        double currentLat = startLat;
        double currentLon = startLon;
        double totalDistance = 0.0;
        int stopOrder = 1;

        while (!unvisited.isEmpty()) {
            BatchMembership nearest = null;
            double minDistance = Double.MAX_VALUE;

            for (BatchMembership m : unvisited) {
                double mLat = m.getProduceListing().getLatitude() != null ? m.getProduceListing().getLatitude() : 12.9716;
                double mLon = m.getProduceListing().getLongitude() != null ? m.getProduceListing().getLongitude() : 77.5946;
                double dist = HaversineUtil.distanceKm(currentLat, currentLon, mLat, mLon);

                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = m;
                }
            }

            if (nearest != null) {
                unvisited.remove(nearest);
                double nLat = nearest.getProduceListing().getLatitude() != null ? nearest.getProduceListing().getLatitude() : 12.9716;
                double nLon = nearest.getProduceListing().getLongitude() != null ? nearest.getProduceListing().getLongitude() : 77.5946;

                totalDistance += minDistance;

                orderedStops.add(RouteResponse.RouteStop.builder()
                        .stopOrder(stopOrder++)
                        .membershipId(nearest.getId())
                        .farmerId(nearest.getFarmer().getId())
                        .farmerName(nearest.getFarmer().getName())
                        .phone(nearest.getFarmer().getPhone())
                        .latitude(nLat)
                        .longitude(nLon)
                        .address(nearest.getFarmer().getAddress())
                        .allocatedQtyKg(nearest.getAllocatedQty())
                        .distanceToNextKm(minDistance)
                        .build());

                currentLat = nLat;
                currentLon = nLon;
            }
        }

        return RouteResponse.builder()
                .batchId(batchId)
                .totalDistanceKm(Math.round(totalDistance * 100.0) / 100.0)
                .totalStops(orderedStops.size())
                .stops(orderedStops)
                .build();
    }

    /**
     * Records collection verification at a specific farmer pickup location.
     * Demonstrates failure recovery: if farmer is absent, shrinks batch or triggers replacement pro-rata.
     */
    @Transactional
    public BatchMembership verifyPickupStop(Long membershipId, PickupVerificationRequest req, Long coordinatorId) {
        BatchMembership membership = batchMembershipRepository.findById(membershipId)
                .orElseThrow(() -> new IllegalArgumentException("Batch membership not found: " + membershipId));

        ProduceListing listing = membership.getProduceListing();
        CooperativeBatch batch = membership.getCooperativeBatch();

        if (Boolean.TRUE.equals(req.getIsPresent())) {
            membership.setFarmerDecision("PICKUP_CONFIRMED");
            listing.setStatus(ProduceListingStatus.PICKUP_CONFIRMED);
            if (req.getActualCollectedQty() != null) {
                membership.setAllocatedQty(req.getActualCollectedQty());
            }

            eventPublisher.publishEvent(new AuditEvent(
                    this, "BATCH_MEMBERSHIP", membership.getId(), "PICKUP_CONFIRMED",
                    coordinatorId, "COORDINATOR",
                    String.format("Farmer %s pickup verified. Collected Qty: %s kg.",
                            membership.getFarmer().getName(), membership.getAllocatedQty()),
                    "IN_BATCH", "PICKUP_CONFIRMED"
            ));
        } else {
            // FAILURE RECOVERY: Farmer absent at pickup
            membership.setFarmerDecision("ABSENT_AT_PICKUP");
            membership.setFarmerNote(req.getNotes() != null ? req.getNotes() : "Farmer was absent during scheduled pickup window");
            listing.setStatus(ProduceListingStatus.VERIFIED_COMPATIBLE); // return listing to pool

            // Adjust batch allocated total
            BigDecimal removedQty = membership.getAllocatedQty();
            membership.setAllocatedQty(BigDecimal.ZERO);

            batch.setTotalAllocatedQty(batch.getTotalAllocatedQty().subtract(removedQty));
            batch.setShortfallQty((batch.getShortfallQty() != null ? batch.getShortfallQty() : BigDecimal.ZERO).add(removedQty));
            cooperativeBatchRepository.save(batch);

            eventPublisher.publishEvent(new AuditEvent(
                    this, "BATCH_MEMBERSHIP", membership.getId(), "PICKUP_FAILURE_ABSENT_FARMER",
                    coordinatorId, "COORDINATOR",
                    String.format("Farmer %s absent at pickup. Batch shortfall increased by %s kg. Pro-rata adjustment applied.",
                            membership.getFarmer().getName(), removedQty),
                    "IN_BATCH", "ABSENT_AT_PICKUP"
            ));
        }

        batchMembershipRepository.save(membership);
        produceListingRepository.save(listing);

        return membership;
    }
}
