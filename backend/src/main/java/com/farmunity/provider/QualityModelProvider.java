package com.farmunity.provider;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Pluggable contract for Computer Vision & Machine Learning produce quality grading.
 * In production MVP, certified human inspection remains authoritative while training
 * tuples are recorded for downstream model fine-tuning.
 */
public interface QualityModelProvider {
    QualityAssessmentResult assessQuality(QualityAssessmentInput input);

    @Data
    @Builder
    class QualityAssessmentInput {
        private String crop;
        private String variety;
        private List<String> photoUrls;
        private Double farmerDeclaredMoisture;
    }

    @Data
    @Builder
    class QualityAssessmentResult {
        private boolean modelAvailable;
        private String modelName; // e.g. "MobileNetV3-AgriQuality-Draft"
        private String predictedGrade; // GRADE_A, GRADE_B, REJECT
        private Double confidenceScore;
        private List<String> detectedDefects;
        private String explanation;
        private boolean humanReviewRequired;
    }
}
