package com.farmunity.repository;

import com.farmunity.entity.Processor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcessorRepository extends JpaRepository<Processor, Long> {
    List<Processor> findByIsActiveTrue();
}
