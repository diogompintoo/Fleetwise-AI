package com.fleetwise.trip;

import com.fleetwise.trip.dto.CreateTripRequest;
import com.fleetwise.trip.dto.TripResponse;
import com.fleetwise.trip.dto.UpdateTripRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ResponseEntity<List<TripResponse>> findAll(
            @RequestParam(required = false) Long vehicleId) {
        if (vehicleId != null) {
            return ResponseEntity.ok(tripService.findByVehicle(vehicleId));
        }
        return ResponseEntity.ok(tripService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TripResponse> create(@Valid @RequestBody CreateTripRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTripRequest request) {
        return ResponseEntity.ok(tripService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tripService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
