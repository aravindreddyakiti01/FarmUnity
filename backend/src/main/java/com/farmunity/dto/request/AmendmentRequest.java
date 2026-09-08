package com.farmunity.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
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
public class AmendmentRequest {
    @NotNull(message = "New price per kg is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal newPricePerKg;

    @NotBlank(message = "Amendment reason is required")
    private String reason;
}
