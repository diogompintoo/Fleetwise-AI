package com.fleetwise.trip.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record UpdateTripRequest(
        @NotNull(message = "Date is required")
        LocalDate date,

        @NotBlank(message = "Start location is required")
        @Size(max = 255)
        String startLocation,

        @NotBlank(message = "End location is required")
        @Size(max = 255)
        String endLocation,

        @NotNull(message = "Start mileage is required")
        @Min(0)
        Integer startMileage,

        @NotNull(message = "End mileage is required")
        @Min(0)
        Integer endMileage,

        @Size(max = 500)
        String purpose
) {}
