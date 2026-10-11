package com.saferidekids.repository;

import com.saferidekids.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    Optional<Institution> findByUserId(Long userId);
    Optional<Institution> findByUserEmail(String email);
    List<Institution> findByApprovalStatus(Institution.ApprovalStatus status);
    List<Institution> findByType(Institution.InstitutionType type);
    long countByApprovalStatus(Institution.ApprovalStatus status);
}
