package com.farmunity.provider;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class MockWeatherProvider implements WeatherProvider {

    @Override
    public WeatherRiskAssessment assessRisk(double latitude, double longitude, LocalDate targetDate) {
        // Deterministic simulation based on coordinates and date for realistic testing
        int day = targetDate != null ? targetDate.getDayOfMonth() : 15;
        double rainProb = (Math.abs(latitude * 10 + longitude + day) % 100) / 100.0;

        RiskLevel level;
        String condition;
        String advisory;
        List<String> mitigations;

        if (rainProb > 0.70) {
            level = RiskLevel.HIGH;
            condition = "Heavy Monsoon Rain Showers Forecasted";
            advisory = "High precipitation expected. Outdoor grain drying and open-bed truck logistics pose severe spoilage risk.";
            mitigations = List.of(
                "Require waterproof tarpaulin on all transport vehicles",
                "Expedite pickup to morning window before 11:00 AM",
                "Ensure destination warehouse has covered unloading docks"
            );
        } else if (rainProb > 0.40) {
            level = RiskLevel.MEDIUM;
            condition = "Scattered Afternoon Thunderstorms";
            advisory = "Moderate humidity. Ensure moisture checks are verified before loading into transit.";
            mitigations = List.of(
                "Monitor farm lot moisture levels immediately prior to departure",
                "Keep emergency tarpaulins accessible in transport vehicle"
            );
        } else {
            level = RiskLevel.LOW;
            condition = "Clear / Partially Cloudy, Dry Conditions";
            advisory = "Optimal weather for harvesting, bagging, and highway freight transit.";
            mitigations = List.of("Standard loading and dispatch protocols apply");
        }

        return WeatherRiskAssessment.builder()
                .locationName("Region (" + String.format("%.2f", latitude) + ", " + String.format("%.2f", longitude) + ")")
                .date(targetDate != null ? targetDate : LocalDate.now())
                .condition(condition)
                .rainfallProbability(Math.round(rainProb * 100.0) / 100.0)
                .expectedRainfallMm(rainProb > 0.7 ? 35.5 : (rainProb > 0.4 ? 12.0 : 0.0))
                .temperatureCelsius(28.5)
                .humidityPercentage(rainProb > 0.7 ? 88.0 : 62.0)
                .riskLevel(level)
                .advisory(advisory)
                .mitigationActions(mitigations)
                .build();
    }
}
