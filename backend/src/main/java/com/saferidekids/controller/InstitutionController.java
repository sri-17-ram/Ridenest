package com.saferidekids.controller;

import com.saferidekids.dto.response.ApiResponse;
import com.saferidekids.dto.response.InstitutionTripDto;
import com.saferidekids.service.InstitutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/institution")
@RequiredArgsConstructor
public class InstitutionController {

    private final InstitutionService institutionService;

    @GetMapping("/transport/today")
    public ResponseEntity<ApiResponse<List<InstitutionTripDto>>> getTodayTransport(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Fetched today's transport", institutionService.getTodayTransport(userDetails.getUsername())));
    }

    @GetMapping("/transport/active")
    public ResponseEntity<ApiResponse<List<InstitutionTripDto>>> getActiveTransport(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Fetched active transport", institutionService.getActiveTransport(userDetails.getUsername())));
    }
}
