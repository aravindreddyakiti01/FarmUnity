package com.farmunity.dto.request;

import com.farmunity.entity.enums.TrustTier;
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
public class BuyerRequirementRequest {
    @NotBlank(message = "Product name is required")
    private String product;

    private String variety;

    @NotNull(message = "Required quantity is required")
    @DecimalMin(value = "0.01", message = "Quantity must be positive")
    private BigDecimal quantityKg;

    private BigDecimal moistureBandMin;
    private BigDecimal moistureBandMax;

    @NotNull(message = "Minimum price is required")
    private BigDecimal priceMin;

    @NotNull(message = "Maximum price is required")
    private BigDecimal priceMax;

    private LocalDate deliveryWindowStart;
    private LocalDate deliveryWindowEnd;

    private String destination;
    private Double destinationLatitude;
    private Double destinationLongitude;

    private BigDecimal commitmentDeposit;
    private TrustTier trustLevelRequired;
}
