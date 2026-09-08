package com.farmunity.entity;

import com.farmunity.entity.enums.TrustTier;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "buyer_requirements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private Buyer buyer;

    @Column(nullable = false)
    private String product;

    private String variety;

    @Column(name = "quantity_kg", nullable = false, precision = 15, scale = 4)
    private BigDecimal quantityKg;

    @Column(name = "moisture_band_min", precision = 5, scale = 2)
    private BigDecimal moistureBandMin;

    @Column(name = "moisture_band_max", precision = 5, scale = 2)
    private BigDecimal moistureBandMax;

    @Column(name = "price_min", precision = 15, scale = 4)
    private BigDecimal priceMin;

    @Column(name = "price_max", precision = 15, scale = 4)
    private BigDecimal priceMax;

    @Column(name = "delivery_window_start")
    private LocalDate deliveryWindowStart;

    @Column(name = "delivery_window_end")
    private LocalDate deliveryWindowEnd;

    private String destination;

    @Column(name = "destination_latitude")
    private Double destinationLatitude;

    @Column(name = "destination_longitude")
    private Double destinationLongitude;

    @Column(name = "commitment_deposit", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal commitmentDeposit = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "trust_level_required")
    @Builder.Default
    private TrustTier trustLevelRequired = TrustTier.NEW;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
