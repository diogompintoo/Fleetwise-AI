package com.fleetwise.fueling.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateFuelingRequest(
        @NotNull(message = "Vehicle id is required")
        Long vehicleId,

        @NotNull(message = "Date is required")
        LocalDate date,

        @NotNull(message = "Odometer is required")
        @Min(0)
        Integer odometer,

        @NotNull(message = "Liters is required")
        @DecimalMin(value = "0.01", message = "Liters must be > 0")
        BigDecimal liters,

        @NotNull(message = "Price per liter is required")
        @DecimalMin(value = "0.001", message = "Price per liter must be > 0")
        BigDecimal pricePerLiter,

        @Size(max = 200)
        String fuelStation
) {}
