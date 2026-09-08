package com.farmunity.service;

import com.farmunity.config.JwtTokenProvider;
import com.farmunity.dto.request.LoginRequest;
import com.farmunity.dto.request.RegisterBuyerRequest;
import com.farmunity.dto.request.RegisterFarmerRequest;
import com.farmunity.dto.response.AuthResponse;
import com.farmunity.entity.Buyer;
import com.farmunity.entity.Coordinator;
import com.farmunity.entity.Farmer;
import com.farmunity.entity.enums.TrustTier;
import com.farmunity.entity.enums.UserRole;
import com.farmunity.event.AuditEvent;
import com.farmunity.repository.BuyerRepository;
import com.farmunity.repository.CoordinatorRepository;
import com.farmunity.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final CoordinatorRepository coordinatorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public AuthResponse registerFarmer(RegisterFarmerRequest req) {
        if (farmerRepository.existsByPhone(req.getPhone()) ||
            buyerRepository.existsByPhone(req.getPhone()) ||
            coordinatorRepository.existsByPhone(req.getPhone())) {
            throw new IllegalArgumentException("Phone number already registered: " + req.getPhone());
        }

        Farmer farmer = Farmer.builder()
                .name(req.getName())
                .phone(req.getPhone())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .latitude(req.getLatitude() != null ? req.getLatitude() : 12.9716)
                .longitude(req.getLongitude() != null ? req.getLongitude() : 77.5946)
                .address(req.getAddress())
                .trustTier(TrustTier.NEW)
                .reliabilityScore(new BigDecimal("50.00"))
                .isActive(true)
                .build();

        Farmer saved = farmerRepository.save(farmer);
        String token = jwtTokenProvider.generateToken(saved.getPhone(), UserRole.FARMER, saved.getId());

        eventPublisher.publishEvent(new AuditEvent(
                this, "FARMER", saved.getId(), "FARMER_REGISTERED",
                saved.getId(), "FARMER", "Farmer registered with NEW trust tier", null, "NEW"
        ));

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .name(saved.getName())
                .phone(saved.getPhone())
                .role(UserRole.FARMER)
                .trustTier(saved.getTrustTier().name())
                .build();
    }

    @Transactional
    public AuthResponse registerBuyer(RegisterBuyerRequest req) {
        if (farmerRepository.existsByPhone(req.getPhone()) ||
            buyerRepository.existsByPhone(req.getPhone()) ||
            coordinatorRepository.existsByPhone(req.getPhone())) {
            throw new IllegalArgumentException("Phone number already registered: " + req.getPhone());
        }

        Buyer buyer = Buyer.builder()
                .name(req.getName())
                .phone(req.getPhone())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .orgType(req.getOrgType())
                .latitude(req.getLatitude() != null ? req.getLatitude() : 12.9716)
                .longitude(req.getLongitude() != null ? req.getLongitude() : 77.5946)
                .address(req.getAddress())
                .trustTier(TrustTier.NEW)
                .reliabilityScore(new BigDecimal("50.00"))
                .commitmentDepositBalance(BigDecimal.ZERO)
                .isActive(true)
                .build();

        Buyer saved = buyerRepository.save(buyer);
        String token = jwtTokenProvider.generateToken(saved.getPhone(), UserRole.BUYER, saved.getId());

        eventPublisher.publishEvent(new AuditEvent(
                this, "BUYER", saved.getId(), "BUYER_REGISTERED",
                saved.getId(), "BUYER", "Buyer registered with NEW trust tier", null, "NEW"
        ));

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .name(saved.getName())
                .phone(saved.getPhone())
                .role(UserRole.BUYER)
                .trustTier(saved.getTrustTier().name())
                .build();
    }

    private String normalizePhone(String phone) {
        if (phone == null) return "";
        String cleaned = phone.trim().replaceAll("[^0-9]", "");
        if (cleaned.length() == 12 && cleaned.startsWith("91")) {
            return cleaned.substring(2);
        }
        if (cleaned.length() == 11 && cleaned.startsWith("0")) {
            return cleaned.substring(1);
        }
        return cleaned.isEmpty() ? phone.trim() : cleaned;
    }

    public AuthResponse login(LoginRequest req) {
        String rawPhone = req.getPhone() != null ? req.getPhone().trim() : "";
        String normPhone = normalizePhone(rawPhone);
        String password = req.getPassword() != null ? req.getPassword().trim() : "";

        // Check Farmer
        Optional<Farmer> farmerOpt = farmerRepository.findByPhone(normPhone);
        if (!farmerOpt.isPresent() && !rawPhone.equals(normPhone)) {
            farmerOpt = farmerRepository.findByPhone(rawPhone);
        }
        if (farmerOpt.isPresent()) {
            Farmer farmer = farmerOpt.get();
            if (passwordEncoder.matches(password, farmer.getPasswordHash()) || passwordEncoder.matches(req.getPassword(), farmer.getPasswordHash())) {
                String token = jwtTokenProvider.generateToken(farmer.getPhone(), UserRole.FARMER, farmer.getId());
                return AuthResponse.builder()
                        .token(token)
                        .id(farmer.getId())
                        .name(farmer.getName())
                        .phone(farmer.getPhone())
                        .role(UserRole.FARMER)
                        .trustTier(farmer.getTrustTier().name())
                        .build();
            }
        }

        // Check Buyer
        Optional<Buyer> buyerOpt = buyerRepository.findByPhone(normPhone);
        if (!buyerOpt.isPresent() && !rawPhone.equals(normPhone)) {
            buyerOpt = buyerRepository.findByPhone(rawPhone);
        }
        if (buyerOpt.isPresent()) {
            Buyer buyer = buyerOpt.get();
            if (passwordEncoder.matches(password, buyer.getPasswordHash()) || passwordEncoder.matches(req.getPassword(), buyer.getPasswordHash())) {
                String token = jwtTokenProvider.generateToken(buyer.getPhone(), UserRole.BUYER, buyer.getId());
                return AuthResponse.builder()
                        .token(token)
                        .id(buyer.getId())
                        .name(buyer.getName())
                        .phone(buyer.getPhone())
                        .role(UserRole.BUYER)
                        .trustTier(buyer.getTrustTier().name())
                        .build();
            }
        }

        // Check Coordinator
        Optional<Coordinator> coordinatorOpt = coordinatorRepository.findByPhone(normPhone);
        if (!coordinatorOpt.isPresent() && !rawPhone.equals(normPhone)) {
            coordinatorOpt = coordinatorRepository.findByPhone(rawPhone);
        }
        if (coordinatorOpt.isPresent()) {
            Coordinator coord = coordinatorOpt.get();
            if (passwordEncoder.matches(password, coord.getPasswordHash()) || passwordEncoder.matches(req.getPassword(), coord.getPasswordHash())) {
                String token = jwtTokenProvider.generateToken(coord.getPhone(), UserRole.COORDINATOR, coord.getId());
                return AuthResponse.builder()
                        .token(token)
                        .id(coord.getId())
                        .name(coord.getName())
                        .phone(coord.getPhone())
                        .role(UserRole.COORDINATOR)
                        .trustTier("COORDINATOR")
                        .build();
            }
        }

        throw new IllegalArgumentException("Invalid phone number or password. Please verify your credentials.");
    }
}
