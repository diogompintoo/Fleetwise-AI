package com.fleetwise.company;

import com.fleetwise.company.dto.CompanyResponse;
import com.fleetwise.company.dto.CreateCompanyRequest;
import com.fleetwise.company.dto.UpdateCompanyRequest;

public final class CompanyMapper {

    private CompanyMapper() {}

    public static Company toEntity(CreateCompanyRequest request) {
        return Company.builder()
                .name(request.name().trim())
                .taxNumber(request.taxNumber().trim())
                .build();
    }

    public static void updateEntity(Company company, UpdateCompanyRequest request) {
        company.setName(request.name().trim());
        company.setTaxNumber(request.taxNumber().trim());
    }

    public static CompanyResponse toResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getTaxNumber(),
                company.getCreatedAt()
        );
    }
}
