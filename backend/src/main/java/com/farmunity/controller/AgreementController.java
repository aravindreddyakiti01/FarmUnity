package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.AmendmentRequest;
import com.farmunity.dto.request.CreateAgreementRequest;
import com.farmunity.dto.request.FarmerNegotiationRequest;
import com.farmunity.dto.response.AgreementResponse;
import com.farmunity.service.AgreementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agreements")
@RequiredArgsConstructor
public class AgreementController {

    private final AgreementService agreementService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<AgreementResponse> createAgreement(
            @Valid @RequestBody CreateAgreementRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(agreementService.createAgreement(req, coordinatorId));
    }

    @PutMapping("/{id}/farmer-decision")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<AgreementResponse> submitFarmerDecision(
            @PathVariable Long id,
            @Valid @RequestBody FarmerNegotiationRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long farmerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(agreementService.processFarmerNegotiation(id, farmerId, req));
    }

    @PutMapping("/{id}/propose-amendment")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<AgreementResponse> proposeAmendment(
            @PathVariable Long id,
            @Valid @RequestBody AmendmentRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(agreementService.proposeAmendment(id, req, coordinatorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgreementResponse> getAgreementById(@PathVariable Long id) {
        return ResponseEntity.ok(agreementService.getAgreementById(id));
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<AgreementResponse> getAgreementByBatchId(@PathVariable Long batchId) {
        return ResponseEntity.ok(agreementService.getAgreementByBatchId(batchId));
    }
}
