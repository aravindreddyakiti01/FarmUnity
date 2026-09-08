package com.farmunity.repository;

import com.farmunity.entity.BatchMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchMembershipRepository extends JpaRepository<BatchMembership, Long> {
    List<BatchMembership> findByCooperativeBatchId(Long cooperativeBatchId);
    List<BatchMembership> findByFarmerId(Long farmerId);
    Optional<BatchMembership> findByCooperativeBatchIdAndFarmerId(Long cooperativeBatchId, Long farmerId);
}
