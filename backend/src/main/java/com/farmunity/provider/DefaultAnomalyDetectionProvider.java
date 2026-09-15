package com.farmunity.provider;

import com.farmunity.entity.Buyer;
import com.farmunity.entity.Farmer;
import com.farmunity.entity.enums.TrustTier;
import com.farmunity.repository.BuyerRepository;
import com.farmunity.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DefaultAnomalyDetectionProvider implements AnomalyDetectionProvider {

    private final BuyerRepository buyerRepository;
    private final FarmerRepository farmerRepository;

    @Override
    public RiskEvaluation evaluateBuyerRisk(Long buyerId) {
        Buyer buyer = buyerRepository.findById(buyerId).orElse(null);
        if (buyer == null) {
            return RiskEvaluation.builder()
                    .entityId(buyerId)
                    .entityType("BUYER")
                    .riskRating(RiskRating.HIGH_RISK)
                    .riskFlags(List.of("Buyer profile not found"))
                    .recommendation("Reject or request identity verification")
                    .requiresCoordinatorIntervention(true)
                    .build();
        }

        List<String> flags = new ArrayList<>();
        RiskRating rating = RiskRating.NORMAL;

        if (buyer.getTrustTier() == TrustTier.NEW && buyer.getCommitmentDepositBalance().compareTo(new BigDecimal("10000.00")) < 0) {
            flags.add("First-time institutional buyer with minimal commitment deposit balance");
            rating = RiskRating.ATTENTION_REQUIRED;
        }

        if (buyer.getReliabilityScore() != null && buyer.getReliabilityScore().compareTo(new BigDecimal("60.00")) < 0) {
            flags.add("Buyer historical reliability index below 60.00% threshold");
            rating = RiskRating.HIGH_RISK;
        }

        boolean intervention = rating != RiskRating.NORMAL;
        String recommendation = intervention
                ? "Coordinator manual review required prior to batch allocation and agreement locking."
                : "Standard automated fulfillment workflows permitted.";

        return RiskEvaluation.builder()
                .entityId(buyerId)
                .entityType("BUYER")
                .riskRating(rating)
                .riskFlags(flags)
                .recommendation(recommendation)
                .requiresCoordinatorIntervention(intervention)
                .build();
    }

    @Override
    public RiskEvaluation evaluateFarmerRisk(Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId).orElse(null);
        if (farmer == null) {
            return RiskEvaluation.builder()
                    .entityId(farmerId)
                    .entityType("FARMER")
                    .riskRating(RiskRating.HIGH_RISK)
                    .riskFlags(List.of("Farmer profile not found"))
                    .recommendation("Registration verification required")
                    .requiresCoordinatorIntervention(true)
                    .build();
        }

        List<String> flags = new ArrayList<>();
        RiskRating rating = RiskRating.NORMAL;

        if (farmer.getReliabilityScore() != null && farmer.getReliabilityScore().compareTo(new BigDecimal("50.00")) < 0) {
            flags.add("Farmer fulfillment reliability below 50.00% due to past cancellations or quantity shortfalls");
            rating = RiskRating.ATTENTION_REQUIRED;
        }

        boolean intervention = rating != RiskRating.NORMAL;
        String recommendation = intervention
                ? "Field coordinator physical presence advised during initial pickup run."
                : "Verified producer lot eligible for dynamic pooling.";

        return RiskEvaluation.builder()
                .entityId(farmerId)
                .entityType("FARMER")
                .riskRating(rating)
                .riskFlags(flags)
                .recommendation(recommendation)
                .requiresCoordinatorIntervention(intervention)
                .build();
    }
}
