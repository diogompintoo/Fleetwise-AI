package com.fleetwise.trip.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateTripRequest(
        @NotNull(message = "Vehicle id is required")
        Long vehicleId,

        @NotNull(message = "Driver id is required")
        Long driverId,

        @NotNull(message = "Date is required")
        LocalDate date,

        @NotBlank(message = "Start location is required")
        @Size(max = 255)
        String startLocation,

        @NotBlank(message = "End location is required")
        @Size(max = 255)
        String endLocation,

        @NotNull(message = "Start mileage is required")
        @Min(value = 0, message = "Start mileage cannot be negative")
        Integer startMileage,

        @NotNull(message = "End mileage is required")
        @Min(value = 0, message = "End mileage cannot be negative")
        Integer endMileage,

        @Size(max = 500)
        String purpose
) {}
