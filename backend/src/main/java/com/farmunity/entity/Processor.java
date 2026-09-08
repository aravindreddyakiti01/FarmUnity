package com.farmunity.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "processors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Processor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String phone;
    private String address;
    private Double latitude;
    private Double longitude;

    /** Processing capacity in kg per day */
    @Column(precision = 15, scale = 4)
    private BigDecimal capacity;

    @Column(name = "fee_per_kg", precision = 15, scale = 4)
    private BigDecimal feePerKg;

    @Column(name = "wallet_balance", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal walletBalance = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
