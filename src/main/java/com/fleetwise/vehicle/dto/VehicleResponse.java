package com.fleetwise.vehicle.dto;

public record VehicleResponse(
        Long id,
        Long companyId,
        String companyName,
        String licensePlate,
        String brand,
        String model,
        Integer manufactureYear,
        String fuelType,
        Integer initialMileage,
        Boolean active
) {}
