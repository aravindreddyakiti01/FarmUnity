package com.farmunity.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class PaymentServiceTest {

    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentService();
    }

    @Test
    @DisplayName("Should correctly calculate gross pool value")
    void testCalculateGrossValue() {
        BigDecimal qty = new BigDecimal("900.00");
        BigDecimal price = new BigDecimal("30.00");

        BigDecimal gross = paymentService.calculateGrossValue(qty, price);

        assertEquals(new BigDecimal("27000.00"), gross);
    }

    @Test
    @DisplayName("Should correctly compute net pool after transport deduction and platform fee")
    void testCalculateNetPool() {
        BigDecimal gross = new BigDecimal("27000.00");
        BigDecimal transport = new BigDecimal("500.00");
        BigDecimal feeRate = new BigDecimal("0.02"); // 2% platform fee = 540.00

        BigDecimal netPool = paymentService.calculateNetPool(gross, transport, feeRate);

        // 27000 - 500 - 540 = 25960.00
        assertEquals(new BigDecimal("25960.00"), netPool);
    }

    @Test
    @DisplayName("Should distribute farmer payouts strictly by verified quantity proportion")
    void testFarmerPayoutProportion() {
        BigDecimal farmer1Verified = new BigDecimal("500.00");
        BigDecimal farmer2Verified = new BigDecimal("400.00");
        BigDecimal totalVerified = new BigDecimal("900.00");
        BigDecimal netPool = new BigDecimal("25960.00");

        BigDecimal farmer1Payout = paymentService.calculateFarmerPayout(farmer1Verified, totalVerified, netPool);
        BigDecimal farmer2Payout = paymentService.calculateFarmerPayout(farmer2Verified, totalVerified, netPool);

        // 500/900 * 25960 = 14422.22
        // 400/900 * 25960 = 11537.78
        assertEquals(new BigDecimal("14422.22"), farmer1Payout);
        assertEquals(new BigDecimal("11537.78"), farmer2Payout);
        assertEquals(netPool, farmer1Payout.add(farmer2Payout));
    }
}
