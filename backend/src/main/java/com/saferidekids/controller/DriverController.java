package com.saferidekids.controller;

import com.saferidekids.dto.request.QrScanRequest;
import com.saferidekids.dto.response.ApiResponse;
import com.saferidekids.dto.response.QrScanResponse;
import com.saferidekids.dto.response.TripDto;
import com.saferidekids.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/driver")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @GetMapping("/trips/today")
    public ResponseEntity<ApiResponse<List<TripDto>>> getTodayTrips(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getTodayTrips(userDetails.getUsername())));
    }

    @PostMapping("/trips/{id}/start")
    public ResponseEntity<ApiResponse<TripDto>> startTrip(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Trip started successfully", driverService.startTrip(userDetails.getUsername(), id)));
    }

    @PostMapping("/qr/scan")
    public ResponseEntity<ApiResponse<QrScanResponse>> scanQr(
            @Valid @RequestBody QrScanRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Child verified successfully", driverService.scanQr(userDetails.getUsername(), request)));
    }

    @PostMapping("/trips/{tripId}/drop/{childId}")
    public ResponseEntity<ApiResponse<QrScanResponse>> dropChild(
            @PathVariable Long tripId,
            @PathVariable Long childId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Child dropped off successfully", driverService.dropChild(userDetails.getUsername(), tripId, childId)));
    }

    @PostMapping("/trips/{id}/end")
    public ResponseEntity<ApiResponse<TripDto>> endTrip(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Trip completed successfully", driverService.endTrip(userDetails.getUsername(), id)));
    }
}
