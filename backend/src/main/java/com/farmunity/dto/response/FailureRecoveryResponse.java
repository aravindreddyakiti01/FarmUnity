package com.farmunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FailureRecoveryResponse {
    private String failureType; // FARMER_CANCELLATION, QUANTITY_SHORTFALL, QUALITY_FAILURE, VEHICLE_BREAKDOWN
    private Long batchId;
    private Long affectedMembershipId;
    private BigDecimal shortfallKg;
    private String status; // DETECTED, RECOVERY_PROPOSED, RECOVERED
    private String failureDescription;
    private List<RecoveryOption> proposedOptions;
    private String selectedResolution;
    private List<ProduceListingResponse> compatibleReplacements;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecoveryOption {
        private String optionId;
        private String title;
        private String description;
        private String impactOnAgreement;
        private boolean recommended;
    }
}
