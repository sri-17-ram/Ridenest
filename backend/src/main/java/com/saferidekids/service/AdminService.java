package com.saferidekids.service;

import com.saferidekids.dto.response.AdminDashboardStats;
import com.saferidekids.entity.*;
import com.saferidekids.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final InstitutionRepository institutionRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final ComplaintRepository complaintRepository;
    private final ChildRepository childRepository;
    private final NotificationService notificationService;

    public AdminDashboardStats getDashboardStats() {
        return AdminDashboardStats.builder()
                .totalParents(userRepository.countByRole(User.Role.PARENT))
                .totalDrivers(userRepository.countByRole(User.Role.DRIVER))
                .totalInstitutions(userRepository.countByRole(User.Role.INSTITUTION))
                .totalChildren(childRepository.count())
                .totalTrips(tripRepository.count())
                .activeTrips((int) tripRepository.countByStatus(Trip.TripStatus.IN_PROGRESS))
                .completedTrips(tripRepository.countCompletedTrips())
                .pendingDriverVerifications(driverRepository.countByOverallStatus(Driver.VerificationStatus.PENDING))
                .pendingInstitutionApprovals(institutionRepository.countByApprovalStatus(Institution.ApprovalStatus.PENDING))
                .openComplaints(complaintRepository.countByStatus(Complaint.ComplaintStatus.OPEN))
                .emergencyAlerts(tripRepository.countByEmergencyTrue())
                .pendingVehicleVerifications(vehicleRepository.countByOverallStatus(Vehicle.VerificationStatus.PENDING))
                .build();
    }

    @Transactional
    public Driver verifyDriver(Long driverId, String status, String verifiedByEmail) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        Driver.VerificationStatus newStatus = Driver.VerificationStatus.valueOf(status);
        driver.setOverallStatus(newStatus);
        driver.setLicenseStatus(newStatus);
        driver.setAadhaarStatus(newStatus);
        driver.setProfileVerifiedBy(verifiedByEmail);
        driver.setVerifiedAt(java.time.LocalDateTime.now());

        if (newStatus == Driver.VerificationStatus.APPROVED) {
            driver.getUser().setVerified(true);
        }

        driver = driverRepository.save(driver);

        // Notify driver
        notificationService.sendNotification(
                driver.getUser(), null, null,
                Notification.NotificationType.DRIVER_VERIFIED,
                newStatus == Driver.VerificationStatus.APPROVED ? "✅ Account Verified" : "❌ Verification Rejected",
                newStatus == Driver.VerificationStatus.APPROVED
                        ? "Congratulations! Your driver account has been verified. You can now accept trips."
                        : "Your verification was not approved. Please contact support.",
                Notification.Priority.HIGH
        );

        return driver;
    }

    @Transactional
    public Vehicle verifyVehicle(Long vehicleId, String status) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        vehicle.setOverallStatus(Vehicle.VerificationStatus.valueOf(status));
        vehicle.setRcStatus(Vehicle.VerificationStatus.valueOf(status));
        vehicle.setInsuranceStatus(Vehicle.VerificationStatus.valueOf(status));
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Institution approveInstitution(Long institutionId, String status, String approvedByEmail) {
        Institution institution = institutionRepository.findById(institutionId)
                .orElseThrow(() -> new IllegalArgumentException("Institution not found"));

        Institution.ApprovalStatus newStatus = Institution.ApprovalStatus.valueOf(status);
        institution.setApprovalStatus(newStatus);
        institution.setApprovedBy(approvedByEmail);
        institution.setApprovedAt(java.time.LocalDateTime.now());

        institution = institutionRepository.save(institution);

        notificationService.sendNotification(
                institution.getUser(), null, null,
                Notification.NotificationType.INSTITUTION_APPROVED,
                newStatus == Institution.ApprovalStatus.APPROVED ? "✅ Institution Approved" : "❌ Application Rejected",
                newStatus == Institution.ApprovalStatus.APPROVED
                        ? "Your institution has been approved on RideNest."
                        : "Your institution application was not approved.",
                Notification.Priority.HIGH
        );

        return institution;
    }

    public List<Driver> getPendingDrivers() {
        return driverRepository.findByOverallStatus(Driver.VerificationStatus.PENDING);
    }

    public List<Institution> getPendingInstitutions() {
        return institutionRepository.findByApprovalStatus(Institution.ApprovalStatus.PENDING);
    }

    public List<Trip> getActiveTrips() {
        return tripRepository.findAllActiveTrips();
    }

    public List<Complaint> getOpenComplaints() {
        return complaintRepository.findByStatusOrderByCreatedAtDesc(Complaint.ComplaintStatus.OPEN);
    }

    @Transactional
    public Complaint resolveComplaint(Long complaintId, String response, String resolvedBy) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        complaint.setStatus(Complaint.ComplaintStatus.RESOLVED);
        complaint.setAdminResponse(response);
        complaint.setResolvedBy(resolvedBy);
        complaint.setResolvedAt(java.time.LocalDateTime.now());

        notificationService.sendNotification(
                complaint.getSubmittedBy(), null, null,
                Notification.NotificationType.COMPLAINT_RESOLVED,
                "✅ Complaint Resolved",
                "Your complaint has been resolved: " + response,
                Notification.Priority.NORMAL
        );

        return complaintRepository.save(complaint);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
}
