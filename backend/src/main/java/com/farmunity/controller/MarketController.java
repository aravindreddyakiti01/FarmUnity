package com.farmunity.controller;

import com.farmunity.provider.MarketDataProvider;
import com.farmunity.provider.WeatherProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/intel")
@RequiredArgsConstructor
public class MarketController {

    private final MarketDataProvider marketDataProvider;
    private final WeatherProvider weatherProvider;

    @GetMapping("/market-benchmark")
    public ResponseEntity<MarketDataProvider.MarketBenchmark> getBenchmark(
            @RequestParam(defaultValue = "paddy") String crop,
            @RequestParam(required = false) String region) {
        return ResponseEntity.ok(marketDataProvider.getBenchmark(crop, region));
    }

    @GetMapping("/weather-risk")
    public ResponseEntity<WeatherProvider.WeatherRiskAssessment> getWeatherRisk(
            @RequestParam(defaultValue = "12.9716") double latitude,
            @RequestParam(defaultValue = "77.5946") double longitude,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(weatherProvider.assessRisk(latitude, longitude, date != null ? date : LocalDate.now()));
    }
}
