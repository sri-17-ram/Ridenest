package com.saferidekids.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    private Integer year;
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType type;

    @Column(name = "seating_capacity")
    private Integer seatingCapacity;

    @Column(name = "rc_document_path")
    private String rcDocumentPath;

    @Column(name = "insurance_document_path")
    private String insuranceDocumentPath;

    @Column(name = "fitness_certificate_path")
    private String fitnessCertificatePath;

    @Column(name = "permit_document_path")
    private String permitDocumentPath;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus rcStatus = VerificationStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus insuranceStatus = VerificationStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus overallStatus = VerificationStatus.PENDING;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum VehicleType {
        AUTO, VAN, MINI_BUS, BUS, CAR, TEMPO_TRAVELLER
    }

    public enum VerificationStatus {
        PENDING, UNDER_REVIEW, APPROVED, REJECTED
    }
}
