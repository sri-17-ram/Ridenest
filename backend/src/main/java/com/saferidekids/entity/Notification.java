package com.saferidekids.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id")
    private Child child;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read")
    @Builder.Default
    private boolean read = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Priority priority = Priority.NORMAL;

    private String fcmMessageId;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime readAt;

    public enum NotificationType {
        DRIVER_ASSIGNED,
        TRIP_STARTED,
        CHILD_PICKED_UP,
        CHILD_DROPPED,
        ROUTE_DEVIATION,
        MISSING_CHILD,
        EMERGENCY,
        TRIP_COMPLETED,
        DRIVER_VERIFIED,
        INSTITUTION_APPROVED,
        COMPLAINT_RESOLVED,
        GENERAL
    }

    public enum Priority {
        LOW, NORMAL, HIGH, CRITICAL
    }
}
