package com.saferidekids.controller;

import com.saferidekids.dto.request.GpsUpdateRequest;
import com.saferidekids.dto.response.ApiResponse;
import com.saferidekids.entity.*;
import com.saferidekids.repository.DriverRepository;
import com.saferidekids.service.GpsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/gps")
@RequiredArgsConstructor
public class GpsController {

    private final GpsService gpsService;
    private final DriverRepository driverRepository;

    @PostMapping("/update")
    public ResponseEntity<ApiResponse<String>> updateLocation(
            @Valid @RequestBody GpsUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Driver driver = driverRepository.findByUserEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        gpsService.processGpsUpdate(
                request.getTripId(), driver.getId(),
                request.getLatitude(), request.getLongitude(),
                request.getSpeed(), request.getAccuracy(), request.getHeading(),
                request.getGForce(), request.getSuddenStop()
        );
        return ResponseEntity.ok(ApiResponse.success("Location updated", null));
    }

    @GetMapping("/trip/{tripId}/current")
    public ResponseEntity<ApiResponse<GpsLog>> getCurrentLocation(@PathVariable Long tripId) {
        GpsLog latest = gpsService.getLatestLocation(tripId);
        return ResponseEntity.ok(ApiResponse.success(latest));
    }

    @GetMapping("/trip/{tripId}/path")
    public ResponseEntity<ApiResponse<List<GpsLog>>> getTripPath(@PathVariable Long tripId) {
        return ResponseEntity.ok(ApiResponse.success(gpsService.getTripPath(tripId)));
    }
}
