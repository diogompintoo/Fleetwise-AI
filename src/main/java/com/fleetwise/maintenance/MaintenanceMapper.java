package com.fleetwise.maintenance;

import com.fleetwise.maintenance.dto.CreateMaintenanceRequest;
import com.fleetwise.maintenance.dto.MaintenanceResponse;
import com.fleetwise.maintenance.dto.UpdateMaintenanceRequest;
import com.fleetwise.vehicle.Vehicle;

public final class MaintenanceMapper {

    private MaintenanceMapper() {}

    public static Maintenance toEntity(CreateMaintenanceRequest request, Vehicle vehicle) {
        return Maintenance.builder()
                .vehicle(vehicle)
                .date(request.date())
                .type(request.type().trim())
                .description(request.description() != null ? request.description().trim() : null)
                .mileage(request.mileage())
                .cost(request.cost())
                .build();
    }

    public static void updateEntity(Maintenance m, UpdateMaintenanceRequest request) {
        m.setDate(request.date());
        m.setType(request.type().trim());
        m.setDescription(request.description() != null ? request.description().trim() : null);
        m.setMileage(request.mileage());
        m.setCost(request.cost());
    }

    public static MaintenanceResponse toResponse(Maintenance m) {
        return new MaintenanceResponse(
                m.getId(),
                m.getVehicle().getId(),
                m.getDate(),
                m.getType(),
                m.getDescription(),
                m.getMileage(),
                m.getCost()
        );
    }
}
