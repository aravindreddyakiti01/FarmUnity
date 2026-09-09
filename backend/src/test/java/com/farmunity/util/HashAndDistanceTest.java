package com.farmunity.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HashAndDistanceTest {

    @Test
    @DisplayName("Should compute accurate Haversine distance between Bengaluru and Hoskote")
    void testHaversineDistance() {
        // Bengaluru Central (12.9716, 77.5946) to Hoskote (13.0699, 77.7983)
        double dist = HaversineUtil.distanceKm(12.9716, 77.5946, 13.0699, 77.7983);
        
        // Expected distance ~24.5 km
        assertTrue(dist > 20.0 && dist < 30.0, "Distance should be ~24.5 km but got: " + dist);
    }

    @Test
    @DisplayName("Should return 0 km for identical coordinates")
    void testZeroDistance() {
        double dist = HaversineUtil.distanceKm(12.9716, 77.5946, 12.9716, 77.5946);
        assertEquals(0.0, dist, 0.0001);
    }

    @Test
    @DisplayName("Should generate deterministic SHA-256 hash regardless of map key insertion order")
    void testCanonicalSha256Determinism() {
        Map<String, Object> mapA = new HashMap<>();
        mapA.put("agreementId", 101);
        mapA.put("price", "28.50");
        mapA.put("buyer", "Hostel");

        Map<String, Object> mapB = new HashMap<>();
        mapB.put("buyer", "Hostel");
        mapB.put("price", "28.50");
        mapB.put("agreementId", 101);

        String hashA = HashUtil.sha256CanonicalJson(mapA);
        String hashB = HashUtil.sha256CanonicalJson(mapB);

        assertNotNull(hashA);
        assertEquals(64, hashA.length(), "SHA-256 hex string should be 64 chars");
        assertEquals(hashA, hashB, "Hashes must be identical regardless of insertion order");
    }
}
