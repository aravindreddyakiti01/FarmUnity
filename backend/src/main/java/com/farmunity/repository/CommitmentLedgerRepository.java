package com.farmunity.repository;

import com.farmunity.entity.CommitmentLedger;
import com.farmunity.entity.enums.CommitmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommitmentLedgerRepository extends JpaRepository<CommitmentLedger, Long> {
    Optional<CommitmentLedger> findByAgreementId(Long agreementId);
    List<CommitmentLedger> findByBuyerId(Long buyerId);
    List<CommitmentLedger> findByStatusAndDeadlineBefore(CommitmentStatus status, LocalDateTime deadline);
}
