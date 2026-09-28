package com.fleetwise.analytics.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VehicleAnalyticsResponse(
        Long vehicleId,
        String licensePlate,
        LocalDate from,
        LocalDate to,
        Integer totalDistanceKm,
        BigDecimal totalLiters,
        BigDecimal totalFuelCost,
        BigDecimal averageConsumption,
        BigDecimal costPerKm,
        BigDecimal averageFuelPrice,
        MetricVariation consumptionVariation,
        MetricVariation costVariation,
        MetricVariation distanceVariation
) {}
