package com.farmunity.dto.response;

import com.farmunity.entity.enums.OrgType;
import com.farmunity.entity.enums.TrustTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerRequirementResponse {
    private Long id;
    private Long buyerId;
    private String buyerName;
    private OrgType orgType;
    private TrustTier buyerTrustTier;
    private String product;
    private String variety;
    private BigDecimal quantityKg;
    private BigDecimal moistureBandMin;
    private BigDecimal moistureBandMax;
    private BigDecimal priceMin;
    private BigDecimal priceMax;
    private LocalDate deliveryWindowStart;
    private LocalDate deliveryWindowEnd;
    private String destination;
    private Double destinationLatitude;
    private Double destinationLongitude;
    private BigDecimal commitmentDeposit;
    private TrustTier trustLevelRequired;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
