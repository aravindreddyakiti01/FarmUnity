package com.farmunity.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "settlements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agreement_id", nullable = false)
    private Agreement agreement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    /**
     * Quantity used for settlement. ALWAYS verifiedQty, never declaredQty.
     */
    @Column(name = "verified_qty", nullable = false, precision = 15, scale = 4)
    private BigDecimal verifiedQty;

    @Column(name = "gross_amount", nullable = false, precision = 15, scale = 4)
    private BigDecimal grossAmount;

    @Column(name = "transport_deduction", nullable = false, precision = 15, scale = 4)
    private BigDecimal transportDeduction;

    @Column(name = "platform_fee", nullable = false, precision = 15, scale = 4)
    private BigDecimal platformFee;

    @Column(name = "net_payout", nullable = false, precision = 15, scale = 4)
    private BigDecimal netPayout;

    @Column(name = "is_paid", nullable = false)
    @Builder.Default
    private Boolean isPaid = false;

    /**
     * SHA-256 canonical hash of the individual settlement calculation.
     */
    @Column(name = "integrity_hash", length = 64)
    private String integrityHash;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
