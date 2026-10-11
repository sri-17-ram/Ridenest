package com.saferidekids.repository;

import com.saferidekids.entity.TrustedPickupPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrustedPickupPersonRepository extends JpaRepository<TrustedPickupPerson, Long> {
    List<TrustedPickupPerson> findByChildIdAndActiveTrue(Long childId);
    Optional<TrustedPickupPerson> findByIdAndChildId(Long id, Long childId);
    Optional<TrustedPickupPerson> findByChildIdAndOtpCode(Long childId, String otpCode);
}
