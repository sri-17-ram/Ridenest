package com.saferidekids.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "route_waypoints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteWaypoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    @Column(name = "is_pickup_point")
    @Builder.Default
    private boolean pickupPoint = false;

    @Column(name = "estimated_arrival_minutes")
    private Integer estimatedArrivalMinutes;
}
