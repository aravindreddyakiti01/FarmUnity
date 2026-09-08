package com.farmunity.service;

import com.farmunity.util.PriceRange;
import com.farmunity.util.PriceResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ThresholdPricingServiceTest {

    private ThresholdPricingService pricingService;

    @BeforeEach
    void setUp() {
        pricingService = new ThresholdPricingService();
    }

    @Test
    @DisplayName("Should find feasible price midpoint when overlap exists without market reference")
    void testFeasiblePriceMidpoint() {
        BigDecimal farmerMin = new BigDecimal("27.00");
        PriceRange buyerRange = new PriceRange(new BigDecimal("28.00"), new BigDecimal("32.00"));

        PriceResult result = pricingService.computeFeasiblePrice(farmerMin, buyerRange, null);

        assertTrue(result.isFeasible());
        assertEquals(new BigDecimal("28.00"), result.getOverlapLow());
        assertEquals(new BigDecimal("32.00"), result.getOverlapHigh());
        assertEquals(new BigDecimal("30.00"), result.getSuggestedPrice());
    }

    @Test
    @DisplayName("Should use market reference price when clamped within feasible overlap")
    void testMarketReferencePriceWithinOverlap() {
        BigDecimal farmerMin = new BigDecimal("27.00");
        PriceRange buyerRange = new PriceRange(new BigDecimal("28.00"), new BigDecimal("32.00"));
        BigDecimal marketRef = new BigDecimal("29.50");

        PriceResult result = pricingService.computeFeasiblePrice(farmerMin, buyerRange, marketRef);

        assertTrue(result.isFeasible());
        assertEquals(new BigDecimal("29.50"), result.getSuggestedPrice());
    }

    @Test
    @DisplayName("Should return NO_FEASIBLE_PRICE when farmer minimum exceeds buyer max range")
    void testNoFeasiblePrice() {
        BigDecimal farmerMin = new BigDecimal("35.00");
        PriceRange buyerRange = new PriceRange(new BigDecimal("28.00"), new BigDecimal("32.00"));

        PriceResult result = pricingService.computeFeasiblePrice(farmerMin, buyerRange, null);

        assertFalse(result.isFeasible());
        assertNull(result.getSuggestedPrice());
        assertTrue(result.getMessage().contains("NO_FEASIBLE_PRICE"));
    }
}
