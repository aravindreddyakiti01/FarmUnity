package com.farmunity.config;

import com.farmunity.entity.Buyer;
import com.farmunity.entity.Coordinator;
import com.farmunity.entity.Farmer;
import com.farmunity.entity.enums.OrgType;
import com.farmunity.entity.enums.TrustTier;
import com.farmunity.entity.enums.UserRole;
import com.farmunity.repository.BuyerRepository;
import com.farmunity.repository.CoordinatorRepository;
import com.farmunity.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final CoordinatorRepository coordinatorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String pwd = passwordEncoder.encode("password123");

        if (!farmerRepository.existsByPhone("9876543210")) {
            farmerRepository.save(Farmer.builder()
                .name("Ramesh Kumar").phone("9876543210")
                .email("ramesh@farmunity.in").passwordHash(pwd)
                .role(UserRole.FARMER).latitude(12.9716).longitude(77.5946)
                .address("Village Hoskote, Bengaluru Rural")
                .trustTier(TrustTier.VERIFIED)
                .reliabilityScore(new BigDecimal("88.50")).isActive(true).build());
        }
        if (!farmerRepository.existsByPhone("9876543211")) {
            farmerRepository.save(Farmer.builder()
                .name("Suresh Gowda").phone("9876543211")
                .email("suresh@farmunity.in").passwordHash(pwd)
                .role(UserRole.FARMER).latitude(12.9249).longitude(77.6321)
                .address("Village Nelamangala, Bengaluru Rural")
                .trustTier(TrustTier.NEW)
                .reliabilityScore(new BigDecimal("65.00")).isActive(true).build());
        }
        if (!farmerRepository.existsByPhone("9876543212")) {
            farmerRepository.save(Farmer.builder()
                .name("Venkat Rao").phone("9876543212")
                .email("venkat@farmunity.in").passwordHash(pwd)
                .role(UserRole.FARMER).latitude(12.8500).longitude(77.5500)
                .address("Village Devanahalli, Bengaluru Rural")
                .trustTier(TrustTier.ESTABLISHED)
                .reliabilityScore(new BigDecimal("94.00")).isActive(true).build());
        }
        if (!buyerRepository.existsByPhone("9876543220")) {
            buyerRepository.save(Buyer.builder()
                .name("Bangalore Central Hostel Network").phone("9876543220")
                .email("procurement@bchostels.org").passwordHash(pwd)
                .role(UserRole.BUYER).orgType(OrgType.HOSTEL)
                .latitude(12.9352).longitude(77.6245)
                .address("Koramangala 4th Block, Bengaluru")
                .trustTier(TrustTier.VERIFIED)
                .reliabilityScore(new BigDecimal("92.00"))
                .commitmentDepositBalance(new BigDecimal("50000.00"))
                .isActive(true).build());
        }
        if (!coordinatorRepository.existsByPhone("9876543230")) {
            coordinatorRepository.save(Coordinator.builder()
                .name("Anand Sharma (Coordinator)").phone("9876543230")
                .email("anand@farmunity.org").passwordHash(pwd)
                .role(UserRole.COORDINATOR)
                .region("Bengaluru Rural and Urban")
                .isActive(true).build());
        }
        log.info("DataInitializer: All seed accounts ready. Password: password123");
    }
}
