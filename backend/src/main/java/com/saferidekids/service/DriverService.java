package com.saferidekids.service;

import com.saferidekids.dto.response.TripChildDto;
import com.saferidekids.dto.response.TripDto;
import com.saferidekids.entity.Driver;
import com.saferidekids.entity.Trip;
import com.saferidekids.repository.DriverRepository;
import com.saferidekids.repository.TripRepository;
import com.saferidekids.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import com.saferidekids.dto.request.QrScanRequest;
import com.saferidekids.dto.response.QrScanResponse;
import com.saferidekids.entity.Child;
import com.saferidekids.entity.Notification;
import com.saferidekids.entity.TripChild;
import com.saferidekids.repository.ChildRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final NotificationService notificationService;

    private Driver getDriverByEmail(String email) {
        return driverRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Driver profile not found"));
    }

    public List<TripDto> getTodayTrips(String driverEmail) {
        Driver driver = getDriverByEmail(driverEmail);
        LocalDate today = LocalDate.now();
        List<Trip> trips = tripRepository.findByDriverIdAndTripDate(driver.getId(), today);

        return trips.stream().map(this::mapToTripDto).collect(Collectors.toList());
    }

    @Transactional
    public TripDto startTrip(String driverEmail, Long tripId) {
        Driver driver = getDriverByEmail(driverEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (!trip.getDriver().getId().equals(driver.getId())) {
            throw new IllegalArgumentException("Unauthorized to start this trip");
        }

        if (trip.getStatus() != Trip.TripStatus.SCHEDULED) {
            throw new IllegalStateException("Trip is already " + trip.getStatus().name());
        }

        trip.setStatus(Trip.TripStatus.IN_PROGRESS);
        trip.setActualStartTime(LocalDateTime.now());
        
        // Also update children status to EXPECTED
        if (trip.getTripChildren() != null) {
            trip.getTripChildren().forEach(tc -> {
                if (trip.getType() == Trip.TripType.PICKUP) {
                    tc.setPickupStatus(com.saferidekids.entity.TripChild.PickupStatus.EXPECTED);
                } else if (trip.getType() == Trip.TripType.DROP) {
                    tc.setDropStatus(com.saferidekids.entity.TripChild.DropStatus.PENDING);
                }
            });
        }

        Trip savedTrip = tripRepository.save(trip);
        return mapToTripDto(savedTrip);
    }

    @Transactional
    public QrScanResponse scanQr(String driverEmail, QrScanRequest request) {
        Driver driver = getDriverByEmail(driverEmail);
        
        List<Trip> activeTrips = tripRepository.findByDriverIdAndStatus(driver.getId(), Trip.TripStatus.IN_PROGRESS);
        if (activeTrips.isEmpty()) {
            throw new IllegalStateException("No active trip found. Start a trip first.");
        }
        Trip trip = activeTrips.get(0);

        Child child = childRepository.findByQrCodeToken(request.getQrCodeToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid QR Code"));

        TripChild tripChild = trip.getTripChildren().stream()
                .filter(tc -> tc.getChild().getId().equals(child.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Child is not assigned to this trip"));

        if (tripChild.isPickupVerifiedByQr()) {
            throw new IllegalStateException("Duplicate scan! Child is already verified.");
        }

        tripChild.setPickupStatus(TripChild.PickupStatus.PICKED_UP);
        tripChild.setPickupVerifiedByQr(true);
        tripChild.setPickupTime(LocalDateTime.now());
        child.setTransportStatus(Child.TransportStatus.IN_TRANSIT);

        tripRepository.save(trip);

        notificationService.sendNotification(
            child.getParent().getUser(),
            trip,
            child,
            Notification.NotificationType.CHILD_PICKED_UP,
            "Child Picked Up",
            child.getFirstName() + " has been successfully picked up by " + driver.getUser().getFirstName(),
            Notification.Priority.HIGH
        );

        return QrScanResponse.builder()
                .childName(child.getFirstName() + " " + child.getLastName())
                .childId(child.getId())
                .qrStatus("VERIFIED")
                .pickupTime(tripChild.getPickupTime())
                .driverName(driver.getUser().getFirstName() + " " + driver.getUser().getLastName())
                .vehicleNumber(trip.getVehicle().getRegistrationNumber())
                .routeName(trip.getRoute() != null ? trip.getRoute().getName() : "Direct Route")
                .build();
    }

    @Transactional
    public QrScanResponse dropChild(String driverEmail, Long tripId, Long childId) {
        Driver driver = getDriverByEmail(driverEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (!trip.getDriver().getId().equals(driver.getId())) {
            throw new IllegalArgumentException("Unauthorized to modify this trip");
        }

        if (trip.getStatus() != Trip.TripStatus.IN_PROGRESS) {
            throw new IllegalStateException("Trip is not active");
        }

        TripChild tripChild = trip.getTripChildren().stream()
                .filter(tc -> tc.getChild().getId().equals(childId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Child is not assigned to this trip"));

        if (tripChild.getPickupStatus() != TripChild.PickupStatus.PICKED_UP) {
            throw new IllegalStateException("Child cannot be dropped before pickup");
        }

        if (tripChild.getDropStatus() == TripChild.DropStatus.DROPPED) {
            throw new IllegalStateException("Child is already dropped off");
        }

        tripChild.setDropStatus(TripChild.DropStatus.DROPPED);
        tripChild.setDropVerified(true);
        tripChild.setDropTime(LocalDateTime.now());
        
        Child child = tripChild.getChild();
        child.setTransportStatus(Child.TransportStatus.DROPPED);

        tripRepository.save(trip);

        notificationService.sendNotification(
            child.getParent().getUser(),
            trip,
            child,
            Notification.NotificationType.CHILD_DROPPED,
            "Child Dropped Off",
            child.getFirstName() + " has been successfully dropped off by " + driver.getUser().getFirstName(),
            Notification.Priority.HIGH
        );

        return QrScanResponse.builder()
                .childName(child.getFirstName() + " " + child.getLastName())
                .childId(child.getId())
                .qrStatus("DROPPED")
                .pickupTime(tripChild.getDropTime()) // Reusing pickupTime field for dropTime display
                .driverName(driver.getUser().getFirstName() + " " + driver.getUser().getLastName())
                .vehicleNumber(trip.getVehicle().getRegistrationNumber())
                .routeName(trip.getRoute() != null ? trip.getRoute().getName() : "Direct Route")
                .build();
    }

    @Transactional
    public TripDto endTrip(String driverEmail, Long tripId) {
        Driver driver = getDriverByEmail(driverEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (!trip.getDriver().getId().equals(driver.getId())) {
            throw new IllegalArgumentException("Unauthorized to modify this trip");
        }

        if (trip.getStatus() != Trip.TripStatus.IN_PROGRESS) {
            throw new IllegalStateException("Trip is not active");
        }

        boolean allDropped = trip.getTripChildren().stream()
                .allMatch(tc -> tc.getDropStatus() == TripChild.DropStatus.DROPPED);

        if (!allDropped) {
            throw new IllegalArgumentException("Cannot end trip. All children must be dropped first.");
        }

        trip.setStatus(Trip.TripStatus.COMPLETED);
        trip.setActualEndTime(LocalDateTime.now());
        
        driver.setTotalTrips(driver.getTotalTrips() + 1);
        driverRepository.save(driver);

        Trip savedTrip = tripRepository.save(trip);
        return mapToTripDto(savedTrip);
    }

    private TripDto mapToTripDto(Trip trip) {
        List<TripChildDto> children = trip.getTripChildren().stream().map(tc -> TripChildDto.builder()
                .id(tc.getChild().getId())
                .childId(tc.getChild().getId())
                .name(tc.getChild().getFirstName() + " " + tc.getChild().getLastName())
                .pickupAddress(tc.getChild().getParent().getAddress())
                .pickupStatus(tc.getPickupStatus().name())
                .dropStatus(tc.getDropStatus().name())
                .build()).collect(Collectors.toList());

        String time = trip.getScheduledStartTime() != null 
                ? trip.getScheduledStartTime().format(DateTimeFormatter.ofPattern("hh:mm a"))
                : "TBD";

        return TripDto.builder()
                .id(trip.getId())
                .date(trip.getTripDate().toString())
                .type(trip.getType().name())
                .status(trip.getStatus().name())
                .scheduledTime(time)
                .institution(trip.getInstitution() != null ? trip.getInstitution().getName() : "Unknown")
                .vehicle(trip.getVehicle() != null ? TripDto.VehicleDto.builder()
                        .id(trip.getVehicle().getId())
                        .number(trip.getVehicle().getRegistrationNumber())
                        .type(trip.getVehicle().getType().name())
                        .build() : null)
                .children(children)
                .build();
    }
}
