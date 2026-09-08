package com.farmunity.entity.enums;

import java.util.Map;
import java.util.Set;

public enum TrustTier {
    NEW, VERIFIED, ESTABLISHED, TRUSTED, UNDER_REVIEW, SUSPENDED;

    private static final Map<TrustTier, Set<TrustTier>> ALLOWED = Map.of(
        NEW,         Set.of(VERIFIED, UNDER_REVIEW),
        VERIFIED,    Set.of(ESTABLISHED, UNDER_REVIEW),
        ESTABLISHED, Set.of(TRUSTED, UNDER_REVIEW)
    );

    public boolean canTransitionTo(TrustTier target) {
        return ALLOWED.getOrDefault(this, Set.of()).contains(target);
    }
}
