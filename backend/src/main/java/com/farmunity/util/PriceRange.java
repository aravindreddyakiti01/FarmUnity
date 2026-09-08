package com.farmunity.util;

import java.math.BigDecimal;

public record PriceRange(BigDecimal min, BigDecimal max) {
    public PriceRange {
        if (min == null || max == null) {
            throw new IllegalArgumentException("PriceRange bounds cannot be null");
        }
        if (min.compareTo(max) > 0) {
            throw new IllegalArgumentException("PriceRange min cannot be greater than max");
        }
    }
}
