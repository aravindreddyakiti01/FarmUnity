package com.farmunity.controller;

import com.farmunity.entity.Buyer;
import com.farmunity.service.BuyerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyers")
@RequiredArgsConstructor
public class BuyerController {

    private final BuyerService buyerService;

    @GetMapping("/{id}")
    public ResponseEntity<Buyer> getBuyerById(@PathVariable Long id) {
        return ResponseEntity.ok(buyerService.getBuyerById(id));
    }

    @GetMapping
    public ResponseEntity<List<Buyer>> getAllBuyers() {
        return ResponseEntity.ok(buyerService.getAllBuyers());
    }
}
