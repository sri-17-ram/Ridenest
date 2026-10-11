package com.saferidekids.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_children")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripChild {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PickupStatus pickupStatus = PickupStatus.EXPECTED;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DropStatus dropStatus = DropStatus.PENDING;

    private LocalDateTime pickupTime;
    private LocalDateTime dropTime;

    @Column(name = "pickup_verified_by_qr")
    @Builder.Default
    private boolean pickupVerifiedByQr = false;

    @Column(name = "drop_verified")
    @Builder.Default
    private boolean dropVerified = false;

    @Column(name = "pickup_latitude")
    private Double pickupLatitude;

    @Column(name = "pickup_longitude")
    private Double pickupLongitude;

    @Column(name = "drop_latitude")
    private Double dropLatitude;

    @Column(name = "drop_longitude")
    private Double dropLongitude;

    private String notes;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PickupStatus {
        EXPECTED, ABSENT, PICKED_UP, MISSED
    }

    public enum DropStatus {
        PENDING, DROPPED, FAILED
    }
}
