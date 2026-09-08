package com.farmunity.repository;

import com.farmunity.entity.JobWorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobWorkOrderRepository extends JpaRepository<JobWorkOrder, Long> {
    List<JobWorkOrder> findByAgreementId(Long agreementId);
    Optional<JobWorkOrder> findFirstByAgreementIdOrderByCreatedAtDesc(Long agreementId);
    List<JobWorkOrder> findByProcessorId(Long processorId);
}
