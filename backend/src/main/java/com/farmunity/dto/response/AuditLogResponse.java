package com.farmunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String entityType;
    private Long entityId;
    private String eventType;
    private Long actorId;
    private String actorRole;
    private LocalDateTime timestamp;
    private String details;
    private String previousState;
    private String newState;
}
