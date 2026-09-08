package com.farmunity.dto.request;

import com.farmunity.entity.enums.TrustTier;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrustTierTransitionRequest {
    @NotNull(message = "Target ID is required")
    private Long targetId;

    @NotNull(message = "User type is required (FARMER or BUYER)")
    private String userType;

    @NotNull(message = "Target trust tier is required")
    private TrustTier targetTier;

    private String reason;
}
