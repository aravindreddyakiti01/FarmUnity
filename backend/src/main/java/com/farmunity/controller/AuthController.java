package com.farmunity.controller;

import com.farmunity.dto.request.LoginRequest;
import com.farmunity.dto.request.RegisterBuyerRequest;
import com.farmunity.dto.request.RegisterFarmerRequest;
import com.farmunity.dto.response.AuthResponse;
import com.farmunity.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/farmer")
    public ResponseEntity<AuthResponse> registerFarmer(@Valid @RequestBody RegisterFarmerRequest req) {
        return ResponseEntity.ok(authService.registerFarmer(req));
    }

    @PostMapping("/register/buyer")
    public ResponseEntity<AuthResponse> registerBuyer(@Valid @RequestBody RegisterBuyerRequest req) {
        return ResponseEntity.ok(authService.registerBuyer(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
