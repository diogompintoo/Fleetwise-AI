package com.fleetwise.vehicle;

import com.fleetwise.common.exception.BusinessRuleException;
import com.fleetwise.common.exception.ResourceNotFoundException;
import com.fleetwise.company.Company;
import com.fleetwise.company.CompanyService;
import com.fleetwise.vehicle.dto.CreateVehicleRequest;
import com.fleetwise.vehicle.dto.UpdateVehicleRequest;
import com.fleetwise.vehicle.dto.VehicleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CompanyService companyService;

    public List<VehicleResponse> findAll() {
        return vehicleRepository.findAll().stream()
                .map(VehicleMapper::toResponse)
                .toList();
    }

    public List<VehicleResponse> findByCompany(Long companyId) {
        companyService.getEntity(companyId); // validates existence
        return vehicleRepository.findByCompanyId(companyId).stream()
                .map(VehicleMapper::toResponse)
                .toList();
    }

    public VehicleResponse findById(Long id) {
        return VehicleMapper.toResponse(getEntity(id));
    }

    public Vehicle getEntity(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));
    }

    @Transactional
    public VehicleResponse create(CreateVehicleRequest request) {
        Company company = companyService.getEntity(request.companyId());
        String plate = request.licensePlate().trim().toUpperCase();
        if (vehicleRepository.existsByLicensePlate(plate)) {
            throw new BusinessRuleException("License plate already registered: " + plate);
        }
        Vehicle saved = vehicleRepository.save(VehicleMapper.toEntity(request, company));
        return VehicleMapper.toResponse(saved);
    }

    @Transactional
    public VehicleResponse update(Long id, UpdateVehicleRequest request) {
        Vehicle vehicle = getEntity(id);
        String plate = request.licensePlate().trim().toUpperCase();
        if (!vehicle.getLicensePlate().equals(plate) && vehicleRepository.existsByLicensePlate(plate)) {
            throw new BusinessRuleException("License plate already registered: " + plate);
        }
        VehicleMapper.updateEntity(vehicle, request);
        return VehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional
    public void delete(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle", id);
        }
        vehicleRepository.deleteById(id);
    }
    public List<Vehicle> findAllEntities() {
        return vehicleRepository.findAll();
    }
}
