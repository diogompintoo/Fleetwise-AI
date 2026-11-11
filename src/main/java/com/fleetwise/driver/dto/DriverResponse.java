package com.fleetwise.driver.dto;

public record DriverResponse(
        Long id,
        Long companyId,
        String companyName,
        String name,
        String license,
        Boolean active
) {}
