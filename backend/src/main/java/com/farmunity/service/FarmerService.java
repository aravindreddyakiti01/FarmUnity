package com.farmunity.service;

import com.farmunity.entity.Farmer;
import com.farmunity.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final FarmerRepository farmerRepository;

    public Farmer getFarmerById(Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Farmer not found with ID: " + id));
    }

    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }
}
