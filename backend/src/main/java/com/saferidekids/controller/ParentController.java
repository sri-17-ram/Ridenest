package com.saferidekids.controller;

import com.saferidekids.dto.request.ChildRequest;
import com.saferidekids.dto.response.ApiResponse;
import com.saferidekids.dto.response.ChildResponse;
import com.saferidekids.dto.response.LocationResponse;
import com.saferidekids.dto.response.NotificationResponse;
import com.saferidekids.dto.request.LocationRequest;
import com.saferidekids.dto.response.TripDto;
import com.saferidekids.service.ParentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parent")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    @GetMapping("/children")
    public ResponseEntity<ApiResponse<List<ChildResponse>>> getChildren(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(parentService.getChildren(userDetails.getUsername())));
    }

    @PostMapping("/children")
    public ResponseEntity<ApiResponse<ChildResponse>> addChild(
            @Valid @RequestBody ChildRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Child added successfully", parentService.addChild(userDetails.getUsername(), request)));
    }

    @PostMapping("/children/{id}/generate-qr")
    public ResponseEntity<ApiResponse<ChildResponse>> generateQr(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("QR Code generated successfully", parentService.generateQr(userDetails.getUsername(), id)));
    }

    @GetMapping("/trips/active")
    public ResponseEntity<ApiResponse<TripDto>> getActiveTrip(@AuthenticationPrincipal UserDetails userDetails) {
        TripDto trip = parentService.getActiveTrip(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<List<TripDto>>> getTripHistory(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(parentService.getTripHistory(userDetails.getUsername())));
    }

    @GetMapping("/trips/{id}")
    public ResponseEntity<ApiResponse<TripDto>> getTripDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(parentService.getTripDetails(userDetails.getUsername(), id)));
    }

    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getLocations(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(parentService.getLocations(userDetails.getUsername())));
    }

    @PostMapping("/locations")
    public ResponseEntity<ApiResponse<LocationResponse>> addLocation(
            @Valid @RequestBody LocationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Location added successfully", parentService.addLocation(userDetails.getUsername(), request)));
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<ApiResponse<LocationResponse>> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Location updated successfully", parentService.updateLocation(userDetails.getUsername(), id, request)));
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        parentService.deleteLocation(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Location deleted successfully", null));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(parentService.getNotifications(userDetails.getUsername())));
    }
}
