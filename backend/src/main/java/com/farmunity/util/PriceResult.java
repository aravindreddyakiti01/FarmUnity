package com.farmunity.util;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PriceResult {

    private final boolean isFeasible;
    private final BigDecimal suggestedPrice;
    private final BigDecimal overlapLow;
    private final BigDecimal overlapHigh;
    private final String message;

    public static PriceResult feasible(BigDecimal suggested, BigDecimal low, BigDecimal high) {
        return new PriceResult(true, suggested, low, high, "Feasible price overlap found");
    }

    public static PriceResult noFeasiblePrice() {
        return new PriceResult(false, null, null, null, "NO_FEASIBLE_PRICE: Farmer minimum is higher than buyer maximum range");
    }
}
