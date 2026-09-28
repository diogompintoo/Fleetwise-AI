package com.fleetwise.fueling;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FuelingRepository extends JpaRepository<Fueling, Long> {

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
