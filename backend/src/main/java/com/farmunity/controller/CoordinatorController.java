package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.TrustTierTransitionRequest;
import com.farmunity.service.TrustTierTransitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coordinator")
@RequiredArgsConstructor
public class CoordinatorController {

    private final TrustTierTransitionService trustTierTransitionService;
    private final JwtTokenProvider tokenProvider;

    @PutMapping("/trust-tier")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<String> transitionTrustTier(
            @Valid @RequestBody TrustTierTransitionRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        trustTierTransitionService.transitionTrustTier(req, coordinatorId);
        return ResponseEntity.ok("Trust tier successfully updated to " + req.getTargetTier());
    }
}
