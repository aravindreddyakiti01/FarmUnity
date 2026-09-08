package com.farmunity.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class DeliveryConfirmationRequest {
    @NotNull(message = "Received quantity is required")
    @DecimalMin(value = "0.01", message = "Quantity must be positive")
    private BigDecimal receivedQty;

    @Min(value = 1, message = "Quality rating min is 1")
    @Max(value = 5, message = "Quality rating max is 5")
    private Integer qualityRating;

    private String notes;
    private String discrepancyDetails;
}
