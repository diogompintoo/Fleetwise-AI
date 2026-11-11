package com.fleetwise.trip;

import com.fleetwise.common.exception.BusinessRuleException;
import com.fleetwise.common.exception.ResourceNotFoundException;
import com.fleetwise.driver.Driver;
import com.fleetwise.driver.DriverService;
import com.fleetwise.trip.dto.CreateTripRequest;
import com.fleetwise.trip.dto.TripResponse;
import com.fleetwise.trip.dto.UpdateTripRequest;
import com.fleetwise.vehicle.Vehicle;
import com.fleetwise.vehicle.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleService vehicleService;
    private final DriverService driverService;

    public List<TripResponse> findAll() {
        return tripRepository.findAllWithVehicleAndDriver().stream().map(TripMapper::toResponse).toList();
    }

    public List<TripResponse> findByVehicle(Long vehicleId) {
        vehicleService.getEntity(vehicleId);
        return tripRepository.findByVehicleIdWithVehicleAndDriver(vehicleId).stream()
                .map(TripMapper::toResponse)
                .toList();
    }

    public List<TripResponse> findByDriver(Long driverId) {
        driverService.getEntity(driverId);
        return tripRepository.findByDriverIdWithVehicleAndDriver(driverId).stream()
                .map(TripMapper::toResponse)
                .toList();
    }

    public TripResponse findById(Long id) {
        return tripRepository.findByIdWithVehicleAndDriver(id)
                .map(TripMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", id));
    }

    public Trip getEntity(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", id));
    }

    /**
     * Core business rule: distance is always computed on the server.
     * endMileage must be strictly greater than startMileage.
     */
    private int calculateDistance(int startMileage, int endMileage) {
        if (endMileage <= startMileage) {
            throw new BusinessRuleException(
                    "End mileage (" + endMileage + ") must be greater than start mileage (" + startMileage + ")"
            );
        }
        return endMileage - startMileage;
    }

    @Transactional
    public TripResponse create(CreateTripRequest request) {
        Vehicle vehicle = vehicleService.getEntity(request.vehicleId());
        Driver driver = driverService.getEntity(request.driverId());

        if (!vehicle.getActive()) {
            throw new BusinessRuleException("Cannot create trip for inactive vehicle: " + vehicle.getLicensePlate());
        }
        if (!driver.getActive()) {
            throw new BusinessRuleException("Cannot create trip for inactive driver: " + driver.getName());
        }
        if (!vehicle.getCompany().getId().equals(driver.getCompany().getId())) {
            throw new BusinessRuleException("Vehicle and driver must belong to the same company");
        }

        int distance = calculateDistance(request.startMileage(), request.endMileage());
        Trip saved = tripRepository.save(TripMapper.toEntity(request, vehicle, driver, distance));
        return TripMapper.toResponse(saved);
    }

    @Transactional
    public TripResponse update(Long id, UpdateTripRequest request) {
        Trip trip = getEntity(id);
        int distance = calculateDistance(request.startMileage(), request.endMileage());
        TripMapper.updateEntity(trip, request, distance);
        return TripMapper.toResponse(tripRepository.save(trip));
    }

    @Transactional
    public void delete(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trip", id);
        }
        tripRepository.deleteById(id);
    }
}
