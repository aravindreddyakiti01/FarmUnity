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
public class VerificationRequest {
    @NotNull(message = "Verified quantity is required")
    @DecimalMin(value = "0.01", message = "Verified quantity must be positive")
    private BigDecimal verifiedQty;

    @NotNull(message = "Moisture reading is required")
    private BigDecimal moistureReading;

    private String evidenceNotes;
    private String photoUrls;
}
