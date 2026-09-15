package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.response.BatchFormationResponse;
import com.farmunity.service.CooperativeFormationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<BatchFormationResponse>> getAllBatches() {
        return ResponseEntity.ok(cooperativeFormationService.getAllBatches());
    }

    @GetMapping("/my")
    public ResponseEntity<List<BatchFormationResponse>> getMyBatches(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = tokenProvider.getUserIdFromToken(token);
        String role = tokenProvider.getRoleFromToken(token);

        if ("ROLE_BUYER".equals(role) || "BUYER".equals(role)) {
            return ResponseEntity.ok(cooperativeFormationService.getBatchesForBuyer(userId));
        } else if ("ROLE_FARMER".equals(role) || "FARMER".equals(role)) {
            return ResponseEntity.ok(cooperativeFormationService.getBatchesForFarmer(userId));
        } else {
            return ResponseEntity.ok(cooperativeFormationService.getAllBatches());
        }
    }

    @GetMapping("/{batchId}")
    public ResponseEntity<BatchFormationResponse> getBatchById(@PathVariable Long batchId) {
        return ResponseEntity.ok(cooperativeFormationService.getBatchById(batchId));
    }
}
