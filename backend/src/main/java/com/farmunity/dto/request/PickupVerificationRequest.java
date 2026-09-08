package com.farmunity.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PickupVerificationRequest {
    @NotNull(message = "Farmer present flag is required")
    private Boolean isPresent;

    private BigDecimal actualCollectedQty;
    private String notes;
}
