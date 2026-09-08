package com.farmunity.controller;

import com.farmunity.dto.response.AuditLogResponse;
import com.farmunity.entity.AuditLog;
import com.farmunity.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsForEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        List<AuditLog> logs = auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampAsc(
                entityType.toUpperCase(), entityId
        );
        return ResponseEntity.ok(logs.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AuditLogResponse>> getAllAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();
        return ResponseEntity.ok(logs.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .eventType(log.getEventType())
                .actorId(log.getActorId())
                .actorRole(log.getActorRole())
                .timestamp(log.getTimestamp())
                .details(log.getDetails())
                .previousState(log.getPreviousState())
                .newState(log.getNewState())
                .build();
    }
}
