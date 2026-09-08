package com.farmunity.entity;

import com.farmunity.entity.enums.CommitmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commitment_ledgers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitmentLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agreement_id", nullable = false)
    private Agreement agreement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private Buyer buyer;

    @Column(name = "committed_amount", nullable = false, precision = 15, scale = 4)
    private BigDecimal committedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CommitmentStatus status = CommitmentStatus.PENDING;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "funded_at")
    private LocalDateTime fundedAt;

    @Column(name = "pickup_verified_at")
    private LocalDateTime pickupVerifiedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
