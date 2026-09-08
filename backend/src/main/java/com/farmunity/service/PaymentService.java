package com.farmunity.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PaymentService {

    /**
     * Pure function for calculating gross pool value from total verified quantity and agreed price.
     */
    public BigDecimal calculateGrossValue(BigDecimal totalVerifiedQty, BigDecimal pricePerKg) {
        if (totalVerifiedQty == null || pricePerKg == null) {
            return BigDecimal.ZERO;
        }
        return totalVerifiedQty.multiply(pricePerKg).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Pure function for calculating net pool available for farmer distribution.
     * net_pool = gross_value - transport_deductions - approved_platform_fees
     */
    public BigDecimal calculateNetPool(BigDecimal grossValue, BigDecimal transportDeduction, BigDecimal platformFeeRate) {
        if (grossValue == null) return BigDecimal.ZERO;

        BigDecimal transport = (transportDeduction != null) ? transportDeduction : BigDecimal.ZERO;
        BigDecimal feeRate = (platformFeeRate != null) ? platformFeeRate : new BigDecimal("0.02");

        BigDecimal platformFee = grossValue.multiply(feeRate).setScale(2, RoundingMode.HALF_UP);
        return grossValue.subtract(transport).subtract(platformFee).max(BigDecimal.ZERO);
    }

    /**
     * Pure function for calculating a single farmer's payout based strictly on verified quantity proportion.
     * Farmer share = (farmerVerifiedQty / totalVerifiedQty) * netPool
     */
    public BigDecimal calculateFarmerPayout(BigDecimal farmerVerifiedQty, BigDecimal totalVerifiedQty, BigDecimal netPool) {
        if (farmerVerifiedQty == null || totalVerifiedQty == null || netPool == null) {
            return BigDecimal.ZERO;
        }
        if (totalVerifiedQty.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal share = farmerVerifiedQty.divide(totalVerifiedQty, 8, RoundingMode.HALF_UP);
        return share.multiply(netPool).setScale(2, RoundingMode.HALF_UP);
    }
}
