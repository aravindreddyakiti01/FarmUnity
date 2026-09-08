package com.farmunity.dto.response;

import com.farmunity.entity.enums.ProduceListingStatus;
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
public class ProduceListingResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String farmerTrustTier;
    private BigDecimal farmerReliabilityScore;
    private String crop;
    private String variety;
    private BigDecimal declaredQty;
    private BigDecimal verifiedQty;
    private LocalDate harvestDate;
    private BigDecimal minPricePerKg;
    private BigDecimal moistureReading;
    private Double latitude;
    private Double longitude;
    private String storageCondition;
    private ProduceListingStatus status;
    private LocalDateTime createdAt;
}
