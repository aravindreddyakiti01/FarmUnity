package com.farmunity.controller;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.VerificationRequest;
import com.farmunity.dto.response.VerificationResponse;
import com.farmunity.service.VerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/verify/{listingId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<VerificationResponse> verifyListing(
            @PathVariable Long listingId,
            @Valid @RequestBody VerificationRequest req,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long coordinatorId = tokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(verificationService.verifyListing(listingId, req, coordinatorId));
    }

    @GetMapping("/{listingId}")
    public ResponseEntity<VerificationResponse> getVerificationRecord(@PathVariable Long listingId) {
        return ResponseEntity.ok(verificationService.getVerificationForListing(listingId));
    }
}
