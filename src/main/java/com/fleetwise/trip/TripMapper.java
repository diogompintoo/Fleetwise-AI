package com.fleetwise.trip;

import com.fleetwise.driver.Driver;
import com.fleetwise.trip.dto.CreateTripRequest;
import com.fleetwise.trip.dto.TripResponse;
import com.fleetwise.trip.dto.UpdateTripRequest;
import com.fleetwise.vehicle.Vehicle;

public final class TripMapper {

    private TripMapper() {}

    /**
     * Distance is calculated here — never taken from the client.
     */
    public static Trip toEntity(CreateTripRequest request, Vehicle vehicle, Driver driver, int distance) {
        return Trip.builder()
                .vehicle(vehicle)
                .driver(driver)
                .date(request.date())
                .startLocation(request.startLocation().trim())
                .endLocation(request.endLocation().trim())
                .startMileage(request.startMileage())
                .endMileage(request.endMileage())
                .distance(distance)
                .purpose(request.purpose() != null ? request.purpose().trim() : null)
                .build();
    }

    public static void updateEntity(Trip trip, UpdateTripRequest request, int distance) {
        trip.setDate(request.date());
        trip.setStartLocation(request.startLocation().trim());
        trip.setEndLocation(request.endLocation().trim());
        trip.setStartMileage(request.startMileage());
        trip.setEndMileage(request.endMileage());
        trip.setDistance(distance);
        trip.setPurpose(request.purpose() != null ? request.purpose().trim() : null);
    }

    public static TripResponse toResponse(Trip trip) {
        return new TripResponse(
                trip.getId(),
                trip.getVehicle().getId(),
                trip.getDriver().getId(),
                trip.getDate(),
                trip.getStartLocation(),
                trip.getEndLocation(),
                trip.getStartMileage(),
                trip.getEndMileage(),
                trip.getDistance(),
                trip.getPurpose()
        );
    }
}
