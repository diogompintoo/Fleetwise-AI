package com.fleetwise.maintenance;

import com.fleetwise.common.exception.ResourceNotFoundException;
import com.fleetwise.maintenance.dto.CreateMaintenanceRequest;
import com.fleetwise.maintenance.dto.MaintenanceResponse;
import com.fleetwise.maintenance.dto.UpdateMaintenanceRequest;
import com.fleetwise.vehicle.Vehicle;
import com.fleetwise.vehicle.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleService vehicleService;

    public List<MaintenanceResponse> findAll() {
        return maintenanceRepository.findAll().stream().map(MaintenanceMapper::toResponse).toList();
    }

    public List<MaintenanceResponse> findByVehicle(Long vehicleId) {
        vehicleService.getEntity(vehicleId);
        return maintenanceRepository.findByVehicleId(vehicleId).stream()
                .map(MaintenanceMapper::toResponse).toList();
    }

    public MaintenanceResponse findById(Long id) {
        return MaintenanceMapper.toResponse(getEntity(id));
    }

    public Maintenance getEntity(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance", id));
    }

    @Transactional
    public MaintenanceResponse create(CreateMaintenanceRequest request) {
        Vehicle vehicle = vehicleService.getEntity(request.vehicleId());
        Maintenance saved = maintenanceRepository.save(MaintenanceMapper.toEntity(request, vehicle));
        return MaintenanceMapper.toResponse(saved);
    }

    @Transactional
    public MaintenanceResponse update(Long id, UpdateMaintenanceRequest request) {
        Maintenance m = getEntity(id);
        MaintenanceMapper.updateEntity(m, request);
        return MaintenanceMapper.toResponse(maintenanceRepository.save(m));
    }

    @Transactional
    public void delete(Long id) {
        if (!maintenanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Maintenance", id);
        }
        maintenanceRepository.deleteById(id);
    }
}
