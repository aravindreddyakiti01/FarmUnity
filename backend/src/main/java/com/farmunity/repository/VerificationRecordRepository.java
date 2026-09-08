package com.farmunity.repository;

import com.farmunity.entity.VerificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationRecordRepository extends JpaRepository<VerificationRecord, Long> {
    Optional<VerificationRecord> findByProduceListingId(Long produceListingId);
}
