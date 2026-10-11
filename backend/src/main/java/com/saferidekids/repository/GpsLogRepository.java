package com.saferidekids.repository;

import com.saferidekids.entity.GpsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GpsLogRepository extends JpaRepository<GpsLog, Long> {
    List<GpsLog> findByTripIdOrderByTimestampAsc(Long tripId);

    @Query("SELECT g FROM GpsLog g WHERE g.trip.id = :tripId ORDER BY g.timestamp DESC LIMIT 1")
    Optional<GpsLog> findLatestByTripId(@Param("tripId") Long tripId);

    List<GpsLog> findByTripIdAndDeviationTrue(Long tripId);
    long countByTripIdAndDeviationTrue(Long tripId);
}
