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
public class CreateAgreementRequest {
    @NotNull(message = "Cooperative batch ID is required")
    private Long cooperativeBatchId;

    @NotNull(message = "Agreed price is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal agreedPricePerKg;

    private BigDecimal transportDeductionPerKg;
}
