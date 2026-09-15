package com.farmunity.provider;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface MarketDataProvider {
    MarketBenchmark getBenchmark(String crop, String region);

    @Data
    @Builder
    class MarketBenchmark {
        private String crop;
        private String variety;
        private String region;
        private BigDecimal mspRatePerKg; // Minimum Support Price benchmark
        private BigDecimal mandiModalPricePerKg; // Local APMC Mandi average
        private BigDecimal institutionalProcurementRate; // Bulk institutional buying rate
        private String priceTrend; // RISING, STABLE, FALLING
        private String dataSource;
        private LocalDateTime lastUpdated;
    }
}
