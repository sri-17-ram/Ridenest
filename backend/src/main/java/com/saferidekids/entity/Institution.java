package com.saferidekids.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "institutions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstitutionType type;

    private String registrationNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    private String contactPersonName;
    private String contactPersonPhone;
    private String website;
    private String logoPath;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    private String approvedBy;
    private LocalDateTime approvedAt;

    @OneToMany(mappedBy = "institution", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Child> students;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum InstitutionType {
        SCHOOL, TUITION_CENTER, COACHING_CENTER, DAYCARE, SPORTS_ACADEMY, MUSIC_CLASS, DANCE_CLASS
    }

    public enum ApprovalStatus {
        PENDING, APPROVED, REJECTED, SUSPENDED
    }
}
