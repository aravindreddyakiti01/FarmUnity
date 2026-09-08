package com.farmunity.repository;

import com.farmunity.entity.ProduceListing;
import com.farmunity.entity.enums.ProduceListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProduceListingRepository extends JpaRepository<ProduceListing, Long> {
    List<ProduceListing> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<ProduceListing> findByStatus(ProduceListingStatus status);
    List<ProduceListing> findByCropIgnoreCaseAndStatus(String crop, ProduceListingStatus status);
    long countByFarmerIdAndCreatedAtAfter(Long farmerId, LocalDateTime after);
}
