package com.farmunity.dto.request;

import jakarta.validation.constraints.DecimalMin;
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
public class MillingCompletionRequest {
    @NotNull(message = "Actual output quantity is required")
    @DecimalMin(value = "0.01", message = "Output quantity must be positive")
    private BigDecimal actualOutputQty;

    private String notes;
}
