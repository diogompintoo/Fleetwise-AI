package com.fleetwise.analytics.dto;

import java.math.BigDecimal;

public record MetricVariation(
        BigDecimal currentValue,
        BigDecimal previousValue,
        BigDecimal variationPercent
) {}