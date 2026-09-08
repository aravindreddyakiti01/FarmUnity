package com.farmunity.entity;

import com.farmunity.entity.enums.BatchStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cooperative_batches")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CooperativeBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_requirement_id", nullable = false)
    private BuyerRequirement buyerRequirement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BatchStatus status = BatchStatus.FORMING;

    @Column(name = "shortfall_qty", precision = 15, scale = 4)
    private BigDecimal shortfallQty;

    @OneToMany(mappedBy = "cooperativeBatch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<BatchMembership> memberships = new ArrayList<>();

    @Column(name = "total_allocated_qty", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal totalAllocatedQty = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
