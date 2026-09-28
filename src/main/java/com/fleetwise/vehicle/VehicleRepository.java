package com.fleetwise.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByLicensePlate(String licensePlate);

    List<Vehicle> findByCompanyId(Long companyId);

    Optional<Vehicle> findByIdAndCompanyId(Long id, Long companyId);
}
