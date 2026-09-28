package fleetwise.service;

import fleetwise.model.Company;
import fleetwise.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<Company> findAll() {
        return companyRepository.findAll();
    }

    public Company findById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
    }

    public Company save(Company company) {
        if (companyRepository.existsByEmail(company.getEmail())) {
            throw new RuntimeException("Email already in use: " + company.getEmail());
        }
        if (companyRepository.existsByTaxNumber(company.getTaxNumber())) {
            throw new RuntimeException("Tax number already in use: " + company.getTaxNumber());
        }
        return companyRepository.save(company);
    }

    public Company update(Long id, Company updated) {
        Company existing = findById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setTaxNumber(updated.getTaxNumber());
        return companyRepository.save(existing);
    }

    public void delete(Long id) {
        companyRepository.deleteById(id);
    }
}