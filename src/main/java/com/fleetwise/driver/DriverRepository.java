package com.fleetwise.driver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    boolean existsByLicense(String license);

    List<Driver> findByCompanyId(Long companyId);
}
