package com.fleetwise.analytics;

import com.fleetwise.analytics.dto.AnomalyResponse;
import com.fleetwise.analytics.dto.FleetAnalyticsResponse;
import com.fleetwise.analytics.dto.VehicleAnalyticsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/fleet")
    public ResponseEntity<FleetAnalyticsResponse> fleet(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(analyticsService.getFleetAnalytics(from, to));
    }

    @GetMapping("/vehicles/{id}")
    public ResponseEntity<VehicleAnalyticsResponse> vehicle(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(analyticsService.getVehicleAnalytics(id, from, to));
    }

    @GetMapping("/anomalies")
    public ResponseEntity<List<AnomalyResponse>> anomalies(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "15") BigDecimal threshold) {
        return ResponseEntity.ok(analyticsService.detectAnomalies(from, to, threshold));
    }
}