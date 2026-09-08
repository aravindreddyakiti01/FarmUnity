package com.farmunity.entity;

import com.farmunity.entity.enums.AgreementStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "agreements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agreement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooperative_batch_id", nullable = false)
    private CooperativeBatch cooperativeBatch;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    /**
     * JPA optimistic locking — ensures no concurrent silent mutations.
     */
    @Version
    @Column(name = "version_lock")
    private Long versionLock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AgreementStatus status = AgreementStatus.PENDING_APPROVAL;

    @Column(name = "agreed_price_per_kg", precision = 15, scale = 4)
    private BigDecimal agreedPricePerKg;

    @Column(name = "overlap_low", precision = 15, scale = 4)
    private BigDecimal overlapLow;

    @Column(name = "overlap_high", precision = 15, scale = 4)
    private BigDecimal overlapHigh;

    @Column(name = "total_value_gross", precision = 15, scale = 4)
    private BigDecimal totalValueGross;

    @Column(name = "transport_deduction_per_kg", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal transportDeductionPerKg = BigDecimal.ZERO;

    @Column(name = "platform_fee_rate", precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal platformFeeRate = new BigDecimal("0.0200");

    @Column(name = "amendment_reason")
    private String amendmentReason;

    /**
     * SHA-256 canonical hash of finalized agreement for tamper-evident audit.
     */
    @Column(name = "integrity_hash", length = 64)
    private String integrityHash;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
