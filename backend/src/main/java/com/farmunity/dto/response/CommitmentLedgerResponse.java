package com.farmunity.dto.response;

import com.farmunity.entity.enums.CommitmentStatus;
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
public class CommitmentLedgerResponse {
    private Long id;
    private Long agreementId;
    private Long buyerId;
    private String buyerName;
    private BigDecimal committedAmount;
    private CommitmentStatus status;
    private LocalDateTime deadline;
    private LocalDateTime fundedAt;
    private LocalDateTime pickupVerifiedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime releasedAt;
    private LocalDateTime createdAt;
    private Boolean isSimulated;
}
