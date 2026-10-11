package com.saferidekids.service;

import com.saferidekids.entity.*;
import com.saferidekids.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GpsService {

    private final GpsLogRepository gpsLogRepository;
    private final TripRepository tripRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${app.gps.deviation-threshold-meters:200}")
    private double deviationThresholdMeters;

    @Value("${app.accident.g-force-threshold:3.0}")
    private double gForceThreshold;

    @Transactional
    public GpsLog processGpsUpdate(Long tripId, Long driverId, Double lat, Double lng,
                                    Double speed, Double accuracy, Double heading,
                                    Double gForce, Boolean suddenStop) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + tripId));

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + driverId));

        // Update driver location
        driver.setCurrentLatitude(lat);
        driver.setCurrentLongitude(lng);
        driver.setLastLocationUpdate(LocalDateTime.now());
        driverRepository.save(driver);

        // Check route deviation
        boolean isDeviation = false;
        double deviationDistance = 0.0;

        if (trip.getRoute() != null) {
            Route route = trip.getRoute();
            double minDistance = calculateMinDistanceToRoute(lat, lng, route);
            if (minDistance > deviationThresholdMeters) {
                isDeviation = true;
                deviationDistance = minDistance;

                if (!trip.isRouteDeviationDetected()) {
                    trip.setRouteDeviationDetected(true);
                    tripRepository.save(trip);
                    handleRouteDeviation(trip, lat, lng, minDistance);
                }
            }
        }

        // Save GPS log
        GpsLog gpsLog = GpsLog.builder()
                .trip(trip)
                .driver(driver)
                .latitude(lat)
                .longitude(lng)
                .speed(speed)
                .accuracy(accuracy)
                .heading(heading)
                .deviation(isDeviation)
                .deviationDistance(isDeviation ? deviationDistance : null)
                .build();
        gpsLog = gpsLogRepository.save(gpsLog);

        // Broadcast via WebSocket
        Map<String, Object> locationUpdate = new HashMap<>();
        locationUpdate.put("tripId", tripId);
        locationUpdate.put("driverId", driverId);
        locationUpdate.put("latitude", lat);
        locationUpdate.put("longitude", lng);
        locationUpdate.put("speed", speed);
        locationUpdate.put("heading", heading);
        locationUpdate.put("isDeviation", isDeviation);
        locationUpdate.put("timestamp", LocalDateTime.now().toString());

        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/location", locationUpdate);

        // Check for accident detection
        if (gForce != null && gForce > gForceThreshold) {
            handlePossibleAccident(trip, lat, lng, gForce);
        }
        if (Boolean.TRUE.equals(suddenStop) && speed != null && speed < 5.0) {
            handlePossibleAccident(trip, lat, lng, 0.0);
        }

        return gpsLog;
    }

    private double calculateMinDistanceToRoute(double lat, double lng, Route route) {
        if (route.getWaypoints() == null || route.getWaypoints().isEmpty()) {
            return 0.0;
        }
        return route.getWaypoints().stream()
                .mapToDouble(wp -> haversineDistance(lat, lng, wp.getLatitude(), wp.getLongitude()))
                .min()
                .orElse(0.0);
    }

    public double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private void handleRouteDeviation(Trip trip, double lat, double lng, double distance) {
        log.warn("Route deviation detected for trip {} at ({}, {}), distance: {}m", trip.getId(), lat, lng, distance);
        String message = String.format(
                "Vehicle has deviated %.0fm from planned route at location (%.4f, %.4f)", distance, lat, lng);

        // Notify all parents in this trip
        if (trip.getTripChildren() != null) {
            trip.getTripChildren().forEach(tc -> {
                notificationService.sendNotification(
                        tc.getChild().getParent().getUser(),
                        trip, tc.getChild(),
                        Notification.NotificationType.ROUTE_DEVIATION,
                        "⚠️ Route Deviation Alert",
                        message,
                        Notification.Priority.HIGH
                );
            });
        }

        // Broadcast emergency status via WebSocket
        Map<String, Object> alert = new HashMap<>();
        alert.put("type", "ROUTE_DEVIATION");
        alert.put("tripId", trip.getId());
        alert.put("latitude", lat);
        alert.put("longitude", lng);
        alert.put("deviationMeters", distance);
        messagingTemplate.convertAndSend("/topic/trip/" + trip.getId() + "/alerts", alert);
    }

    private void handlePossibleAccident(Trip trip, double lat, double lng, double gForce) {
        log.error("Possible accident detected for trip {} at ({}, {}), G-force: {}", trip.getId(), lat, lng, gForce);

        Map<String, Object> accidentAlert = new HashMap<>();
        accidentAlert.put("type", "ACCIDENT_SUSPECTED");
        accidentAlert.put("tripId", trip.getId());
        accidentAlert.put("latitude", lat);
        accidentAlert.put("longitude", lng);
        accidentAlert.put("gForce", gForce);
        accidentAlert.put("responseTimeoutSeconds", 30);
        messagingTemplate.convertAndSend("/topic/trip/" + trip.getId() + "/accident", accidentAlert);
        // Driver response handled via /api/trips/{id}/accident-response endpoint
    }

    public List<GpsLog> getTripPath(Long tripId) {
        return gpsLogRepository.findByTripIdOrderByTimestampAsc(tripId);
    }

    public GpsLog getLatestLocation(Long tripId) {
        return gpsLogRepository.findLatestByTripId(tripId)
                .orElse(null);
    }
}
