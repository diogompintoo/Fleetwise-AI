package com.fleetwise.fueling;

import com.fleetwise.fueling.dto.CreateFuelingRequest;
import com.fleetwise.fueling.dto.FuelingResponse;
import com.fleetwise.fueling.dto.UpdateFuelingRequest;
import com.fleetwise.vehicle.Vehicle;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class FuelingMapper {

    private FuelingMapper() {}

    public static BigDecimal calculateTotalCost(BigDecimal liters, BigDecimal pricePerLiter) {
        return liters.multiply(pricePerLiter).setScale(2, RoundingMode.HALF_UP);
    }

    public static Fueling toEntity(CreateFuelingRequest request, Vehicle vehicle, BigDecimal totalCost) {
        return Fueling.builder()
                .vehicle(vehicle)
                .date(request.date())
                .odometer(request.odometer())
                .liters(request.liters())
                .pricePerLiter(request.pricePerLiter())
                .totalCost(totalCost)
                .fuelStation(request.fuelStation() != null ? request.fuelStation().trim() : null)
                .build();
    }

    public static void updateEntity(Fueling fueling, UpdateFuelingRequest request, BigDecimal totalCost) {
        fueling.setDate(request.date());
        fueling.setOdometer(request.odometer());
        fueling.setLiters(request.liters());
        fueling.setPricePerLiter(request.pricePerLiter());
        fueling.setTotalCost(totalCost);
        fueling.setFuelStation(request.fuelStation() != null ? request.fuelStation().trim() : null);
    }

    public static FuelingResponse toResponse(Fueling fueling) {
        return new FuelingResponse(
                fueling.getId(),
                fueling.getVehicle().getId(),
                fueling.getDate(),
                fueling.getOdometer(),
                fueling.getLiters(),
                fueling.getPricePerLiter(),
                fueling.getTotalCost(),
                fueling.getFuelStation()
        );
    }
}
