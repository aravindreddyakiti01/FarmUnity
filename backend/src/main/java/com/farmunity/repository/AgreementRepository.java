package com.farmunity.repository;

import com.farmunity.entity.Agreement;
import com.farmunity.entity.enums.AgreementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgreementRepository extends JpaRepository<Agreement, Long> {
    Optional<Agreement> findByCooperativeBatchId(Long cooperativeBatchId);
    List<Agreement> findByStatus(AgreementStatus status);
}
