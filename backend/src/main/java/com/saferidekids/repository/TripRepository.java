package com.saferidekids.repository;

import com.saferidekids.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByDriverIdOrderByTripDateDesc(Long driverId);
    List<Trip> findByDriverIdAndTripDate(Long driverId, LocalDate date);
    List<Trip> findByDriverIdAndStatus(Long driverId, Trip.TripStatus status);
    List<Trip> findByStatus(Trip.TripStatus status);
    long countByStatus(Trip.TripStatus status);
    List<Trip> findByInstitutionId(Long institutionId);

    @Query("SELECT t FROM Trip t WHERE t.status = 'IN_PROGRESS'")
    List<Trip> findAllActiveTrips();

    @Query("SELECT t FROM Trip t JOIN t.tripChildren tc WHERE tc.child.parent.id = :parentId ORDER BY t.tripDate DESC")
    List<Trip> findTripsByParentId(@Param("parentId") Long parentId);

    @Query("SELECT t FROM Trip t JOIN t.tripChildren tc WHERE tc.child.parent.id = :parentId AND t.status = 'IN_PROGRESS' ORDER BY t.tripDate DESC")
    List<Trip> findActiveTripsByParentId(@Param("parentId") Long parentId);

    @Query("SELECT COUNT(t) FROM Trip t WHERE t.tripDate = :date")
    long countTripsByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Trip t WHERE t.status = 'COMPLETED'")
    long countCompletedTrips();

    long countByEmergencyTrue();
}
