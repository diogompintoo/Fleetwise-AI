package com.fleetwise.company.dto;

import java.time.Instant;

public record CompanyResponse(
        Long id,
        String name,
        String taxNumber,
        Instant createdAt
) {}
