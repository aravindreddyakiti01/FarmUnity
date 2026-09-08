package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.response.BatchFormationResponse;
import com.farmunity.service.CooperativeFormationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class CooperativeBatchController {

    private final CooperativeFormationService cooperativeFormationService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/form/{buyerRequirementId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<BatchFormationResponse> formBatch(
            @PathVariable Long buyerRequirementId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(cooperativeFormationService.formAndPersistBatch(buyerRequirementId, coordinatorId));
    }

    @GetMapping("/{batchId}")
    public ResponseEntity<BatchFormationResponse> getBatchById(@PathVariable Long batchId) {
        return ResponseEntity.ok(cooperativeFormationService.getBatchById(batchId));
    }
}
