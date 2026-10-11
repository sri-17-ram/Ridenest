package com.saferidekids.repository;

import com.saferidekids.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {
    List<EmergencyContact> findByParentId(Long parentId);
    List<EmergencyContact> findByParentIdAndPrimaryTrue(Long parentId);
}
