package com.fleetwise.ai;

import com.fleetwise.analytics.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiInsightController {

    private final GeminiService geminiService;
    private final AnalyticsService analyticsService;

    @GetMapping("/insights")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<AiInsightResponse> getInsights(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        var fleet = analyticsService.getFleetAnalytics(from, to);
        var anomalies = analyticsService.detectAnomalies(from, to, BigDecimal.valueOf(15));

        String prompt = """
            You are a fleet management AI assistant. Analyse the following fleet data and provide
            3 concise, actionable insights in English to help reduce costs and improve efficiency.
            Be specific and data-driven. Format as bullet points starting with •

            Fleet Data for period %s to %s:
            - Total distance: %d km
            - Total fuel cost: €%s
            - Average cost per km: €%s
            - Average consumption: %s L/100km
            - Total liters consumed: %s L
            - Anomalies detected: %d vehicle(s) with >15%% consumption variation

            Provide 3 actionable insights:
            """.formatted(
                from, to,
                fleet.totalDistanceKm() != null ? fleet.totalDistanceKm() : 0,
                fleet.totalFuelCost() != null ? fleet.totalFuelCost() : "N/A",
                fleet.costPerKm() != null ? fleet.costPerKm() : "N/A",
                fleet.averageConsumption() != null ? fleet.averageConsumption() : "N/A",
                fleet.totalLiters() != null ? fleet.totalLiters() : "N/A",
                anomalies != null ? anomalies.size() : 0
        );

        String insight = geminiService.generateInsight(prompt);

        return ResponseEntity.ok(new AiInsightResponse(
            from,
            to,
            insight,
            anomalies != null ? anomalies.size() : 0
        ));
    }
}