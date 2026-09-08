package com.farmunity.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerNegotiationRequest {
    /**
     * ACCEPTED, REJECTED, REVISED, REDUCED, CONFLICT
     */
    @NotBlank(message = "Decision is required")
    private String decision;

    private BigDecimal requestedPrice;
    private BigDecimal revisedQuantity;
    private String note;
}
