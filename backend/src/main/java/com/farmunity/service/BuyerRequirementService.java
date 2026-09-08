package com.farmunity.service;

import com.farmunity.dto.request.BuyerRequirementRequest;
import com.farmunity.dto.response.BuyerRequirementResponse;
import com.farmunity.entity.Buyer;
import com.farmunity.entity.BuyerRequirement;
import com.farmunity.entity.enums.TrustTier;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.BuyerRepository;
import com.farmunity.repository.BuyerRequirementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BuyerRequirementService {

    private final BuyerRequirementRepository buyerRequirementRepository;
    private final BuyerRepository buyerRepository;
    private final RateLimitService rateLimitService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public BuyerRequirementResponse createRequirement(BuyerRequirementRequest req, Long buyerId) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found: " + buyerId));

        rateLimitService.checkRequirementRateLimit(buyerId, buyer.getTrustTier());

        // Fake-request safeguard: For large orders (>1000kg) by NEW buyers, commitment deposit is required
        BigDecimal deposit = req.getCommitmentDeposit() != null ? req.getCommitmentDeposit() : BigDecimal.ZERO;
        if (buyer.getTrustTier() == TrustTier.NEW &&
            req.getQuantityKg().compareTo(new BigDecimal("1000")) > 0 &&
            deposit.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("A simulated commitment deposit is required for first-time large bulk orders (>1000 kg).");
        }

        BuyerRequirement requirement = BuyerRequirement.builder()
                .buyer(buyer)
                .product(req.getProduct().trim().toLowerCase())
                .variety(req.getVariety())
                .quantityKg(req.getQuantityKg())
                .moistureBandMin(req.getMoistureBandMin() != null ? req.getMoistureBandMin() : new BigDecimal("12.00"))
                .moistureBandMax(req.getMoistureBandMax() != null ? req.getMoistureBandMax() : new BigDecimal("14.00"))
                .priceMin(req.getPriceMin())
                .priceMax(req.getPriceMax())
                .deliveryWindowStart(req.getDeliveryWindowStart())
                .deliveryWindowEnd(req.getDeliveryWindowEnd())
                .destination(req.getDestination() != null ? req.getDestination() : buyer.getAddress())
                .destinationLatitude(req.getDestinationLatitude() != null ? req.getDestinationLatitude() : buyer.getLatitude())
                .destinationLongitude(req.getDestinationLongitude() != null ? req.getDestinationLongitude() : buyer.getLongitude())
                .commitmentDeposit(deposit)
                .trustLevelRequired(req.getTrustLevelRequired() != null ? req.getTrustLevelRequired() : TrustTier.NEW)
                .isActive(true)
                .build();

        BuyerRequirement saved = buyerRequirementRepository.save(requirement);

        eventPublisher.publishEvent(new AuditEvent(
                this, "BUYER_REQUIREMENT", saved.getId(), "REQUIREMENT_CREATED",
                buyerId, "BUYER",
                "Created buyer requirement for " + saved.getProduct() + " (" + saved.getQuantityKg() + " kg at ₹" + saved.getPriceMin() + "–₹" + saved.getPriceMax() + "/kg)",
                null, "ACTIVE"
        ));

        return mapToResponse(saved);
    }

    public List<BuyerRequirementResponse> getActiveRequirements() {
        return buyerRequirementRepository.findByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BuyerRequirementResponse> getRequirementsForBuyer(Long buyerId) {
        return buyerRequirementRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BuyerRequirementResponse getRequirementById(Long id) {
        BuyerRequirement req = buyerRequirementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Buyer requirement not found: " + id));
        return mapToResponse(req);
    }

    public BuyerRequirementResponse mapToResponse(BuyerRequirement req) {
        return BuyerRequirementResponse.builder()
                .id(req.getId())
                .buyerId(req.getBuyer().getId())
                .buyerName(req.getBuyer().getName())
                .orgType(req.getBuyer().getOrgType())
                .buyerTrustTier(req.getBuyer().getTrustTier())
                .product(req.getProduct())
                .variety(req.getVariety())
                .quantityKg(req.getQuantityKg())
                .moistureBandMin(req.getMoistureBandMin())
                .moistureBandMax(req.getMoistureBandMax())
                .priceMin(req.getPriceMin())
                .priceMax(req.getPriceMax())
                .deliveryWindowStart(req.getDeliveryWindowStart())
                .deliveryWindowEnd(req.getDeliveryWindowEnd())
                .destination(req.getDestination())
                .destinationLatitude(req.getDestinationLatitude())
                .destinationLongitude(req.getDestinationLongitude())
                .commitmentDeposit(req.getCommitmentDeposit())
                .trustLevelRequired(req.getTrustLevelRequired())
                .isActive(req.isActive())
                .createdAt(req.getCreatedAt())
                .build();
    }
}
