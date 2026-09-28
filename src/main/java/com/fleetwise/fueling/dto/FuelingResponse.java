package com.fleetwise.fueling.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FuelingResponse(
        Long id,
        Long vehicleId,
        LocalDate date,
        Integer odometer,
        BigDecimal liters,
        BigDecimal pricePerLiter,
        BigDecimal totalCost,
        String fuelStation
) {}
