package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.response.CommitmentLedgerResponse;
import com.farmunity.service.CommitmentLedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/commitments")
@RequiredArgsConstructor
public class CommitmentLedgerController {

    private final CommitmentLedgerService commitmentLedgerService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/agreement/{agreementId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<CommitmentLedgerResponse> createCommitment(
            @PathVariable Long agreementId,
            @RequestParam(required = false) BigDecimal amount,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long buyerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(commitmentLedgerService.createCommitment(agreementId, buyerId, amount, LocalDateTime.now().plusDays(3)));
    }

    @PutMapping("/{id}/fund")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<CommitmentLedgerResponse> fundCommitment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long buyerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(commitmentLedgerService.fundCommitment(id, buyerId));
    }

    @PutMapping("/agreement/{agreementId}/pickup-verified")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<CommitmentLedgerResponse> markPickupVerified(
            @PathVariable Long agreementId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(commitmentLedgerService.markPickupVerified(agreementId, coordinatorId));
    }

    @PutMapping("/agreement/{agreementId}/release")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<CommitmentLedgerResponse> releasePayment(
            @PathVariable Long agreementId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(commitmentLedgerService.releasePayment(agreementId, coordinatorId));
    }

    @GetMapping("/agreement/{agreementId}")
    public ResponseEntity<CommitmentLedgerResponse> getLedgerByAgreement(@PathVariable Long agreementId) {
        return ResponseEntity.ok(commitmentLedgerService.getLedgerByAgreementId(agreementId));
    }
}
