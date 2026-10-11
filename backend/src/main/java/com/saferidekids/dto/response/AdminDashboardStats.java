package com.saferidekids.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    private long totalParents;
    private long totalDrivers;
    private long totalInstitutions;
    private long totalChildren;
    private long totalTrips;
    private long activeTrips;
    private long completedTrips;
    private long pendingDriverVerifications;
    private long pendingInstitutionApprovals;
    private long openComplaints;
    private long emergencyAlerts;
    private long pendingVehicleVerifications;
}
