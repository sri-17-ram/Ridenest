package com.saferidekids.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "trips")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id")
    private Institution institution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private Route route;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripType type;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TripStatus status = TripStatus.SCHEDULED;

    @Column(nullable = false)
    private LocalDate tripDate;

    private LocalDateTime scheduledStartTime;
    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;

    @Column(name = "start_latitude")
    private Double startLatitude;

    @Column(name = "start_longitude")
    private Double startLongitude;

    @Column(name = "destination_latitude")
    private Double destinationLatitude;

    @Column(name = "destination_longitude")
    private Double destinationLongitude;

    private String startAddress;
    private String destinationAddress;

    @Column(name = "route_deviation_detected")
    @Builder.Default
    private boolean routeDeviationDetected = false;

    @Column(name = "accident_detected")
    @Builder.Default
    private boolean accidentDetected = false;

    @Column(name = "is_emergency")
    @Builder.Default
    private boolean emergency = false;

    private String notes;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TripChild> tripChildren;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GpsLog> gpsLogs;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TripType {
        PICKUP, DROP, ROUND_TRIP
    }

    public enum TripStatus {
        SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, EMERGENCY
    }
}
