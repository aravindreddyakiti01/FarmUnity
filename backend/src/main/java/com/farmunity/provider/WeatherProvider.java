package com.farmunity.provider;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public interface WeatherProvider {
    WeatherRiskAssessment assessRisk(double latitude, double longitude, LocalDate targetDate);

    @Data
    @Builder
    class WeatherRiskAssessment {
        private String locationName;
        private LocalDate date;
        private String condition;
        private double rainfallProbability;
        private double expectedRainfallMm;
        private double temperatureCelsius;
        private double humidityPercentage;
        private RiskLevel riskLevel;
        private String advisory;
        private List<String> mitigationActions;
    }

    enum RiskLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
