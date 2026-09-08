package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.CreateWorkOrderRequest;
import com.farmunity.dto.request.MillingCompletionRequest;
import com.farmunity.dto.response.JobWorkOrderResponse;
import com.farmunity.entity.Processor;
import com.farmunity.service.MillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milling")
@RequiredArgsConstructor
public class MillingController {

    private final MillingService millingService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/work-orders")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<JobWorkOrderResponse> createWorkOrder(
            @Valid @RequestBody CreateWorkOrderRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(millingService.createWorkOrder(req, coordinatorId));
    }

    @PutMapping("/work-orders/{id}/complete")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<JobWorkOrderResponse> completeWorkOrder(
            @PathVariable Long id,
            @Valid @RequestBody MillingCompletionRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(millingService.completeWorkOrder(id, req, coordinatorId));
    }

    @GetMapping("/work-orders/{id}")
    public ResponseEntity<JobWorkOrderResponse> getWorkOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(millingService.getWorkOrderById(id));
    }

    @GetMapping("/agreement/{agreementId}")
    public ResponseEntity<List<JobWorkOrderResponse>> getWorkOrdersByAgreement(@PathVariable Long agreementId) {
        return ResponseEntity.ok(millingService.getWorkOrdersByAgreement(agreementId));
    }

    @GetMapping("/processors")
    public ResponseEntity<List<Processor>> getAllProcessors() {
        return ResponseEntity.ok(millingService.getAllProcessors());
    }
}
