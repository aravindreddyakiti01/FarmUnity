package com.farmunity.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduceListingRequest {
    @NotBlank(message = "Crop is required")
    private String crop;

    private String variety;

    @NotNull(message = "Declared quantity is required")
    @DecimalMin(value = "0.01", message = "Quantity must be positive")
    private BigDecimal declaredQty;

    private LocalDate harvestDate;

    @NotNull(message = "Minimum price per kg is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal minPricePerKg;

    private BigDecimal moistureReading;
    private Double latitude;
    private Double longitude;
    private String storageCondition;
}
