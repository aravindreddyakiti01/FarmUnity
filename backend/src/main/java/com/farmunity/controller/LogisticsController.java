package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.PickupVerificationRequest;
import com.farmunity.dto.response.RouteResponse;
import com.farmunity.entity.BatchMembership;
import com.farmunity.service.LogisticsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logistics")
@RequiredArgsConstructor
public class LogisticsController {

    private final LogisticsService logisticsService;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/route/{batchId}")
    public ResponseEntity<RouteResponse> getPickupRoute(@PathVariable Long batchId) {
        return ResponseEntity.ok(logisticsService.computePickupRoute(batchId));
    }

    @PostMapping("/pickup-verify/{membershipId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<BatchMembership> verifyPickupStop(
            @PathVariable Long membershipId,
            @Valid @RequestBody PickupVerificationRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(logisticsService.verifyPickupStop(membershipId, req, coordinatorId));
    }
}
