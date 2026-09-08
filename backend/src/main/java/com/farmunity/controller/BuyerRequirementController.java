package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.BuyerRequirementRequest;
import com.farmunity.dto.response.BuyerRequirementResponse;
import com.farmunity.service.BuyerRequirementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@RequiredArgsConstructor
public class BuyerRequirementController {

    private final BuyerRequirementService buyerRequirementService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<BuyerRequirementResponse> createRequirement(
            @Valid @RequestBody BuyerRequirementRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long buyerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(buyerRequirementService.createRequirement(req, buyerId));
    }

    @GetMapping
    public ResponseEntity<List<BuyerRequirementResponse>> getActiveRequirements() {
        return ResponseEntity.ok(buyerRequirementService.getActiveRequirements());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<List<BuyerRequirementResponse>> getMyRequirements(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long buyerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(buyerRequirementService.getRequirementsForBuyer(buyerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuyerRequirementResponse> getRequirementById(@PathVariable Long id) {
        return ResponseEntity.ok(buyerRequirementService.getRequirementById(id));
    }
}
