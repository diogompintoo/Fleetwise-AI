package com.fleetwise.driver.dto;

public record DriverResponse(
        Long id,
        Long companyId,
        String name,
        String license,
        Boolean active
) {}
