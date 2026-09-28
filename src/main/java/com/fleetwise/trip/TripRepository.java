package com.fleetwise.trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByVehicleId(Long vehicleId);

    List<Trip> findByDriverId(Long driverId);

    List<Trip> findByVehicleIdAndDateBetween(Long vehicleId, LocalDate from, LocalDate to);

    @Query("""
    SELECT t FROM Trip t
    WHERE t.date >= :from AND t.date <= :to
    """)
    List<Trip> findByDateBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("""
    SELECT COALESCE(SUM(t.distance), 0) FROM Trip t
    WHERE t.vehicle.id = :vehicleId
      AND t.date >= :from AND t.date <= :to
    """)
    Integer sumDistanceByVehicleAndPeriod(
            @Param("vehicleId") Long vehicleId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Query("""
    SELECT COALESCE(SUM(t.distance), 0) FROM Trip t
    WHERE t.date >= :from AND t.date <= :to
    """)
    Integer sumDistanceByPeriod(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
}


