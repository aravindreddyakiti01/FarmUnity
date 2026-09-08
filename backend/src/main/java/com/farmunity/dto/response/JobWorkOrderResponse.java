package com.farmunity.dto.response;

import com.farmunity.entity.enums.WorkOrderStatus;
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
public class JobWorkOrderResponse {
    private Long id;
    private Long agreementId;
    private Long processorId;
    private String processorName;
    private BigDecimal rawInputQty;
    private BigDecimal expectedYieldRatio;
    private BigDecimal actualOutputQty;
    private BigDecimal actualYieldRatio;
    private BigDecimal fee;
    private WorkOrderStatus status;
    private Boolean flaggedForReview;
    private String flagReason;
    private BigDecimal processorAdjustment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
