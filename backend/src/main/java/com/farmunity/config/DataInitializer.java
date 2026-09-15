package com.farmunity.config;

import com.farmunity.entity.*;
import com.farmunity.entity.enums.*;
import com.farmunity.repository.*;
import com.farmunity.util.HashUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final CoordinatorRepository coordinatorRepository;
    private final ProduceListingRepository produceListingRepository;
    private final BuyerRequirementRepository buyerRequirementRepository;
    private final CooperativeBatchRepository cooperativeBatchRepository;
    private final BatchMembershipRepository batchMembershipRepository;
    private final AgreementRepository agreementRepository;
    private final CommitmentLedgerRepository commitmentLedgerRepository;
    private final ProcessorRepository processorRepository;
    private final JobWorkOrderRepository jobWorkOrderRepository;
    private final VerificationRecordRepository verificationRecordRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String pwd = passwordEncoder.encode("password123");

        // 1. Seed Users
        Farmer ramesh = farmerRepository.findByPhone("9876543210").orElseGet(() ->
            farmerRepository.save(Farmer.builder()
                .name("Ramesh Kumar").phone("9876543210")
                .email("ramesh@farmunity.in").passwordHash(pwd)
                .role(UserRole.FARMER).latitude(12.9716).longitude(77.5946)
                .address("Village Hoskote, Bengaluru Rural")
                .trustTier(TrustTier.VERIFIED)
                .reliabilityScore(new BigDecimal("88.50")).isActive(true).build())
        );

        Farmer suresh = farmerRepository.findByPhone("9876543211").orElseGet(() ->
            farmerRepository.save(Farmer.builder()
                .name("Suresh Gowda").phone("9876543211")
                .email("suresh@farmunity.in").passwordHash(pwd)
                .role(UserRole.FARMER).latitude(12.9249).longitude(77.6321)
                .address("Village Nelamangala, Bengaluru Rural")
                .trustTier(TrustTier.NEW)
                .reliabilityScore(new BigDecimal("65.00")).isActive(true).build())
        );

        Farmer venkat = farmerRepository.findByPhone("9876543212").orElseGet(() ->
            farmerRepository.save(Farmer.builder()
                .name("Venkat Rao").phone("9876543212")
                .email("venkat@farmunity.in").passwordHash(pwd)
                .role(UserRole.FARMER).latitude(12.8500).longitude(77.5500)
                .address("Village Devanahalli, Bengaluru Rural")
                .trustTier(TrustTier.ESTABLISHED)
                .reliabilityScore(new BigDecimal("94.00")).isActive(true).build())
        );

        Buyer buyer = buyerRepository.findByPhone("9876543220").orElseGet(() ->
            buyerRepository.save(Buyer.builder()
                .name("Bangalore Central Hostel Network").phone("9876543220")
                .email("procurement@bchostels.org").passwordHash(pwd)
                .role(UserRole.BUYER).orgType(OrgType.HOSTEL)
                .latitude(12.9352).longitude(77.6245)
                .address("Koramangala 4th Block, Bengaluru")
                .trustTier(TrustTier.VERIFIED)
                .reliabilityScore(new BigDecimal("92.00"))
                .commitmentDepositBalance(new BigDecimal("100000.00"))
                .isActive(true).build())
        );

        Coordinator coordinator = coordinatorRepository.findByPhone("9876543230").orElseGet(() ->
            coordinatorRepository.save(Coordinator.builder()
                .name("Anand Sharma (Coordinator)").phone("9876543230")
                .email("anand@farmunity.org").passwordHash(pwd)
                .role(UserRole.COORDINATOR)
                .region("Bengaluru Rural and Urban")
                .isActive(true).build())
        );

        // 2. Seed Processors
        Processor riceMill;
        if (processorRepository.count() == 0) {
            riceMill = processorRepository.save(Processor.builder()
                .name("Kaveri Agro Modern Rice Mill & De-husker")
                .phone("9876543240")
                .latitude(12.9800)
                .longitude(77.6100)
                .address("Industrial Area, Phase 2, Hoskote")
                .feePerKg(new BigDecimal("2.50"))
                .capacity(new BigDecimal("25000.00"))
                .isActive(true)
                .build());
        } else {
            riceMill = processorRepository.findAll().get(0);
        }

        // 3. Seed Realistic Produce Listings if none exist
        if (produceListingRepository.count() == 0) {
            ProduceListing listing1 = produceListingRepository.save(ProduceListing.builder()
                .farmer(ramesh)
                .crop("paddy")
                .variety("Sona Masoori")
                .declaredQty(new BigDecimal("1200.00"))
                .verifiedQty(new BigDecimal("1200.00"))
                .minPricePerKg(new BigDecimal("25.00"))
                .harvestDate(LocalDate.now().minusDays(5))
                .latitude(ramesh.getLatitude())
                .longitude(ramesh.getLongitude())
                .status(ProduceListingStatus.IN_BATCH)
                .moistureReading(new BigDecimal("13.20"))
                .build());

            ProduceListing listing2 = produceListingRepository.save(ProduceListing.builder()
                .farmer(suresh)
                .crop("paddy")
                .variety("Sona Masoori")
                .declaredQty(new BigDecimal("800.00"))
                .verifiedQty(new BigDecimal("800.00"))
                .minPricePerKg(new BigDecimal("25.50"))
                .harvestDate(LocalDate.now().minusDays(4))
                .latitude(suresh.getLatitude())
                .longitude(suresh.getLongitude())
                .status(ProduceListingStatus.IN_BATCH)
                .moistureReading(new BigDecimal("13.50"))
                .build());

            ProduceListing listing3 = produceListingRepository.save(ProduceListing.builder()
                .farmer(venkat)
                .crop("paddy")
                .variety("Sona Masoori")
                .declaredQty(new BigDecimal("1500.00"))
                .verifiedQty(new BigDecimal("1500.00"))
                .minPricePerKg(new BigDecimal("26.00"))
                .harvestDate(LocalDate.now().minusDays(6))
                .latitude(venkat.getLatitude())
                .longitude(venkat.getLongitude())
                .status(ProduceListingStatus.VERIFIED_COMPATIBLE)
                .moistureReading(new BigDecimal("12.80"))
                .build());

            // 4. Seed Physical Verification Records
            verificationRecordRepository.save(VerificationRecord.builder()
                .produceListing(listing1)
                .verifier(coordinator)
                .moistureReading(new BigDecimal("13.20"))
                .verifiedQty(new BigDecimal("1200.00"))
                .timestamp(LocalDateTime.now().minusDays(3))
                .evidenceNotes("Certified physical moisture check passed with portable grain probe. Clean, uniform golden kernels.")
                .photoUrls("https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80")
                .build());

            verificationRecordRepository.save(VerificationRecord.builder()
                .produceListing(listing2)
                .verifier(coordinator)
                .moistureReading(new BigDecimal("13.50"))
                .verifiedQty(new BigDecimal("800.00"))
                .timestamp(LocalDateTime.now().minusDays(3))
                .evidenceNotes("Verified on-farm lot. Moisture is safely under 14% threshold.")
                .photoUrls("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80")
                .build());

            verificationRecordRepository.save(VerificationRecord.builder()
                .produceListing(listing3)
                .verifier(coordinator)
                .moistureReading(new BigDecimal("12.80"))
                .verifiedQty(new BigDecimal("1500.00"))
                .timestamp(LocalDateTime.now().minusDays(3))
                .evidenceNotes("Optimal dry condition. Prime export grade lot.")
                .photoUrls("https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=400&q=80")
                .build());

            // 5. Seed Buyer Requirement
            BuyerRequirement requirement = buyerRequirementRepository.save(BuyerRequirement.builder()
                .buyer(buyer)
                .product("paddy")
                .variety("Sona Masoori")
                .quantityKg(new BigDecimal("3000.00"))
                .priceMin(new BigDecimal("25.00"))
                .priceMax(new BigDecimal("28.00"))
                .moistureBandMin(new BigDecimal("12.00"))
                .moistureBandMax(new BigDecimal("14.00"))
                .deliveryWindowStart(LocalDate.now().plusDays(2))
                .deliveryWindowEnd(LocalDate.now().plusDays(7))
                .destinationLatitude(buyer.getLatitude())
                .destinationLongitude(buyer.getLongitude())
                .destination(buyer.getAddress())
                .build());

            // 6. Seed Cooperative Batch
            CooperativeBatch batch = cooperativeBatchRepository.save(CooperativeBatch.builder()
                .buyerRequirement(requirement)
                .totalAllocatedQty(new BigDecimal("3000.00"))
                .shortfallQty(BigDecimal.ZERO)
                .status(BatchStatus.AGREED)
                .build());

            batchMembershipRepository.save(BatchMembership.builder()
                .cooperativeBatch(batch)
                .farmer(ramesh)
                .produceListing(listing1)
                .allocatedQty(new BigDecimal("1200.00"))
                .inclusionReason("Within 18.5 km radius, verified moisture 13.2%, price overlap ₹25.00-27.00")
                .farmerDecision("ACCEPTED")
                .farmerNote("Confirmed ready for scheduled pickup")
                .build());

            batchMembershipRepository.save(BatchMembership.builder()
                .cooperativeBatch(batch)
                .farmer(suresh)
                .produceListing(listing2)
                .allocatedQty(new BigDecimal("800.00"))
                .inclusionReason("Within 14.2 km radius, verified moisture 13.5%, price overlap ₹25.50-27.50")
                .farmerDecision("ACCEPTED")
                .farmerNote("Bags packed and weighed at farm gate")
                .build());

            batchMembershipRepository.save(BatchMembership.builder()
                .cooperativeBatch(batch)
                .farmer(venkat)
                .produceListing(listing3)
                .allocatedQty(new BigDecimal("1000.00"))
                .inclusionReason("Within 22.0 km radius, verified moisture 12.8%, price overlap ₹26.00-28.00")
                .farmerDecision("ACCEPTED")
                .farmerNote("Approved 1,000 kg allocation from 1,500 kg lot")
                .build());

            // 7. Seed Locked Agreement
            String integrityHash = HashUtil.sha256CanonicalJson(Map.of(
                    "batchId", batch.getId().toString(),
                    "buyerId", buyer.getId().toString(),
                    "totalQty", "3000.00",
                    "pricePerKg", "26.50"
            ));

            Agreement agreement = agreementRepository.save(Agreement.builder()
                .cooperativeBatch(batch)
                .version(1)
                .versionLock(0L)
                .status(AgreementStatus.LOCKED_V1)
                .agreedPricePerKg(new BigDecimal("26.50"))
                .overlapLow(new BigDecimal("26.00"))
                .overlapHigh(new BigDecimal("27.00"))
                .totalValueGross(new BigDecimal("79500.00"))
                .transportDeductionPerKg(new BigDecimal("0.75"))
                .platformFeeRate(new BigDecimal("0.02"))
                .integrityHash(integrityHash)
                .build());

            // 8. Seed Commitment Ledger
            commitmentLedgerRepository.save(CommitmentLedger.builder()
                .agreement(agreement)
                .buyer(buyer)
                .committedAmount(new BigDecimal("79500.00"))
                .status(CommitmentStatus.FUNDED)
                .fundedAt(LocalDateTime.now().minusDays(1))
                .build());

            // 9. Seed Work Order for Processing
            jobWorkOrderRepository.save(JobWorkOrder.builder()
                .agreement(agreement)
                .processor(riceMill)
                .rawInputQty(new BigDecimal("3000.00"))
                .expectedYieldRatio(new BigDecimal("0.6500"))
                .fee(new BigDecimal("7500.00"))
                .status(WorkOrderStatus.PENDING)
                .flaggedForReview(false)
                .build());

            // 10. Seed Initial Audit Logs
            auditLogRepository.save(AuditLog.builder()
                .entityType("COOPERATIVE_BATCH")
                .entityId(batch.getId())
                .eventType("BATCH_FORMED")
                .actorId(coordinator.getId())
                .actorRole("COORDINATOR")
                .timestamp(LocalDateTime.now().minusDays(2))
                .details("Dynamic cooperative batch #1 formed with 3 farmers for 3,000 kg Paddy.")
                .newState("FORMED")
                .build());

            auditLogRepository.save(AuditLog.builder()
                .entityType("AGREEMENT")
                .entityId(agreement.getId())
                .eventType("AGREEMENT_LOCKED")
                .actorId(buyer.getId())
                .actorRole("BUYER")
                .timestamp(LocalDateTime.now().minusDays(1))
                .details("Agreement v1 locked at ₹26.50/kg with SHA-256 integrity hash: " + integrityHash)
                .previousState("PENDING_APPROVAL")
                .newState("LOCKED_V1")
                .build());
        }

        log.info("DataInitializer: Complete FarmUnity realistic seed data initialized.");
    }
}
