package com.farmunity.service;

import com.farmunity.entity.enums.TrustTier;
import com.farmunity.repository.BuyerRequirementRepository;
import com.farmunity.repository.ProduceListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final ProduceListingRepository produceListingRepository;
    private final BuyerRequirementRepository buyerRequirementRepository;

    private static final Map<TrustTier, Integer> LISTING_LIMITS = Map.of(
            TrustTier.NEW, 2,
            TrustTier.VERIFIED, 10,
            TrustTier.ESTABLISHED, 50,
            TrustTier.TRUSTED, 200,
            TrustTier.UNDER_REVIEW, 0,
            TrustTier.SUSPENDED, 0
    );

    private static final Map<TrustTier, Integer> REQUIREMENT_LIMITS = Map.of(
            TrustTier.NEW, 2,
            TrustTier.VERIFIED, 10,
            TrustTier.ESTABLISHED, 50,
            TrustTier.TRUSTED, 200,
            TrustTier.UNDER_REVIEW, 0,
            TrustTier.SUSPENDED, 0
    );

    public void checkListingRateLimit(Long farmerId, TrustTier tier) {
        int maxAllowed = LISTING_LIMITS.getOrDefault(tier, 0);
        if (maxAllowed == 0) {
            throw new IllegalStateException("Account tier " + tier + " is not permitted to create listings.");
        }

        LocalDateTime past24Hours = LocalDateTime.now().minusHours(24);
        long count = produceListingRepository.countByFarmerIdAndCreatedAtAfter(farmerId, past24Hours);
        if (count >= maxAllowed) {
            throw new IllegalStateException("Rate limit exceeded for " + tier + " tier. Max " + maxAllowed + " listings per 24 hours.");
        }
    }

    public void checkRequirementRateLimit(Long buyerId, TrustTier tier) {
        int maxAllowed = REQUIREMENT_LIMITS.getOrDefault(tier, 0);
        if (maxAllowed == 0) {
            throw new IllegalStateException("Account tier " + tier + " is not permitted to post requirements.");
        }

        LocalDateTime past24Hours = LocalDateTime.now().minusHours(24);
        long count = buyerRequirementRepository.countByBuyerIdAndCreatedAtAfter(buyerId, past24Hours);
        if (count >= maxAllowed) {
            throw new IllegalStateException("Rate limit exceeded for " + tier + " tier. Max " + maxAllowed + " requirements per 24 hours.");
        }
    }
}
