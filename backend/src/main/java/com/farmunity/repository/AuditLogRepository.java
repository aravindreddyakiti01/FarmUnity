package com.farmunity.repository;

import com.farmunity.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampAsc(String entityType, Long entityId);
    List<AuditLog> findByActorIdOrderByTimestampDesc(Long actorId);
    List<AuditLog> findAllByOrderByTimestampDesc();
}
