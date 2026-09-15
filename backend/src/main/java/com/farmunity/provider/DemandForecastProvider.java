package com.farmunity.provider;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DemandForecastProvider {
    DemandForecastResult forecastDemand(String crop, String region, LocalDate targetMonth);

    @Data
    @Builder
    class DemandForecastResult {
        private String crop;
        private String region;
        private LocalDate targetMonth;
        private BigDecimal totalActiveDemandKg;
        private BigDecimal totalVerifiedSupplyKg;
        private BigDecimal demandSupplyRatio;
        private String marketPressure; // VERY_HIGH, HIGH, BALANCED, LOW
        private String advisory;
        private boolean isModelPrediction;
    }
}
