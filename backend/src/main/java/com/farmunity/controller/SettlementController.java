package com.farmunity.controller;

import com.farmunity.dto.response.SettlementResponse;
import com.farmunity.entity.Settlement;
import com.farmunity.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    @GetMapping("/agreement/{agreementId}")
    public ResponseEntity<SettlementResponse> getSettlementByAgreement(@PathVariable Long agreementId) {
        return ResponseEntity.ok(settlementService.getSettlementForAgreement(agreementId));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Settlement>> getSettlementsByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(settlementService.getSettlementsForFarmer(farmerId));
    }
}
