package com.farmunity.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produce_listing_id", nullable = false, unique = true)
    private ProduceListing produceListing;

    @Column(name = "verified_qty", precision = 15, scale = 4)
    private BigDecimal verifiedQty;

    @Column(name = "moisture_reading", precision = 5, scale = 2)
    private BigDecimal moistureReading;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verifier_id", nullable = false)
    private Coordinator verifier;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "evidence_notes", columnDefinition = "TEXT")
    private String evidenceNotes;

    /** Comma-separated photo URLs captured during field verification */
    @Column(name = "photo_urls", columnDefinition = "TEXT")
    private String photoUrls;
}
