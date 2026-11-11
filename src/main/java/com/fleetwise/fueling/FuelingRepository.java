package com.fleetwise.fueling;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FuelingRepository extends JpaRepository<Fueling, Long> {

    @Query("SELECT f FROM Fueling f JOIN FETCH f.vehicle v")
    List<Fueling> findAllWithVehicle();

    @Query("SELECT f FROM Fueling f JOIN FETCH f.vehicle v WHERE f.vehicle.id = :vehicleId")
    List<Fueling> findByVehicleIdWithVehicle(@Param("vehicleId") Long vehicleId);

    @Query("SELECT f FROM Fueling f JOIN FETCH f.vehicle v WHERE f.id = :id")
    Optional<Fueling> findByIdWithVehicle(@Param("id") Long id);

    List<Fueling> findByVehicleId(Long vehicleId);

    List<Fueling> findByVehicleIdAndDateBetween(Long vehicleId, LocalDate from, LocalDate to);

    @Query("""
    SELECT f FROM Fueling f
    WHERE f.date >= :from AND f.date <= :to
    """)
    List<Fueling> findByDateBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("""
    SELECT COALESCE(SUM(f.liters), 0) FROM Fueling f
    WHERE f.vehicle.id = :vehicleId
      AND f.date >= :from AND f.date <= :to
    """)
    BigDecimal sumLitersByVehicleAndPeriod(
            @Param("vehicleId") Long vehicleId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Query("""
    SELECT COALESCE(SUM(f.totalCost), 0) FROM Fueling f
    WHERE f.vehicle.id = :vehicleId
      AND f.date >= :from AND f.date <= :to
    """)
    BigDecimal sumCostByVehicleAndPeriod(
            @Param("vehicleId") Long vehicleId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Query("""
    SELECT COALESCE(SUM(f.liters), 0) FROM Fueling f
    WHERE f.date >= :from AND f.date <= :to
    """)
    BigDecimal sumLitersByPeriod(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Query("""
    SELECT COALESCE(SUM(f.totalCost), 0) FROM Fueling f
    WHERE f.date >= :from AND f.date <= :to
    """)
    BigDecimal sumCostByPeriod(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
}
