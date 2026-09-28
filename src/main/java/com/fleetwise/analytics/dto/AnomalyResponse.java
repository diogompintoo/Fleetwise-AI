package com.fleetwise.analytics.dto;

import java.math.BigDecimal;

public record AnomalyResponse(
        Long vehicleId,
        String licensePlate,
        String metric,
        BigDecimal currentValue,
        BigDecimal baselineValue,
        BigDecimal variationPercent,
        BigDecimal thresholdPercent,
        String message
) {}