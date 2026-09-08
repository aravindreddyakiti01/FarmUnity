package com.farmunity.dto.response;

import com.farmunity.entity.enums.ProduceListingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponse {
    private Long id;
    private Long produceListingId;
    private BigDecimal declaredQty;
    private BigDecimal verifiedQty;
    private BigDecimal moistureReading;
    private BigDecimal cropMoistureMin;
    private BigDecimal cropMoistureMax;
    private Boolean isCompatible;
    private ProduceListingStatus status;
    private Long verifierId;
    private String verifierName;
    private String evidenceNotes;
    private LocalDateTime timestamp;
}
