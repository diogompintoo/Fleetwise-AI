package com.fleetwise.driver.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateDriverRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 200)
        String name,

        @NotBlank(message = "License is required")
        @Size(max = 50)
        String license,

        @NotNull(message = "Active flag is required")
        Boolean active
) {}
