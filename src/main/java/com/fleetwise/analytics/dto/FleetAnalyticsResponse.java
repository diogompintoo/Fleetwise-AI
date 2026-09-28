package com.fleetwise.analytics.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FleetAnalyticsResponse(
        LocalDate from,
        LocalDate to,
        Integer totalDistanceKm,
        BigDecimal totalLiters,
        BigDecimal totalFuelCost,
        BigDecimal averageConsumption,   // L/100km
        BigDecimal costPerKm,
        BigDecimal averageFuelPrice,
        MetricVariation consumptionVariation,
        MetricVariation costVariation,
        MetricVariation distanceVariation
) {}