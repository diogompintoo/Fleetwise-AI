package com.fleetwise.company.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCompanyRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 200, message = "Name must be at most 200 characters")
        String name,

        @NotBlank(message = "Tax number is required")
        @Size(max = 50, message = "Tax number must be at most 50 characters")
        String taxNumber
) {}
