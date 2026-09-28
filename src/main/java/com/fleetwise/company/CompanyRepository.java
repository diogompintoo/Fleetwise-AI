package com.fleetwise.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    boolean existsByTaxNumber(String taxNumber);

    boolean existsByName(String name);
}
