package com.farmunity.dto.response;

import com.farmunity.entity.enums.BatchStatus;
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
public class BatchFormationResponse {
    private Long id;
    private Long buyerRequirementId;
    private String product;
    private BigDecimal requiredQty;
    private BigDecimal totalAllocatedQty;
    private BigDecimal shortfallQty;
    private Boolean isFullyAllocated;
    private BatchStatus status;
    private List<MemberBreakdown> members;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberBreakdown {
        private Long membershipId;
        private Long farmerId;
        private String farmerName;
        private String farmerTrustTier;
        private BigDecimal farmerReliabilityScore;
        private Long listingId;
        private BigDecimal allocatedQty;
        private BigDecimal verifiedQty;
        private Double distanceKm;
        private String inclusionReason;
        private String farmerDecision;
        private String farmerNote;
    }
}
