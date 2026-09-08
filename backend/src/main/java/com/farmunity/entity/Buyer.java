package com.farmunity.entity;

import com.farmunity.entity.enums.OrgType;
import com.farmunity.entity.enums.TrustTier;
import com.farmunity.entity.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "buyers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Buyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserRole role = UserRole.BUYER;

    @Enumerated(EnumType.STRING)
    @Column(name = "org_type")
    private OrgType orgType;

    private Double latitude;
    private Double longitude;
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "trust_tier", nullable = false)
    @Builder.Default
    private TrustTier trustTier = TrustTier.NEW;

    @Column(name = "reliability_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal reliabilityScore = new BigDecimal("50.00");

    @Column(name = "commitment_deposit_balance", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal commitmentDepositBalance = BigDecimal.ZERO;

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
