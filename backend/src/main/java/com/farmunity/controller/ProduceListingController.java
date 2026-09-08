package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.ProduceListingRequest;
import com.farmunity.dto.response.ProduceListingResponse;
import com.farmunity.service.ProduceListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ProduceListingController {

    private final ProduceListingService produceListingService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ProduceListingResponse> createListing(
            @Valid @RequestBody ProduceListingRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long farmerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(produceListingService.createListing(req, farmerId));
    }

    @PutMapping("/{id}/submit-for-verification")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<ProduceListingResponse> submitForVerification(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long farmerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(produceListingService.submitForVerification(id, farmerId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<List<ProduceListingResponse>> getMyListings(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long farmerId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(produceListingService.getListingsForFarmer(farmerId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<List<ProduceListingResponse>> getPendingListings() {
        return ResponseEntity.ok(produceListingService.getPendingVerificationListings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduceListingResponse> getListingById(@PathVariable Long id) {
        return ResponseEntity.ok(produceListingService.getListingById(id));
    }
}
