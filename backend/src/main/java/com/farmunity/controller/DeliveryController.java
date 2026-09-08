package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.DeliveryConfirmationRequest;
import com.farmunity.dto.response.SettlementResponse;
import com.farmunity.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/confirm/{agreementId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<SettlementResponse> confirmDelivery(
            @PathVariable Long agreementId,
            @Valid @RequestBody DeliveryConfirmationRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long buyerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(deliveryService.confirmDelivery(agreementId, req, buyerId));
    }
}
