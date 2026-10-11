package com.saferidekids.service;

import com.saferidekids.dto.request.*;
import com.saferidekids.dto.response.AuthResponse;
import com.saferidekids.entity.*;
import com.saferidekids.repository.*;
import com.saferidekids.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final DriverRepository driverRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        // Create role-specific profile
        switch (request.getRole()) {
            case PARENT -> {
                Parent parent = Parent.builder()
                        .user(user)
                        .address(request.getAddress())
                        .city(request.getCity())
                        .state(request.getState())
                        .pincode(request.getPincode())
                        .build();
                parentRepository.save(parent);
            }
            case DRIVER -> {
                Driver driver = Driver.builder()
                        .user(user)
                        .address(request.getAddress())
                        .city(request.getCity())
                        .build();
                driverRepository.save(driver);
            }
            case INSTITUTION -> {
                Institution institution = Institution.builder()
                        .user(user)
                        .name(request.getInstitutionName() != null ? request.getInstitutionName() : request.getFirstName())
                        .type(Institution.InstitutionType.valueOf(
                                request.getInstitutionType() != null ? request.getInstitutionType() : "SCHOOL"))
                        .registrationNumber(request.getRegistrationNumber())
                        .address(request.getAddress())
                        .city(request.getCity())
                        .state(request.getState())
                        .pincode(request.getPincode())
                        .build();
                institutionRepository.save(institution);
            }
            default -> {} // Admin created manually
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .name(user.getFirstName() + " " + user.getLastName())
                .role(user.getRole())
                .verified(user.isVerified())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .name(user.getFirstName() + " " + user.getLastName())
                .role(user.getRole())
                .verified(user.isVerified())
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            if (jwtService.isTokenValid(refreshToken, user)) {
                String accessToken = jwtService.generateToken(user);
                
                return AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .userId(user.getId())
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .name(user.getFirstName() + " " + user.getLastName())
                        .role(user.getRole())
                        .verified(user.isVerified())
                        .build();
            }
        }
        throw new IllegalArgumentException("Invalid refresh token");
    }
}
