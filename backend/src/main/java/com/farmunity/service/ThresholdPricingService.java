package com.farmunity.service;

import com.farmunity.util.PriceRange;
import com.farmunity.util.PriceResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ThresholdPricingService {

    /**
     * Pure function for computing feasible price overlap between farmer minimum and buyer acceptable range.
     * Recommends midpoint of overlap or market reference price if clamped within overlap.
     * Returns explicit NO_FEASIBLE_PRICE if no overlap exists.
     */
    public PriceResult computeFeasiblePrice(BigDecimal farmerMin, PriceRange buyerRange, BigDecimal marketReference) {
        if (farmerMin == null || buyerRange == null) {
            return PriceResult.noFeasiblePrice();
        }

        BigDecimal overlapLow = farmerMin.max(buyerRange.min());
        BigDecimal overlapHigh = buyerRange.max();

        if (overlapLow.compareTo(overlapHigh) > 0) {
            return PriceResult.noFeasiblePrice();
        }

        BigDecimal suggested;
        if (marketReference != null && isWithin(marketReference, overlapLow, overlapHigh)) {
            suggested = marketReference;
        } else {
            suggested = overlapLow.add(overlapHigh).divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
        }

        return PriceResult.feasible(suggested, overlapLow, overlapHigh);
    }

    private boolean isWithin(BigDecimal val, BigDecimal low, BigDecimal high) {
        return val.compareTo(low) >= 0 && val.compareTo(high) <= 0;
    }
}
