package com.saferidekids.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trusted_pickup_persons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrustedPickupPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phoneNumber;

    private String relation;
    private String photoPath;

    @Column(name = "aadhaar_number")
    private String aadhaarNumber;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "otp_expires_at")
    private LocalDateTime otpExpiresAt;

    @Column(name = "qr_code_path")
    private String qrCodePath;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
