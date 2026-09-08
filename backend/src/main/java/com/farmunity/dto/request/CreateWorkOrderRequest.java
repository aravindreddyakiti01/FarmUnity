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
public class CreateWorkOrderRequest {
    @NotNull(message = "Agreement ID is required")
    private Long agreementId;

    @NotNull(message = "Processor ID is required")
    private Long processorId;

    @NotNull(message = "Raw input quantity is required")
    @DecimalMin(value = "0.01", message = "Input quantity must be positive")
    private BigDecimal rawInputQty;
}
