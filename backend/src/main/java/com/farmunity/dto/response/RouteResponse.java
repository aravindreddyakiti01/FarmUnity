package com.farmunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {
    private Long batchId;
    private Double totalDistanceKm;
    private Integer totalStops;
    private List<RouteStop> stops;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RouteStop {
        private Integer stopOrder;
        private Long membershipId;
        private Long farmerId;
        private String farmerName;
        private String phone;
        private Double latitude;
        private Double longitude;
        private String address;
        private BigDecimal allocatedQtyKg;
        private Double distanceToNextKm;
    }
}
