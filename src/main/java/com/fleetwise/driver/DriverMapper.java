package com.fleetwise.driver;

import com.fleetwise.company.Company;
import com.fleetwise.driver.dto.CreateDriverRequest;
import com.fleetwise.driver.dto.DriverResponse;
import com.fleetwise.driver.dto.UpdateDriverRequest;

public final class DriverMapper {

    private DriverMapper() {}

    public static Driver toEntity(CreateDriverRequest request, Company company) {
        return Driver.builder()
                .company(company)
                .name(request.name().trim())
                .license(request.license().trim().toUpperCase())
                .active(true)
                .build();
    }

    public static void updateEntity(Driver driver, UpdateDriverRequest request) {
        driver.setName(request.name().trim());
        driver.setLicense(request.license().trim().toUpperCase());
        driver.setActive(request.active());
    }

    public static DriverResponse toResponse(Driver driver) {
        return new DriverResponse(
                driver.getId(),
                driver.getCompany().getId(),
                driver.getName(),
                driver.getLicense(),
                driver.getActive()
        );
    }
}
