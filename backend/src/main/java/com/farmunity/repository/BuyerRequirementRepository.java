package com.farmunity.repository;

import com.farmunity.entity.BuyerRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BuyerRequirementRepository extends JpaRepository<BuyerRequirement, Long> {
    List<BuyerRequirement> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    List<BuyerRequirement> findByIsActiveTrueOrderByCreatedAtDesc();
    long countByBuyerIdAndCreatedAtAfter(Long buyerId, LocalDateTime after);
}
