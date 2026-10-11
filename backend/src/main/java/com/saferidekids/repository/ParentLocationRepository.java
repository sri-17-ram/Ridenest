package com.saferidekids.repository;

import com.saferidekids.entity.ParentLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParentLocationRepository extends JpaRepository<ParentLocation, Long> {
    List<ParentLocation> findByParentId(Long parentId);
    List<ParentLocation> findByParentIdAndType(Long parentId, ParentLocation.LocationType type);
    boolean existsByParentIdAndLatitudeAndLongitude(Long parentId, Double latitude, Double longitude);
}
