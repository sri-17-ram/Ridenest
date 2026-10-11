package com.saferidekids.repository;

import com.saferidekids.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByInstitutionId(Long institutionId);
    List<Route> findByActiveTrue();
}
