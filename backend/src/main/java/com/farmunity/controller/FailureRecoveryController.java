package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.ExecuteRecoveryRequest;
import com.farmunity.dto.response.FailureRecoveryResponse;
import com.farmunity.service.FailureRecoveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recovery")
@RequiredArgsConstructor
public class FailureRecoveryController {

    private final FailureRecoveryService failureRecoveryService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/detect/{batchId}/{membershipId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<FailureRecoveryResponse> detectCancellation(
            @PathVariable Long batchId,
            @PathVariable Long membershipId,
            @RequestParam(required = false, defaultValue = "Farmer unavailable for collection") String reason,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(failureRecoveryService.detectFarmerCancellation(batchId, membershipId, reason, coordinatorId));
    }

    @PostMapping("/execute/{batchId}/{membershipId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<FailureRecoveryResponse> executeRecovery(
            @PathVariable Long batchId,
            @PathVariable Long membershipId,
            @Valid @RequestBody ExecuteRecoveryRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(failureRecoveryService.executeRecovery(batchId, membershipId, req, coordinatorId));
    }
}
