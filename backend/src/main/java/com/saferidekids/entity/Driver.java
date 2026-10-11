package com.saferidekids.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "drivers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "license_number", unique = true)
    private String licenseNumber;

    @Column(name = "aadhaar_number", unique = true)
    private String aadhaarNumber;

    private String address;
    private String city;
    private String state;
    private String pincode;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus licenseStatus = VerificationStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus aadhaarStatus = VerificationStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus overallStatus = VerificationStatus.PENDING;

    private String licenseDocumentPath;
    private String aadhaarDocumentPath;
    private String profileVerifiedBy;
    private LocalDateTime verifiedAt;

    @Column(name = "total_trips")
    @Builder.Default
    private Integer totalTrips = 0;

    @Column(name = "rating")
    @Builder.Default
    private Double rating = 5.0;

    @Column(name = "is_available")
    @Builder.Default
    private boolean available = true;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @Column(name = "last_location_update")
    private LocalDateTime lastLocationUpdate;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Trip> trips;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum VerificationStatus {
        PENDING, UNDER_REVIEW, APPROVED, REJECTED
    }
}
