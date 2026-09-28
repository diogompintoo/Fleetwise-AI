package com.fleetwise.vehicle;

import com.fleetwise.company.Company;
import com.fleetwise.vehicle.dto.CreateVehicleRequest;
import com.fleetwise.vehicle.dto.UpdateVehicleRequest;
import com.fleetwise.vehicle.dto.VehicleResponse;

public final class VehicleMapper {

    private VehicleMapper() {}

    public static Vehicle toEntity(CreateVehicleRequest request, Company company) {
        return Vehicle.builder()
                .company(company)
                .licensePlate(request.licensePlate().trim().toUpperCase())
                .brand(request.brand().trim())
                .model(request.model().trim())
                .year(request.year())
                .fuelType(request.fuelType().trim())
                .initialMileage(request.initialMileage())
                .active(true)
                .build();
    }

    public static void updateEntity(Vehicle vehicle, UpdateVehicleRequest request) {
        vehicle.setLicensePlate(request.licensePlate().trim().toUpperCase());
        vehicle.setBrand(request.brand().trim());
        vehicle.setModel(request.model().trim());
        vehicle.setYear(request.year());
        vehicle.setFuelType(request.fuelType().trim());
        vehicle.setActive(request.active());
    }

    public static VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getCompany().getId(),
                vehicle.getLicensePlate(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getFuelType(),
                vehicle.getInitialMileage(),
                vehicle.getActive()
        );
    }
}
