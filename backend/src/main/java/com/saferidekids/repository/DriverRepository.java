package com.saferidekids.repository;

import com.saferidekids.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUserId(Long userId);
    Optional<Driver> findByUserEmail(String email);
    List<Driver> findByOverallStatus(Driver.VerificationStatus status);
    List<Driver> findByAvailableTrue();

    @Query("SELECT d FROM Driver d WHERE d.overallStatus = 'APPROVED' AND d.available = true")
    List<Driver> findAvailableApprovedDrivers();

    long countByOverallStatus(Driver.VerificationStatus status);
}
