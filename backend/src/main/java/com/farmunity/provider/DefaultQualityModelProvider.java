package com.farmunity.provider;

import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class DefaultQualityModelProvider implements QualityModelProvider {

    @Override
    public QualityAssessmentResult assessQuality(QualityAssessmentInput input) {
        // Honest engineering: Model pipeline is structured for future deployment,
        // while clearly declaring that certified physical verification by coordinator is authoritative.
        return QualityAssessmentResult.builder()
                .modelAvailable(false)
                .modelName("Edge-Vision-Model (Future Ready)")
                .predictedGrade("PENDING_HUMAN_INSPECTION")
                .confidenceScore(null)
                .detectedDefects(Collections.emptyList())
                .explanation("AI quality scoring is currently disengaged. Physical moisture and foreign-matter inspection by field coordinator is required.")
                .humanReviewRequired(true)
                .build();
    }
}
