package com.fleetwise.driver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    boolean existsByLicense(String license);

    List<Driver> findByCompanyId(Long companyId);

    @Query("SELECT d FROM Driver d JOIN FETCH d.company")
    List<Driver> findAllWithCompany();

    @Query("SELECT d FROM Driver d JOIN FETCH d.company WHERE d.company.id = :companyId")
    List<Driver> findByCompanyIdWithCompany(@Param("companyId") Long companyId);

    @Query("SELECT d FROM Driver d JOIN FETCH d.company WHERE d.id = :id")
    Optional<Driver> findByIdWithCompany(@Param("id") Long id);
}
