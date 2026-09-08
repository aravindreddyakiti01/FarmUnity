package com.farmunity.entity;

import com.farmunity.entity.enums.ProduceListingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "produce_listings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduceListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(nullable = false)
    private String crop;

    private String variety;

    /**
     * Farmer-declared quantity. NEVER used for payment calculations.
     * Payments always use verifiedQty set by VerificationService.
     */
    @Column(name = "declared_qty", nullable = false, precision = 15, scale = 4)
    private BigDecimal declaredQty;

    /**
     * Set ONLY by VerificationService after coordinator verification.
     * Never set from declaredQty or from any other code path.
     */
    @Column(name = "verified_qty", precision = 15, scale = 4)
    private BigDecimal verifiedQty;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "min_price_per_kg", nullable = false, precision = 15, scale = 4)
    private BigDecimal minPricePerKg;

    @Column(name = "moisture_reading", precision = 5, scale = 2)
    private BigDecimal moistureReading;

    private Double latitude;
    private Double longitude;

    @Column(name = "storage_condition")
    private String storageCondition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProduceListingStatus status = ProduceListingStatus.DRAFT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Package-private setter so only VerificationService (same package via service layer)
     * can set verifiedQty. External code must use VerificationService.verifyListing().
     */
    public void applyVerification(BigDecimal verifiedQty, BigDecimal moistureReading) {
        this.verifiedQty = verifiedQty;
        this.moistureReading = moistureReading;
    }
}
