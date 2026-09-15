package com.farmunity.provider;

import com.farmunity.repository.BuyerRequirementRepository;
import com.farmunity.repository.ProduceListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DefaultDemandForecastProvider implements DemandForecastProvider {

    private final BuyerRequirementRepository buyerRequirementRepository;
    private final ProduceListingRepository produceListingRepository;

    @Override
    public DemandForecastResult forecastDemand(String crop, String region, LocalDate targetMonth) {
        String normalizedCrop = crop != null ? crop.toLowerCase().trim() : "paddy";

        BigDecimal activeDemand = buyerRequirementRepository.findAll().stream()
                .filter(r -> r.getProduct() != null && r.getProduct().equalsIgnoreCase(normalizedCrop))
                .map(r -> r.getQuantityKg() != null ? r.getQuantityKg() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal verifiedSupply = produceListingRepository.findAll().stream()
                .filter(l -> l.getCrop() != null && l.getCrop().equalsIgnoreCase(normalizedCrop))
                .map(l -> l.getVerifiedQty() != null ? l.getVerifiedQty() : (l.getDeclaredQty() != null ? l.getDeclaredQty() : BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (activeDemand.compareTo(BigDecimal.ZERO) == 0) {
            activeDemand = new BigDecimal("5000.00");
        }
        if (verifiedSupply.compareTo(BigDecimal.ZERO) == 0) {
            verifiedSupply = new BigDecimal("3500.00");
        }

        BigDecimal ratio = activeDemand.divide(
                verifiedSupply.compareTo(BigDecimal.ZERO) > 0 ? verifiedSupply : BigDecimal.ONE,
                2,
                RoundingMode.HALF_UP
        );

        String pressure;
        String advisory;

        if (ratio.compareTo(new BigDecimal("1.50")) >= 0) {
            pressure = "VERY_HIGH";
            advisory = "Severe institutional demand deficit. High probability of prompt fulfillment and favorable pricing for producer cooperatives.";
        } else if (ratio.compareTo(new BigDecimal("1.10")) >= 0) {
            pressure = "HIGH";
            advisory = "Strong demand pressure. Smallholder produce will match rapidly within 15-25 km radius.";
        } else if (ratio.compareTo(new BigDecimal("0.80")) >= 0) {
            pressure = "BALANCED";
            advisory = "Equilibrium market conditions. Balanced buyer and farmer price ranges.";
        } else {
            pressure = "LOW";
            advisory = "Supply exceeds current institutional demand. Extended pooling window may be necessary.";
        }

        return DemandForecastResult.builder()
                .crop(crop)
                .region(region != null ? region : "Bengaluru Rural")
                .targetMonth(targetMonth != null ? targetMonth : LocalDate.now())
                .totalActiveDemandKg(activeDemand)
                .totalVerifiedSupplyKg(verifiedSupply)
                .demandSupplyRatio(ratio)
                .marketPressure(pressure)
                .advisory(advisory)
                .isModelPrediction(false)
                .build();
    }
}
