package com.farmunity.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "crop_configs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CropConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "crop_name", nullable = false, unique = true)
    private String cropName;

    private String variety;

    @Column(name = "moisture_min", nullable = false, precision = 5, scale = 2)
    private BigDecimal moistureMin;

    @Column(name = "moisture_max", nullable = false, precision = 5, scale = 2)
    private BigDecimal moistureMax;

    /**
     * Expected output-to-input ratio, e.g. 0.65 means 65 kg rice per 100 kg paddy.
     */
    @Column(name = "expected_yield_ratio", nullable = false, precision = 5, scale = 4)
    private BigDecimal expectedYieldRatio;

    @Column(name = "max_distance_km", precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal maxDistanceKm = new BigDecimal("100.00");

    @Column(name = "harvest_window_days")
    @Builder.Default
    private int harvestWindowDays = 30;
}
