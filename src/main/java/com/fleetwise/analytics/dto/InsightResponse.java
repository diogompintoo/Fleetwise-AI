package com.fleetwise.analytics.dto;

public record InsightResponse(
        String severity,   // INFO | WARNING | CRITICAL
        String category,   // EFFICIENCY | COST | ANOMALY | FLEET
        String title,
        String message
) {}