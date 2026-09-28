package com.fleetwise.company;

import com.fleetwise.common.exception.BusinessRuleException;
import com.fleetwise.common.exception.ResourceNotFoundException;
import com.fleetwise.company.dto.CompanyResponse;
import com.fleetwise.company.dto.CreateCompanyRequest;
import com.fleetwise.company.dto.UpdateCompanyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<CompanyResponse> findAll() {
        return companyRepository.findAll().stream()
                .map(CompanyMapper::toResponse)
                .toList();
    }

    public CompanyResponse findById(Long id) {
        return CompanyMapper.toResponse(getEntity(id));
    }

    public Company getEntity(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", id));
    }

    @Transactional
    public CompanyResponse create(CreateCompanyRequest request) {
        if (companyRepository.existsByTaxNumber(request.taxNumber().trim())) {
            throw new BusinessRuleException("Tax number already in use: " + request.taxNumber());
        }
        if (companyRepository.existsByName(request.name().trim())) {
            throw new BusinessRuleException("Company name already in use: " + request.name());
        }
        Company saved = companyRepository.save(CompanyMapper.toEntity(request));
        return CompanyMapper.toResponse(saved);
    }

    @Transactional
    public CompanyResponse update(Long id, UpdateCompanyRequest request) {
        Company company = getEntity(id);
        if (!company.getTaxNumber().equals(request.taxNumber().trim())
                && companyRepository.existsByTaxNumber(request.taxNumber().trim())) {
            throw new BusinessRuleException("Tax number already in use: " + request.taxNumber());
        }
        CompanyMapper.updateEntity(company, request);
        return CompanyMapper.toResponse(companyRepository.save(company));
    }

    @Transactional
    public void delete(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company", id);
        }
        companyRepository.deleteById(id);
    }
}
