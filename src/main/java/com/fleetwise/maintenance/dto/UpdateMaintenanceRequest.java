package com.fleetwise.maintenance.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateMaintenanceRequest(
        @NotNull LocalDate date,
        @NotBlank @Size(max = 50) String type,
        @Size(max = 500) String description,
        @NotNull @Min(0) Integer mileage,
        @NotNull @DecimalMin("0.00") BigDecimal cost
) {}
