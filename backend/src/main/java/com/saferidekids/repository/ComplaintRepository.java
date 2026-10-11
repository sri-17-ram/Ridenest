package com.saferidekids.repository;

import com.saferidekids.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findBySubmittedByIdOrderByCreatedAtDesc(Long userId);
    List<Complaint> findByStatusOrderByCreatedAtDesc(Complaint.ComplaintStatus status);
    List<Complaint> findByDriverIdOrderByCreatedAtDesc(Long driverId);
    long countByStatus(Complaint.ComplaintStatus status);
}
