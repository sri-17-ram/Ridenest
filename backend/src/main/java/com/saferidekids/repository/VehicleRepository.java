package com.saferidekids.repository;

import com.saferidekids.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByDriverId(Long driverId);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByOverallStatus(Vehicle.VerificationStatus status);
    List<Vehicle> findByDriverIdAndOverallStatus(Long driverId, Vehicle.VerificationStatus status);
    long countByOverallStatus(Vehicle.VerificationStatus status);
}
