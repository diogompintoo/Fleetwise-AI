package com.fleetwise.vehicle.dto;

import jakarta.validation.constraints.*;

public record CreateVehicleRequest(
        @NotNull(message = "Company id is required")
        Long companyId,

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
        @Min(value = 1980, message = "Year must be >= 1980")
        @Max(value = 2030, message = "Year must be <= 2030")
        Integer year,

        @NotBlank(message = "Fuel type is required")
        @Size(max = 30)
        String fuelType,

        @NotNull(message = "Initial mileage is required")
        @Min(value = 0, message = "Initial mileage cannot be negative")
        Integer initialMileage
) {}
