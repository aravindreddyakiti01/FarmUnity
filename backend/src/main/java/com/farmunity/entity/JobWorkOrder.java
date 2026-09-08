package com.farmunity.entity;

import com.farmunity.entity.enums.WorkOrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_work_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobWorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agreement_id", nullable = false)
    private Agreement agreement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processor_id", nullable = false)
    private Processor processor;

    @Column(name = "raw_input_qty", nullable = false, precision = 15, scale = 4)
    private BigDecimal rawInputQty;

    @Column(name = "expected_yield_ratio", nullable = false, precision = 5, scale = 4)
    private BigDecimal expectedYieldRatio;

    @Column(name = "actual_output_qty", precision = 15, scale = 4)
    private BigDecimal actualOutputQty;

    @Column(name = "actual_yield_ratio", precision = 5, scale = 4)
    private BigDecimal actualYieldRatio;

    @Column(name = "fee", nullable = false, precision = 15, scale = 4)
    private BigDecimal fee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private WorkOrderStatus status = WorkOrderStatus.PENDING;

    @Column(name = "flagged_for_review", nullable = false)
    @Builder.Default
    private Boolean flaggedForReview = false;

    @Column(name = "flag_reason")
    private String flagReason;

    @Column(name = "processor_adjustment", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal processorAdjustment = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
