package com.saferidekids.repository;

import com.saferidekids.entity.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {
    List<Child> findByParentId(Long parentId);
    List<Child> findByInstitutionId(Long institutionId);
    Optional<Child> findByQrCodeToken(String qrCodeToken);
    List<Child> findByParentIdAndActiveTrue(Long parentId);
    long countByInstitutionId(Long institutionId);
}
