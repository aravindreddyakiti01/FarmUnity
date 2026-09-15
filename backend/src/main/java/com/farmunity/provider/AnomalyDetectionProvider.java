package com.farmunity.provider;

import lombok.Builder;
import lombok.Data;

import java.util.List;

public interface AnomalyDetectionProvider {
    RiskEvaluation evaluateBuyerRisk(Long buyerId);
    RiskEvaluation evaluateFarmerRisk(Long farmerId);

    @Data
    @Builder
    class RiskEvaluation {
        private Long entityId;
        private String entityType; // BUYER, FARMER
        private RiskRating riskRating; // NORMAL, ATTENTION_REQUIRED, HIGH_RISK
        private List<String> riskFlags;
        private String recommendation;
        private boolean requiresCoordinatorIntervention;
    }

    enum RiskRating {
        NORMAL,
        ATTENTION_REQUIRED,
        HIGH_RISK
    }
}
