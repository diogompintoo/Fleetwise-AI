package com.fleetwise.ai;

import java.time.LocalDate;

public record AiInsightResponse(
        LocalDate from,
        LocalDate to,
        String insight,
        int anomaliesDetected
) {}