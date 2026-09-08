package com.farmunity.repository;

import com.farmunity.entity.CooperativeBatch;
import com.farmunity.entity.enums.BatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CooperativeBatchRepository extends JpaRepository<CooperativeBatch, Long> {
    List<CooperativeBatch> findByBuyerRequirementId(Long buyerRequirementId);
    List<CooperativeBatch> findByStatus(BatchStatus status);
    Optional<CooperativeBatch> findFirstByBuyerRequirementIdOrderByCreatedAtDesc(Long buyerRequirementId);
}
