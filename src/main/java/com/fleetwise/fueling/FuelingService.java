package com.fleetwise.fueling;

import com.fleetwise.common.exception.BusinessRuleException;
import com.fleetwise.common.exception.ResourceNotFoundException;
import com.fleetwise.fueling.dto.CreateFuelingRequest;
import com.fleetwise.fueling.dto.FuelingResponse;
import com.fleetwise.fueling.dto.UpdateFuelingRequest;
import com.fleetwise.vehicle.Vehicle;
import com.fleetwise.vehicle.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FuelingService {

    private final FuelingRepository fuelingRepository;
    private final VehicleService vehicleService;

    public List<FuelingResponse> findAll() {
        return fuelingRepository.findAll().stream().map(FuelingMapper::toResponse).toList();
    }

    public List<FuelingResponse> findByVehicle(Long vehicleId) {
        vehicleService.getEntity(vehicleId);
        return fuelingRepository.findByVehicleId(vehicleId).stream()
                .map(FuelingMapper::toResponse)
                .toList();
    }

    public FuelingResponse findById(Long id) {
        return FuelingMapper.toResponse(getEntity(id));
    }

    public Fueling getEntity(Long id) {
        return fuelingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fueling", id));
    }

    @Transactional
    public FuelingResponse create(CreateFuelingRequest request) {
        Vehicle vehicle = vehicleService.getEntity(request.vehicleId());
        if (!vehicle.getActive()) {
            throw new BusinessRuleException("Cannot register fueling for inactive vehicle");
        }
        BigDecimal totalCost = FuelingMapper.calculateTotalCost(request.liters(), request.pricePerLiter());
        Fueling saved = fuelingRepository.save(FuelingMapper.toEntity(request, vehicle, totalCost));
        return FuelingMapper.toResponse(saved);
    }

    @Transactional
    public FuelingResponse update(Long id, UpdateFuelingRequest request) {
        Fueling fueling = getEntity(id);
        BigDecimal totalCost = FuelingMapper.calculateTotalCost(request.liters(), request.pricePerLiter());
        FuelingMapper.updateEntity(fueling, request, totalCost);
        return FuelingMapper.toResponse(fuelingRepository.save(fueling));
    }

    @Transactional
    public void delete(Long id) {
        if (!fuelingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fueling", id);
        }
        fuelingRepository.deleteById(id);
    }
}
