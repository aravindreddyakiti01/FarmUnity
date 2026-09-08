package com.farmunity.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class AuditEvent extends ApplicationEvent {

    private final String entityType;
    private final Long entityId;
    private final String eventType;
    private final Long actorId;
    private final String actorRole;
    private final String details;
    private final String previousState;
    private final String newState;

    public AuditEvent(Object source,
                      String entityType,
                      Long entityId,
                      String eventType,
                      Long actorId,
                      String actorRole,
                      String details,
                      String previousState,
                      String newState) {
        super(source);
        this.entityType = entityType;
        this.entityId = entityId;
        this.eventType = eventType;
        this.actorId = actorId;
        this.actorRole = actorRole;
        this.details = details;
        this.previousState = previousState;
        this.newState = newState;
    }
}
