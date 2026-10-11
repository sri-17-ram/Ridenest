package com.saferidekids.service;

import com.saferidekids.dto.request.ChildRequest;
import com.saferidekids.dto.response.ChildResponse;
import com.saferidekids.entity.Child;
import com.saferidekids.entity.Parent;
import com.saferidekids.entity.User;
import com.saferidekids.repository.ChildRepository;
import com.saferidekids.repository.ParentRepository;
import com.saferidekids.repository.TripRepository;
import com.saferidekids.repository.UserRepository;
import com.saferidekids.dto.response.TripDto;
import com.saferidekids.dto.response.TripChildDto;
import com.saferidekids.entity.Trip;
import com.saferidekids.dto.response.LocationResponse;
import com.saferidekids.dto.request.LocationRequest;
import com.saferidekids.dto.response.NotificationResponse;
import com.saferidekids.entity.ParentLocation;
import com.saferidekids.entity.Notification;
import com.saferidekids.entity.GpsLog;
import com.saferidekids.repository.ParentLocationRepository;
import com.saferidekids.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentService {

    private final ChildRepository childRepository;
    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final ParentLocationRepository parentLocationRepository;
    private final NotificationRepository notificationRepository;
    private final GpsService gpsService;

    private Parent getParentByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return parentRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Parent profile not found"));
    }

    @Transactional
    public ChildResponse addChild(String parentEmail, ChildRequest request) {
        Parent parent = getParentByEmail(parentEmail);

        Child child = Child.builder()
                .parent(parent)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .grade(request.getGrade())
                .section(request.getSection())
                .bloodGroup(request.getBloodGroup())
                .medicalNotes(request.getMedicalNotes())
                .qrCodeToken("QR-" + request.getFirstName().toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .transportStatus(Child.TransportStatus.AT_HOME)
                .build();

        child = childRepository.save(child);
        return mapToChildResponse(child);
    }

    public List<ChildResponse> getChildren(String parentEmail) {
        Parent parent = getParentByEmail(parentEmail);
        return childRepository.findByParentId(parent.getId())
                .stream()
                .map(this::mapToChildResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChildResponse generateQr(String parentEmail, Long childId) {
        Parent parent = getParentByEmail(parentEmail);
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new IllegalArgumentException("Child not found"));

        if (!child.getParent().getId().equals(parent.getId())) {
            throw new IllegalArgumentException("Unauthorized to generate QR for this child");
        }

        child.setQrCodeToken("QR-" + child.getFirstName().toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        child = childRepository.save(child);
        return mapToChildResponse(child);
    }

    private ChildResponse mapToChildResponse(Child child) {
        return ChildResponse.builder()
                .id(child.getId())
                .firstName(child.getFirstName())
                .lastName(child.getLastName())
                .grade(child.getGrade())
                .section(child.getSection())
                .bloodGroup(child.getBloodGroup())
                .medicalNotes(child.getMedicalNotes())
                .qrCodeToken(child.getQrCodeToken())
                .transportStatus(child.getTransportStatus().name())
                .institution(child.getInstitution() != null ? child.getInstitution().getName() : "Not assigned")
                // A complete implementation would determine assigned driver from active trips, but for the demo we can leave it null or mock it
                .assignedDriver(null)
                .vehicle(null)
                .build();
    }

    public TripDto getActiveTrip(String parentEmail) {
        Parent parent = getParentByEmail(parentEmail);
        List<Trip> activeTrips = tripRepository.findActiveTripsByParentId(parent.getId());
        
        if (activeTrips.isEmpty()) {
            return null;
        }
        
        Trip trip = activeTrips.get(0);
        GpsLog latestLocation = gpsService.getLatestLocation(trip.getId());
        
        // Phase 5: Generate simulated GPS movement for demo if no logs exist
        if (latestLocation == null) {
            // As per requirements: "If GPS logs do not exist: Return null. Do NOT inject fake GPS data into backend responses. Instead: Implement demo GPS simulation ONLY inside the frontend."
            latestLocation = null;
        }
        
        return TripDto.builder()
                .id(trip.getId())
                .date(trip.getTripDate().toString())
                .type(trip.getType().name())
                .status(trip.getStatus().name())
                .scheduledTime(trip.getActualStartTime() != null ? trip.getActualStartTime().toString() : "")
                .institution(trip.getInstitution() != null ? trip.getInstitution().getName() : "")
                .driver(TripDto.DriverDto.builder()
                        .id(trip.getDriver().getId())
                        .name(trip.getDriver().getUser().getFirstName() + " " + trip.getDriver().getUser().getLastName())
                        .phone(trip.getDriver().getUser().getPhoneNumber())
                        .build())
                .vehicle(TripDto.VehicleDto.builder()
                        .id(trip.getVehicle().getId())
                        .number(trip.getVehicle().getRegistrationNumber())
                        .type(trip.getVehicle().getType().name())
                        .build())
                .route(trip.getRoute() != null ? TripDto.RouteDto.builder()
                        .id(trip.getRoute().getId())
                        .name(trip.getRoute().getName())
                        .build() : null)
                .gps(latestLocation)
                .eta(15) // Mock ETA
                .children(trip.getTripChildren().stream().map(tc -> TripChildDto.builder()
                        .childId(tc.getChild().getId())
                        .name(tc.getChild().getFirstName() + " " + tc.getChild().getLastName())
                        .pickupStatus(tc.getPickupStatus().name())
                        .dropStatus(tc.getDropStatus().name())
                        .build()).collect(Collectors.toList()))
                .build();
    }

    public List<TripDto> getTripHistory(String parentEmail) {
        Parent parent = getParentByEmail(parentEmail);
        return tripRepository.findTripsByParentId(parent.getId())
                .stream()
                .map(trip -> TripDto.builder()
                        .id(trip.getId())
                        .date(trip.getTripDate().toString())
                        .type(trip.getType().name())
                        .status(trip.getStatus().name())
                        .scheduledTime(trip.getActualStartTime() != null ? trip.getActualStartTime().toString() : "")
                        .endTime(trip.getActualEndTime() != null ? trip.getActualEndTime().toString() : "")
                        .institution(trip.getInstitution() != null ? trip.getInstitution().getName() : "")
                        .driver(TripDto.DriverDto.builder()
                                .name(trip.getDriver().getUser().getFirstName() + " " + trip.getDriver().getUser().getLastName())
                                .build())
                        .vehicle(TripDto.VehicleDto.builder()
                                .number(trip.getVehicle().getRegistrationNumber())
                                .type(trip.getVehicle().getType().name())
                                .build())
                        .children(trip.getTripChildren().stream()
                                .filter(tc -> tc.getChild().getParent().getId().equals(parent.getId()))
                                .map(tc -> TripChildDto.builder()
                                        .childId(tc.getChild().getId())
                                        .name(tc.getChild().getFirstName())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    public TripDto getTripDetails(String parentEmail, Long tripId) {
        Parent parent = getParentByEmail(parentEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        return TripDto.builder()
                .id(trip.getId())
                .date(trip.getTripDate().toString())
                .type(trip.getType().name())
                .status(trip.getStatus().name())
                .scheduledTime(trip.getActualStartTime() != null ? trip.getActualStartTime().toString() : "")
                .endTime(trip.getActualEndTime() != null ? trip.getActualEndTime().toString() : "")
                .institution(trip.getInstitution() != null ? trip.getInstitution().getName() : "")
                .driver(TripDto.DriverDto.builder()
                        .id(trip.getDriver().getId())
                        .name(trip.getDriver().getUser().getFirstName() + " " + trip.getDriver().getUser().getLastName())
                        .phone(trip.getDriver().getUser().getPhoneNumber())
                        .build())
                .vehicle(TripDto.VehicleDto.builder()
                        .id(trip.getVehicle().getId())
                        .number(trip.getVehicle().getRegistrationNumber())
                        .type(trip.getVehicle().getType().name())
                        .build())
                .route(trip.getRoute() != null ? TripDto.RouteDto.builder()
                        .id(trip.getRoute().getId())
                        .name(trip.getRoute().getName())
                        .build() : null)
                .children(trip.getTripChildren().stream()
                        .filter(tc -> tc.getChild().getParent().getId().equals(parent.getId()))
                        .map(tc -> TripChildDto.builder()
                                .childId(tc.getChild().getId())
                                .name(tc.getChild().getFirstName() + " " + tc.getChild().getLastName())
                                .pickupStatus(tc.getPickupStatus().name())
                                .dropStatus(tc.getDropStatus().name())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    public List<LocationResponse> getLocations(String parentEmail) {
        Parent parent = getParentByEmail(parentEmail);
        return parentLocationRepository.findByParentId(parent.getId())
                .stream()
                .map(this::mapToLocationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LocationResponse addLocation(String parentEmail, LocationRequest request) {
        Parent parent = getParentByEmail(parentEmail);

        if (parentLocationRepository.existsByParentIdAndLatitudeAndLongitude(parent.getId(), request.getLatitude(), request.getLongitude())) {
            throw new IllegalArgumentException("Location already exists");
        }

        ParentLocation.LocationType type = ParentLocation.LocationType.valueOf(request.getType());

        if (request.isDefault()) {
            // Unset previous default for this type
            parentLocationRepository.findByParentIdAndType(parent.getId(), type).forEach(loc -> {
                if (loc.isDefault()) {
                    loc.setDefault(false);
                    parentLocationRepository.save(loc);
                }
            });
        }

        ParentLocation location = ParentLocation.builder()
                .parent(parent)
                .type(type)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .landmark(request.getLandmark())
                .nickname(request.getNickname())
                .isDefault(request.isDefault())
                .build();

        return mapToLocationResponse(parentLocationRepository.save(location));
    }

    @Transactional
    public LocationResponse updateLocation(String parentEmail, Long locationId, LocationRequest request) {
        Parent parent = getParentByEmail(parentEmail);
        ParentLocation location = parentLocationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));

        if (!location.getParent().getId().equals(parent.getId())) {
            throw new IllegalArgumentException("Unauthorized to update this location");
        }

        ParentLocation.LocationType type = ParentLocation.LocationType.valueOf(request.getType());

        if (request.isDefault() && !location.isDefault()) {
            parentLocationRepository.findByParentIdAndType(parent.getId(), type).forEach(loc -> {
                if (loc.isDefault() && !loc.getId().equals(location.getId())) {
                    loc.setDefault(false);
                    parentLocationRepository.save(loc);
                }
            });
        }

        location.setType(type);
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setAddress(request.getAddress());
        location.setLandmark(request.getLandmark());
        location.setNickname(request.getNickname());
        location.setDefault(request.isDefault());

        return mapToLocationResponse(parentLocationRepository.save(location));
    }

    @Transactional
    public void deleteLocation(String parentEmail, Long locationId) {
        Parent parent = getParentByEmail(parentEmail);
        ParentLocation location = parentLocationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));

        if (!location.getParent().getId().equals(parent.getId())) {
            throw new IllegalArgumentException("Unauthorized to delete this location");
        }

        parentLocationRepository.delete(location);
    }

    private LocationResponse mapToLocationResponse(ParentLocation loc) {
        return LocationResponse.builder()
                .id(loc.getId())
                .type(loc.getType().name())
                .latitude(loc.getLatitude())
                .longitude(loc.getLongitude())
                .address(loc.getAddress())
                .landmark(loc.getLandmark())
                .nickname(loc.getNickname())
                .isDefault(loc.isDefault())
                .createdAt(loc.getCreatedAt())
                .build();
    }

    public List<NotificationResponse> getNotifications(String parentEmail) {
        Parent parent = getParentByEmail(parentEmail);
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(parent.getUser().getId())
                .stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .type(n.getType().name())
                        .title(n.getTitle())
                        .message(n.getMessage())
                        .isRead(n.isRead())
                        .priority(n.getPriority().name())
                        .createdAt(n.getCreatedAt())
                        .tripId(n.getTrip() != null ? n.getTrip().getId() : null)
                        .childId(n.getChild() != null ? n.getChild().getId() : null)
                        .build())
                .collect(Collectors.toList());
    }
}
