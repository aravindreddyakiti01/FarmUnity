package com.farmunity.repository;

import com.farmunity.entity.Coordinator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoordinatorRepository extends JpaRepository<Coordinator, Long> {
    Optional<Coordinator> findByPhone(String phone);
    Optional<Coordinator> findByEmail(String email);
    boolean existsByPhone(String phone);
}
