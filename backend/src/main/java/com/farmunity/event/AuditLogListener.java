package com.farmunity.event;

import com.farmunity.entity.AuditLog;
import com.farmunity.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogListener {

    private final AuditLogRepository auditLogRepository;

    @EventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleAuditEvent(AuditEvent event) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .entityType(event.getEntityType())
                    .entityId(event.getEntityId())
                    .eventType(event.getEventType())
                    .actorId(event.getActorId())
                    .actorRole(event.getActorRole())
                    .timestamp(LocalDateTime.now())
                    .details(event.getDetails())
                    .previousState(event.getPreviousState())
                    .newState(event.getNewState())
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit log recorded: {} on {} (ID: {}) by {} ({})",
                    event.getEventType(), event.getEntityType(), event.getEntityId(),
                    event.getActorRole(), event.getActorId());
        } catch (Exception e) {
            log.error("Failed to save audit log for event: {}", event.getEventType(), e);
        }
    }
}
