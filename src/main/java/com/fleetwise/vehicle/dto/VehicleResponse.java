package com.fleetwise.vehicle.dto;

public record VehicleResponse(
        Long id,
        Long companyId,
        String licensePlate,
        String brand,
        String model,
        Integer year,
        String fuelType,
        Integer initialMileage,
        Boolean active
) {}
