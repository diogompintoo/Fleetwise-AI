package com.fleetwise.fueling.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateFuelingRequest(
        @NotNull LocalDate date,
        @NotNull @Min(0) Integer odometer,
        @NotNull @DecimalMin("0.01") BigDecimal liters,
        @NotNull @DecimalMin("0.001") BigDecimal pricePerLiter,
        @Size(max = 200) String fuelStation
) {}
