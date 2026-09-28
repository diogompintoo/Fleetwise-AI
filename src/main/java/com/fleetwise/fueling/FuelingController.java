package com.fleetwise.fueling;

import com.fleetwise.fueling.dto.CreateFuelingRequest;
import com.fleetwise.fueling.dto.FuelingResponse;
import com.fleetwise.fueling.dto.UpdateFuelingRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fuelings")
@RequiredArgsConstructor
public class FuelingController {

    private final FuelingService fuelingService;

    @GetMapping
    public ResponseEntity<List<FuelingResponse>> findAll(
            @RequestParam(required = false) Long vehicleId) {
        if (vehicleId != null) {
            return ResponseEntity.ok(fuelingService.findByVehicle(vehicleId));
        }
        return ResponseEntity.ok(fuelingService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuelingResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(fuelingService.findById(id));
    }

    @PostMapping
    public ResponseEntity<FuelingResponse> create(@Valid @RequestBody CreateFuelingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fuelingService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuelingResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFuelingRequest request) {
        return ResponseEntity.ok(fuelingService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fuelingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
