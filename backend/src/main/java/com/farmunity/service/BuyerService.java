package com.farmunity.service;

import com.farmunity.entity.Buyer;
import com.farmunity.repository.BuyerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuyerService {

    private final BuyerRepository buyerRepository;

    public Buyer getBuyerById(Long id) {
        return buyerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + id));
    }

    public List<Buyer> getAllBuyers() {
        return buyerRepository.findAll();
    }
}
