package com.farmunity.repository;

import com.farmunity.entity.CropConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CropConfigRepository extends JpaRepository<CropConfig, Long> {
    Optional<CropConfig> findByCropNameIgnoreCase(String cropName);
}
