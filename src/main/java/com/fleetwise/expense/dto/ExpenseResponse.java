package com.fleetwise.expense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        Long vehicleId,
        LocalDate date,
        String type,
        String description,
        BigDecimal amount
) {}
