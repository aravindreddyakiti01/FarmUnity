package com.farmunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceResultResponse {
    private Boolean isFeasible;
    private BigDecimal suggestedPrice;
    private BigDecimal overlapLow;
    private BigDecimal overlapHigh;
    private String message;
}
