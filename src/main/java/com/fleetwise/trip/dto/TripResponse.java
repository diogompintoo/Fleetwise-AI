package com.fleetwise.trip.dto;

import java.time.LocalDate;

public record TripResponse(
        Long id,
        Long vehicleId,
        String vehiclePlate,
        Long driverId,
        String driverName,
        LocalDate date,
        String startLocation,
        String endLocation,
        Integer startMileage,
        Integer endMileage,
        Integer distance,
        String purpose
) {}
