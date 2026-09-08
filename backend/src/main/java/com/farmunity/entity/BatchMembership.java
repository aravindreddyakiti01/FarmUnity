package com.farmunity.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "batch_memberships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooperative_batch_id", nullable = false)
    private CooperativeBatch cooperativeBatch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produce_listing_id", nullable = false)
    private ProduceListing produceListing;

    @Column(name = "allocated_qty", nullable = false, precision = 15, scale = 4)
    private BigDecimal allocatedQty;

    /**
     * Human-readable explanation, e.g. "reliability:85,distance:12.3km,pricefit:true"
     */
    @Column(name = "inclusion_reason")
    private String inclusionReason;

    /**
     * Farmer's decision on joining the batch: PENDING, ACCEPTED, REJECTED, REVISED
     */
    @Column(name = "farmer_decision")
    @Builder.Default
    private String farmerDecision = "PENDING";

    @Column(name = "farmer_note", columnDefinition = "TEXT")
    private String farmerNote;
}
