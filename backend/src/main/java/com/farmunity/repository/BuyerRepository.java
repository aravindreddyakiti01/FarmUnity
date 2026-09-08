package com.farmunity.repository;

import com.farmunity.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findByPhone(String phone);
    Optional<Buyer> findByEmail(String email);
    boolean existsByPhone(String phone);
}
