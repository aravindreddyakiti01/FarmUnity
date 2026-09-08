package com.farmunity.service;

import com.farmunity.dto.request.TrustTierTransitionRequest;
import com.farmunity.entity.Buyer;
import com.farmunity.entity.Farmer;
import com.farmunity.entity.enums.TrustTier;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.BuyerRepository;
import com.farmunity.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrustTierTransitionService {

    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void transitionTrustTier(TrustTierTransitionRequest req, Long coordinatorId) {
        if ("FARMER".equalsIgnoreCase(req.getUserType())) {
            transitionFarmer(req.getTargetId(), req.getTargetTier(), req.getReason(), coordinatorId);
        } else if ("BUYER".equalsIgnoreCase(req.getUserType())) {
            transitionBuyer(req.getTargetId(), req.getTargetTier(), req.getReason(), coordinatorId);
        } else {
            throw new IllegalArgumentException("Invalid user type: " + req.getUserType() + ". Must be FARMER or BUYER.");
        }
    }

    @Transactional
    public void transitionFarmer(Long farmerId, TrustTier targetTier, String reason, Long coordinatorId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer not found: " + farmerId));

        TrustTier currentTier = farmer.getTrustTier();

        // Check if transition is valid
        if (targetTier == TrustTier.SUSPENDED) {
            // Coordinator can suspend from any state
            farmer.setTrustTier(TrustTier.SUSPENDED);
            farmer.setActive(false);
        } else if (currentTier == TrustTier.UNDER_REVIEW || currentTier == TrustTier.SUSPENDED) {
            // Reinstatement from review or suspension by coordinator
            farmer.setTrustTier(targetTier);
            farmer.setActive(true);
        } else if (currentTier.canTransitionTo(targetTier)) {
            farmer.setTrustTier(targetTier);
        } else {
            throw new IllegalStateException("Invalid trust tier transition from " + currentTier + " to " + targetTier);
        }

        farmerRepository.save(farmer);

        eventPublisher.publishEvent(new AuditEvent(
                this, "FARMER", farmerId, "TRUST_TIER_TRANSITION",
                coordinatorId, "COORDINATOR",
                "Trust tier changed from " + currentTier + " to " + targetTier + ". Reason: " + reason,
                currentTier.name(), targetTier.name()
        ));
    }

    @Transactional
    public void transitionBuyer(Long buyerId, TrustTier targetTier, String reason, Long coordinatorId) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found: " + buyerId));

        TrustTier currentTier = buyer.getTrustTier();

        if (targetTier == TrustTier.SUSPENDED) {
            buyer.setTrustTier(TrustTier.SUSPENDED);
            buyer.setActive(false);
        } else if (currentTier == TrustTier.UNDER_REVIEW || currentTier == TrustTier.SUSPENDED) {
            buyer.setTrustTier(targetTier);
            buyer.setActive(true);
        } else if (currentTier.canTransitionTo(targetTier)) {
            buyer.setTrustTier(targetTier);
        } else {
            throw new IllegalStateException("Invalid trust tier transition from " + currentTier + " to " + targetTier);
        }

        buyerRepository.save(buyer);

        eventPublisher.publishEvent(new AuditEvent(
                this, "BUYER", buyerId, "TRUST_TIER_TRANSITION",
                coordinatorId, "COORDINATOR",
                "Trust tier changed from " + currentTier + " to " + targetTier + ". Reason: " + reason,
                currentTier.name(), targetTier.name()
        ));
    }
}
