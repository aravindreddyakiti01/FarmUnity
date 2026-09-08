package com.farmunity.dto.response;

import com.farmunity.entity.enums.AgreementStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgreementResponse {
    private Long id;
    private Long cooperativeBatchId;
    private Long buyerRequirementId;
    private String buyerName;
    private String product;
    private Integer version;
    private Long versionLock;
    private AgreementStatus status;
    private BigDecimal agreedPricePerKg;
    private BigDecimal overlapLow;
    private BigDecimal overlapHigh;
    private BigDecimal totalValueGross;
    private BigDecimal transportDeductionPerKg;
    private BigDecimal platformFeeRate;
    private String amendmentReason;
    private String integrityHash;
    private List<BatchFormationResponse.MemberBreakdown> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
