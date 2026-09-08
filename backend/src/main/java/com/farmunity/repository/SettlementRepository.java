package com.farmunity.repository;

import com.farmunity.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    List<Settlement> findByAgreementId(Long agreementId);
    List<Settlement> findByFarmerId(Long farmerId);
}
