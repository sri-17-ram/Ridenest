package com.saferidekids.service;

import com.saferidekids.dto.response.InstitutionTripDto;
import com.saferidekids.entity.Institution;
import com.saferidekids.entity.Trip;
import com.saferidekids.entity.TripChild;
import com.saferidekids.repository.InstitutionRepository;
import com.saferidekids.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InstitutionService {

    private final InstitutionRepository institutionRepository;
    private final TripRepository tripRepository;

    private Institution getInstitutionByEmail(String email) {
        return institutionRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Institution profile not found"));
    }

    public List<InstitutionTripDto> getTodayTransport(String email) {
        Institution institution = getInstitutionByEmail(email);
        List<Trip> trips = tripRepository.findByInstitutionId(institution.getId()).stream()
                .filter(t -> t.getTripDate().equals(LocalDate.now()))
                .collect(Collectors.toList());
        return mapToDto(trips);
    }

    public List<InstitutionTripDto> getActiveTransport(String email) {
        Institution institution = getInstitutionByEmail(email);
        List<Trip> trips = tripRepository.findByInstitutionId(institution.getId()).stream()
                .filter(t -> t.getStatus() == Trip.TripStatus.IN_PROGRESS)
                .collect(Collectors.toList());
        return mapToDto(trips);
    }

    private List<InstitutionTripDto> mapToDto(List<Trip> trips) {
        return trips.stream().map(t -> {
            int total = t.getTripChildren().size();
            int pickedUp = (int) t.getTripChildren().stream()
                    .filter(tc -> tc.getPickupStatus() == TripChild.PickupStatus.PICKED_UP)
                    .count();
            int dropped = (int) t.getTripChildren().stream()
                    .filter(tc -> tc.getDropStatus() == TripChild.DropStatus.DROPPED)
                    .count();
            
            return InstitutionTripDto.builder()
                    .tripId(t.getId())
                    .routeName(t.getRoute() != null ? t.getRoute().getName() : "Direct Route")
                    .driverName(t.getDriver().getUser().getFirstName() + " " + t.getDriver().getUser().getLastName())
                    .vehicleNumber(t.getVehicle().getRegistrationNumber())
                    .totalStudents(total)
                    .pickedUp(pickedUp)
                    .dropped(dropped)
                    .tripStatus(t.getStatus().name())
                    .startTime(t.getActualStartTime() != null ? t.getActualStartTime() : t.getScheduledStartTime())
                    .eta("TBD")
                    .remainingStops(total - dropped)
                    .gpsStatus("ACTIVE")
                    .build();
        }).collect(Collectors.toList());
    }
}
