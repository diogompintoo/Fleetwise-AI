package com.fleetwise.maintenance;

import com.fleetwise.maintenance.dto.CreateMaintenanceRequest;
import com.fleetwise.maintenance.dto.MaintenanceResponse;
import com.fleetwise.maintenance.dto.UpdateMaintenanceRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenances")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceResponse>> findAll(
            @RequestParam(required = false) Long vehicleId) {
        if (vehicleId != null) {
            return ResponseEntity.ok(maintenanceService.findByVehicle(vehicleId));
        }
        return ResponseEntity.ok(maintenanceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.findById(id));
    }

    @PostMapping
    public ResponseEntity<MaintenanceResponse> create(@Valid @RequestBody CreateMaintenanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
