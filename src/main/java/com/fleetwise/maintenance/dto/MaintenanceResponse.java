package com.fleetwise.maintenance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MaintenanceResponse(
        Long id,
        Long vehicleId,
        LocalDate date,
        String type,
        String description,
        Integer mileage,
        BigDecimal cost
) {}
