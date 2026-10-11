package com.saferidekids.controller;

import com.saferidekids.dto.response.*;
import com.saferidekids.entity.*;
import com.saferidekids.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/drivers/pending")
    public ResponseEntity<ApiResponse<List<Driver>>> getPendingDrivers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPendingDrivers()));
    }

    @PutMapping("/drivers/{id}/verify")
    public ResponseEntity<ApiResponse<Driver>> verifyDriver(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        Driver driver = adminService.verifyDriver(id, body.get("status"), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Driver verification updated", driver));
    }

    @PutMapping("/vehicles/{id}/verify")
    public ResponseEntity<ApiResponse<Vehicle>> verifyVehicle(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Vehicle vehicle = adminService.verifyVehicle(id, body.get("status"));
        return ResponseEntity.ok(ApiResponse.success("Vehicle verification updated", vehicle));
    }

    @GetMapping("/institutions/pending")
    public ResponseEntity<ApiResponse<List<Institution>>> getPendingInstitutions() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPendingInstitutions()));
    }

    @PutMapping("/institutions/{id}/approve")
    public ResponseEntity<ApiResponse<Institution>> approveInstitution(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        Institution institution = adminService.approveInstitution(id, body.get("status"), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Institution status updated", institution));
    }

    @GetMapping("/trips/active")
    public ResponseEntity<ApiResponse<List<Trip>>> getActiveTrips() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getActiveTrips()));
    }

    @GetMapping("/complaints/open")
    public ResponseEntity<ApiResponse<List<Complaint>>> getOpenComplaints() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getOpenComplaints()));
    }

    @PutMapping("/complaints/{id}/resolve")
    public ResponseEntity<ApiResponse<Complaint>> resolveComplaint(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        Complaint complaint = adminService.resolveComplaint(id, body.get("response"), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Complaint resolved", complaint));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<List<Trip>>> getAllTrips() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllTrips()));
    }
}
