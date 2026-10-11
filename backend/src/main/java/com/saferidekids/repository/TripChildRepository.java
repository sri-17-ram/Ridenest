package com.saferidekids.repository;

import com.saferidekids.entity.TripChild;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripChildRepository extends JpaRepository<TripChild, Long> {
    List<TripChild> findByTripId(Long tripId);
    Optional<TripChild> findByTripIdAndChildId(Long tripId, Long childId);

    @Query("SELECT tc FROM TripChild tc WHERE tc.trip.id = :tripId AND tc.pickupStatus = 'EXPECTED'")
    List<TripChild> findExpectedChildrenForTrip(@Param("tripId") Long tripId);

    @Query("SELECT tc FROM TripChild tc WHERE tc.trip.id = :tripId AND tc.pickupStatus = 'PICKED_UP'")
    List<TripChild> findBoardedChildrenForTrip(@Param("tripId") Long tripId);
}
