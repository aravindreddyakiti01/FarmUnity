package com.farmunity.service;

import com.farmunity.dto.request.ExecuteRecoveryRequest;
import com.farmunity.dto.response.FailureRecoveryResponse;
import com.farmunity.entity.*;
import com.farmunity.entity.enums.BatchStatus;
import com.farmunity.entity.enums.ProduceListingStatus;
import com.farmunity.entity.enums.UserRole;
import com.farmunity.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FailureRecoveryServiceTest {

    @Mock
    private CooperativeBatchRepository cooperativeBatchRepository;

    @Mock
    private BatchMembershipRepository batchMembershipRepository;

    @Mock
    private ProduceListingRepository produceListingRepository;

    @Mock
    private AgreementRepository agreementRepository;

    @Mock
    private ProduceListingService produceListingService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private FailureRecoveryService failureRecoveryService;

    private Farmer farmer;
    private CooperativeBatch batch;
    private BatchMembership membership;
    private ProduceListing listing;
    private BuyerRequirement requirement;

    @BeforeEach
    void setUp() {
        farmer = Farmer.builder()
                .id(50L)
                .name("Ramesh")
                .phone("9876543210")
                .role(UserRole.FARMER)
                .build();

        requirement = BuyerRequirement.builder()
                .id(1L)
                .product("Paddy")
                .quantityKg(new BigDecimal("1000"))
                .build();

        batch = CooperativeBatch.builder()
                .id(10L)
                .buyerRequirement(requirement)
                .totalAllocatedQty(new BigDecimal("1000"))
                .status(BatchStatus.AGREED)
                .memberships(new ArrayList<>())
                .build();

        listing = ProduceListing.builder()
                .id(100L)
                .farmer(farmer)
                .crop("Paddy")
                .declaredQty(new BigDecimal("500"))
                .verifiedQty(new BigDecimal("500"))
                .status(ProduceListingStatus.VERIFIED_COMPATIBLE)
                .build();

        membership = BatchMembership.builder()
                .id(200L)
                .cooperativeBatch(batch)
                .farmer(farmer)
                .produceListing(listing)
                .allocatedQty(new BigDecimal("500"))
                .build();

        batch.getMemberships().add(membership);
    }

    @Test
    void testDetectFarmerCancellation_WithReplacementAvailable() {
        ProduceListing replacementListing = ProduceListing.builder()
                .id(101L)
                .farmer(farmer)
                .crop("Paddy")
                .declaredQty(new BigDecimal("500"))
                .verifiedQty(new BigDecimal("500"))
                .status(ProduceListingStatus.VERIFIED_COMPATIBLE)
                .build();

        when(cooperativeBatchRepository.findById(10L)).thenReturn(Optional.of(batch));
        when(batchMembershipRepository.findById(200L)).thenReturn(Optional.of(membership));
        when(produceListingRepository.findAll()).thenReturn(List.of(listing, replacementListing));

        FailureRecoveryResponse response = failureRecoveryService.detectFarmerCancellation(
                10L, 200L, "Tractor broke down", 1L);

        assertNotNull(response);
        assertEquals(10L, response.getBatchId());
        assertEquals("FARMER_CANCELLATION", response.getFailureType());
        assertEquals(new BigDecimal("500"), response.getShortfallKg());
        assertTrue(response.getProposedOptions().size() >= 2);
        assertEquals("OPTION_REPLACE_FARMER", response.getProposedOptions().get(0).getOptionId());
        assertTrue(response.getProposedOptions().get(0).isRecommended());
    }

    @Test
    void testExecuteRecovery_ReduceQuantity() {
        Agreement agreement = Agreement.builder()
                .id(300L)
                .cooperativeBatch(batch)
                .version(1)
                .agreedPricePerKg(new BigDecimal("25.00"))
                .totalValueGross(new BigDecimal("25000.00"))
                .build();

        when(cooperativeBatchRepository.findById(10L)).thenReturn(Optional.of(batch));
        when(batchMembershipRepository.findById(200L)).thenReturn(Optional.of(membership));
        when(agreementRepository.findByCooperativeBatchId(10L)).thenReturn(Optional.of(agreement));

        ExecuteRecoveryRequest request = ExecuteRecoveryRequest.builder()
                .optionId("OPTION_REDUCE_QUANTITY")
                .reason("Farmer unable to harvest, reducing batch")
                .build();

        FailureRecoveryResponse response = failureRecoveryService.executeRecovery(10L, 200L, request, 1L);

        assertNotNull(response);
        assertEquals("RECOVERED", response.getStatus());
        assertEquals(BatchStatus.AGREED, batch.getStatus());
        assertEquals(new BigDecimal("500"), batch.getTotalAllocatedQty());
        assertEquals(2, agreement.getVersion());
        verify(agreementRepository).save(agreement);
    }
}
