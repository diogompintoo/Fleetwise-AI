package com.fleetwise.vehicle.dto;

import jakarta.validation.constraints.*;

public record UpdateVehicleRequest(
        @NotBlank(message = "License plate is required")
        @Size(max = 20)
        String licensePlate,

        @NotBlank(message = "Brand is required")
        @Size(max = 100)
        String brand,

        @NotBlank(message = "Model is required")
        @Size(max = 100)
        String model,

        @NotNull(message = "Year is required")
        @Min(1980) @Max(2030)
        Integer year,

        @NotBlank(message = "Fuel type is required")
        @Size(max = 30)
        String fuelType,

        @NotNull(message = "Active flag is required")
        Boolean active
) {}
