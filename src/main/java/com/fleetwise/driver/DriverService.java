package com.fleetwise.driver;

import com.fleetwise.common.exception.BusinessRuleException;
import com.fleetwise.common.exception.ResourceNotFoundException;
import com.fleetwise.company.Company;
import com.fleetwise.company.CompanyService;
import com.fleetwise.driver.dto.CreateDriverRequest;
import com.fleetwise.driver.dto.DriverResponse;
import com.fleetwise.driver.dto.UpdateDriverRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DriverService {

    private final DriverRepository driverRepository;
    private final CompanyService companyService;

    public List<DriverResponse> findAll() {
        return driverRepository.findAll().stream().map(DriverMapper::toResponse).toList();
    }

    public List<DriverResponse> findByCompany(Long companyId) {
        companyService.getEntity(companyId);
        return driverRepository.findByCompanyId(companyId).stream()
                .map(DriverMapper::toResponse)
                .toList();
    }

    public DriverResponse findById(Long id) {
        return DriverMapper.toResponse(getEntity(id));
    }

    public Driver getEntity(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", id));
    }

    @Transactional
    public DriverResponse create(CreateDriverRequest request) {
        Company company = companyService.getEntity(request.companyId());
        String license = request.license().trim().toUpperCase();
        if (driverRepository.existsByLicense(license)) {
            throw new BusinessRuleException("Driver license already registered: " + license);
        }
        Driver saved = driverRepository.save(DriverMapper.toEntity(request, company));
        return DriverMapper.toResponse(saved);
    }

    @Transactional
    public DriverResponse update(Long id, UpdateDriverRequest request) {
        Driver driver = getEntity(id);
        String license = request.license().trim().toUpperCase();
        if (!driver.getLicense().equals(license) && driverRepository.existsByLicense(license)) {
            throw new BusinessRuleException("Driver license already registered: " + license);
        }
        DriverMapper.updateEntity(driver, request);
        return DriverMapper.toResponse(driverRepository.save(driver));
    }

    @Transactional
    public void delete(Long id) {
        if (!driverRepository.existsById(id)) {
            throw new ResourceNotFoundException("Driver", id);
        }
        driverRepository.deleteById(id);
    }
}
