package com.farmunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementResponse {
    private Long agreementId;
    private BigDecimal grossTotal;
    private BigDecimal transportTotal;
    private BigDecimal platformFeeTotal;
    private BigDecimal netPoolTotal;
    private String agreementIntegrityHash;
    private List<FarmerSettlementDetail> farmerSettlements;
    private LocalDateTime settledAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FarmerSettlementDetail {
        private Long settlementId;
        private Long farmerId;
        private String farmerName;
        private String farmerPhone;
        private BigDecimal verifiedQty;
        private BigDecimal grossAmount;
        private BigDecimal transportDeduction;
        private BigDecimal platformFee;
        private BigDecimal netPayout;
        private Boolean isPaid;
        private String integrityHash;
    }
}
