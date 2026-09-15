package com.farmunity.provider;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class MockMarketDataProvider implements MarketDataProvider {

    @Override
    public MarketBenchmark getBenchmark(String crop, String region) {
        String normalizedCrop = crop != null ? crop.toLowerCase().trim() : "paddy";
        String normalizedRegion = region != null ? region : "Karnataka (Bengaluru Rural APMC)";

        BigDecimal msp;
        BigDecimal mandiModal;
        BigDecimal institutional;
        String variety;

        switch (normalizedCrop) {
            case "wheat" -> {
                variety = "Sharbati / Lokwan";
                msp = new BigDecimal("22.75");
                mandiModal = new BigDecimal("24.50");
                institutional = new BigDecimal("26.00");
            }
            case "pulses", "dal", "toor" -> {
                variety = "Toor Dal (Pigeon Pea)";
                msp = new BigDecimal("70.00");
                mandiModal = new BigDecimal("78.50");
                institutional = new BigDecimal("82.00");
            }
            case "oilseeds", "mustard" -> {
                variety = "Yellow Mustard";
                msp = new BigDecimal("56.50");
                mandiModal = new BigDecimal("61.00");
                institutional = new BigDecimal("64.50");
            }
            default -> { // Paddy / Rice
                variety = "Sona Masoori";
                msp = new BigDecimal("21.83");
                mandiModal = new BigDecimal("25.20");
                institutional = new BigDecimal("27.50");
            }
        }

        return MarketBenchmark.builder()
                .crop(crop)
                .variety(variety)
                .region(normalizedRegion)
                .mspRatePerKg(msp)
                .mandiModalPricePerKg(mandiModal)
                .institutionalProcurementRate(institutional)
                .priceTrend("RISING")
                .dataSource("Agmarknet / Ministry of Agriculture APMC Mandi Daily Bulletins")
                .lastUpdated(LocalDateTime.now().minusHours(2))
                .build();
    }
}
