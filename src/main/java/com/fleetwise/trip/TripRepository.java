package com.fleetwise.trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query("SELECT t FROM Trip t JOIN FETCH t.vehicle v JOIN FETCH t.driver d")
    List<Trip> findAllWithVehicleAndDriver();

    @Query("SELECT t FROM Trip t JOIN FETCH t.vehicle v JOIN FETCH t.driver d WHERE t.vehicle.id = :vehicleId")
    List<Trip> findByVehicleIdWithVehicleAndDriver(@Param("vehicleId") Long vehicleId);

    @Query("SELECT t FROM Trip t JOIN FETCH t.vehicle v JOIN FETCH t.driver d WHERE t.driver.id = :driverId")
    List<Trip> findByDriverIdWithVehicleAndDriver(@Param("driverId") Long driverId);

    @Query("SELECT t FROM Trip t JOIN FETCH t.vehicle v JOIN FETCH t.driver d WHERE t.id = :id")
    Optional<Trip> findByIdWithVehicleAndDriver(@Param("id") Long id);

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


