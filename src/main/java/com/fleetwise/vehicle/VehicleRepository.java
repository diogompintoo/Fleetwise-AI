package com.fleetwise.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByLicensePlate(String licensePlate);

    Optional<Vehicle> findByIdAndCompanyId(Long id, Long companyId);

    @Query("SELECT v FROM Vehicle v JOIN FETCH v.company")
    List<Vehicle> findAllWithCompany();

    @Query("SELECT v FROM Vehicle v JOIN FETCH v.company WHERE v.company.id = :companyId")
    List<Vehicle> findByCompanyIdWithCompany(@Param("companyId") Long companyId);

    @Query("SELECT v FROM Vehicle v JOIN FETCH v.company WHERE v.id = :id")
    Optional<Vehicle> findByIdWithCompany(@Param("id") Long id);
}