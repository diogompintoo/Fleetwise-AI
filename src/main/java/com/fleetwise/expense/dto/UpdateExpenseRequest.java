package com.fleetwise.expense.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateExpenseRequest(
        @NotNull LocalDate date,
        @NotBlank @Size(max = 50) String type,
        @Size(max = 500) String description,
        @NotNull @DecimalMin("0.01") BigDecimal amount
) {}
