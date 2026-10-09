package com.fleetwise.analytics;

import com.fleetwise.analytics.dto.*;
import com.fleetwise.common.exception.BusinessRuleException;
import com.fleetwise.fueling.FuelingRepository;
import com.fleetwise.trip.TripRepository;
import com.fleetwise.vehicle.Vehicle;
import com.fleetwise.vehicle.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private static final int SCALE = 3;
    private static final RoundingMode ROUNDING = RoundingMode.HALF_UP;
    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    private final TripRepository tripRepository;
    private final FuelingRepository fuelingRepository;
    private final VehicleService vehicleService;

    public FleetAnalyticsResponse getFleetAnalytics(LocalDate from, LocalDate to) {
        validatePeriod(from, to);

        int distance = nullToZero(tripRepository.sumDistanceByPeriod(from, to));
        BigDecimal liters = nullToZero(fuelingRepository.sumLitersByPeriod(from, to));
        BigDecimal cost = nullToZero(fuelingRepository.sumCostByPeriod(from, to));

        BigDecimal consumption = calculateConsumption(liters, distance);
        BigDecimal costPerKm = calculateCostPerKm(cost, distance);
        BigDecimal avgPrice = calculateAverageFuelPrice(cost, liters);

        Period previous = previousPeriod(from, to);
        int prevDistance = nullToZero(tripRepository.sumDistanceByPeriod(previous.from(), previous.to()));
        BigDecimal prevLiters = nullToZero(fuelingRepository.sumLitersByPeriod(previous.from(), previous.to()));
        BigDecimal prevCost = nullToZero(fuelingRepository.sumCostByPeriod(previous.from(), previous.to()));
        BigDecimal prevConsumption = calculateConsumption(prevLiters, prevDistance);

        return new FleetAnalyticsResponse(
                from, to,
                distance, liters, cost,
                consumption, costPerKm, avgPrice,
                variation(consumption, prevConsumption),
                variation(cost, prevCost),
                variation(BigDecimal.valueOf(distance), BigDecimal.valueOf(prevDistance))
        );
    }

    public VehicleAnalyticsResponse getVehicleAnalytics(Long vehicleId, LocalDate from, LocalDate to) {
        validatePeriod(from, to);
        Vehicle vehicle = vehicleService.getEntity(vehicleId);

        int distance = nullToZero(tripRepository.sumDistanceByVehicleAndPeriod(vehicleId, from, to));
        BigDecimal liters = nullToZero(fuelingRepository.sumLitersByVehicleAndPeriod(vehicleId, from, to));
        BigDecimal cost = nullToZero(fuelingRepository.sumCostByVehicleAndPeriod(vehicleId, from, to));

        BigDecimal consumption = calculateConsumption(liters, distance);
        BigDecimal costPerKm = calculateCostPerKm(cost, distance);
        BigDecimal avgPrice = calculateAverageFuelPrice(cost, liters);

        Period previous = previousPeriod(from, to);
        int prevDistance = nullToZero(tripRepository.sumDistanceByVehicleAndPeriod(vehicleId, previous.from(), previous.to()));
        BigDecimal prevLiters = nullToZero(fuelingRepository.sumLitersByVehicleAndPeriod(vehicleId, previous.from(), previous.to()));
        BigDecimal prevCost = nullToZero(fuelingRepository.sumCostByVehicleAndPeriod(vehicleId, previous.from(), previous.to()));
        BigDecimal prevConsumption = calculateConsumption(prevLiters, prevDistance);

        return new VehicleAnalyticsResponse(
                vehicle.getId(),
                vehicle.getLicensePlate(),
                from, to,
                distance, liters, cost,
                consumption, costPerKm, avgPrice,
                variation(consumption, prevConsumption),
                variation(cost, prevCost),
                variation(BigDecimal.valueOf(distance), BigDecimal.valueOf(prevDistance))
        );
    }

    /**
     * Anomaly = current consumption vs previous period consumption
     * when |variation| > thresholdPercent.
     */
    public List<AnomalyResponse> detectAnomalies(LocalDate from, LocalDate to, BigDecimal thresholdPercent) {
        validatePeriod(from, to);
        if (thresholdPercent == null || thresholdPercent.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Threshold must be greater than 0");
        }

        List<AnomalyResponse> anomalies = new ArrayList<>();
        Period previous = previousPeriod(from, to);

        for (Vehicle vehicle : vehicleService.findAllEntities()) {
            if (!Boolean.TRUE.equals(vehicle.getActive())) {
                continue;
            }

            int distance = nullToZero(tripRepository.sumDistanceByVehicleAndPeriod(vehicle.getId(), from, to));
            BigDecimal liters = nullToZero(fuelingRepository.sumLitersByVehicleAndPeriod(vehicle.getId(), from, to));
            BigDecimal current = calculateConsumption(liters, distance);

            int prevDistance = nullToZero(tripRepository.sumDistanceByVehicleAndPeriod(
                    vehicle.getId(), previous.from(), previous.to()));
            BigDecimal prevLiters = nullToZero(fuelingRepository.sumLitersByVehicleAndPeriod(
                    vehicle.getId(), previous.from(), previous.to()));
            BigDecimal baseline = calculateConsumption(prevLiters, prevDistance);

            if (current == null || baseline == null || baseline.compareTo(BigDecimal.ZERO) == 0) {
                continue;
            }

            BigDecimal variationPct = percentChange(current, baseline);
            if (variationPct.abs().compareTo(thresholdPercent) > 0) {
                String direction = variationPct.compareTo(BigDecimal.ZERO) > 0 ? "increased" : "decreased";
                anomalies.add(new AnomalyResponse(
                        vehicle.getId(),
                        vehicle.getLicensePlate(),
                        "CONSUMPTION",
                        current,
                        baseline,
                        variationPct,
                        thresholdPercent,
                        "Vehicle " + vehicle.getLicensePlate()
                                + " consumption " + direction + " "
                                + variationPct.abs().setScale(1, ROUNDING) + "% vs previous period"
                ));
            }
        }
        return anomalies;
    }

   public List<InsightResponse> generateInsights(LocalDate from, LocalDate to) {
    validatePeriod(from, to);

    List<InsightResponse> insights = new ArrayList<>();

    FleetAnalyticsResponse fleet = getFleetAnalytics(from, to);
    List<AnomalyResponse> anomalies = detectAnomalies(from, to, BigDecimal.valueOf(15));

    // 1. Fleet efficiency
    if (fleet.averageConsumption() != null) {
        insights.add(new InsightResponse(
                "INFO",
                "EFFICIENCY",
                "Fleet efficiency baseline",
                "Average fleet fuel consumption is "
                        + fleet.averageConsumption().setScale(2, ROUNDING)
                        + " L/100km for the selected period."
        ));
    }

    // 2. Cost per km
    if (fleet.costPerKm() != null) {
        insights.add(new InsightResponse(
                "INFO",
                "COST",
                "Operating cost indicator",
                "Current fleet fuel cost is €"
                        + fleet.costPerKm().setScale(3, ROUNDING)
                        + " per kilometre."
        ));
    }

    // 3. Cost variation
    if (fleet.costVariation() != null && fleet.costVariation().variationPercent() != null) {
        BigDecimal pct = fleet.costVariation().variationPercent();
        String direction = pct.compareTo(BigDecimal.ZERO) >= 0 ? "increased" : "decreased";
        String severity = pct.abs().compareTo(BigDecimal.valueOf(10)) > 0 ? "WARNING" : "INFO";

        insights.add(new InsightResponse(
                severity,
                "COST",
                "Fuel cost trend",
                "Total fuel cost " + direction + " by "
                        + pct.abs().setScale(1, ROUNDING)
                        + "% compared to the previous period."
        ));
    }

    // 4. Anomalies
    if (!anomalies.isEmpty()) {
        insights.add(new InsightResponse(
                anomalies.size() >= 3 ? "CRITICAL" : "WARNING",
                "ANOMALY",
                "Consumption anomalies detected",
                anomalies.size() + " vehicle(s) show consumption variation above the 15% threshold."
        ));

        AnomalyResponse top = anomalies.get(0);
        insights.add(new InsightResponse(
                "WARNING",
                "ANOMALY",
                "Highest deviation: " + top.licensePlate(),
                top.message()
        ));
    } else {
        insights.add(new InsightResponse(
                "INFO",
                "ANOMALY",
                "No significant anomalies",
                "No vehicles exceeded the 15% consumption variation threshold in this period."
        ));
    }

    // 5. Distance variation
    if (fleet.distanceVariation() != null && fleet.distanceVariation().variationPercent() != null) {
        BigDecimal pct = fleet.distanceVariation().variationPercent();
        String direction = pct.compareTo(BigDecimal.ZERO) >= 0 ? "up" : "down";
        int distance = fleet.totalDistanceKm() != null ? fleet.totalDistanceKm() : 0;

        insights.add(new InsightResponse(
                "INFO",
                "FLEET",
                "Activity level",
                "Total distance driven is " + direction + " "
                        + pct.abs().setScale(1, ROUNDING)
                        + "% versus the previous period ("
                        + distance + " km)."
        ));
    }

    return insights;
} 


    /** L/100km = (liters / km) * 100 */
    BigDecimal calculateConsumption(BigDecimal liters, int distanceKm) {
        if (distanceKm <= 0 || liters == null || liters.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }
        return liters
                .multiply(HUNDRED)
                .divide(BigDecimal.valueOf(distanceKm), SCALE, ROUNDING);
    }

    /** cost / km */
    BigDecimal calculateCostPerKm(BigDecimal cost, int distanceKm) {
        if (distanceKm <= 0 || cost == null || cost.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }
        return cost.divide(BigDecimal.valueOf(distanceKm), SCALE, ROUNDING);
    }

    /** totalCost / totalLiters */
    BigDecimal calculateAverageFuelPrice(BigDecimal cost, BigDecimal liters) {
        if (liters == null || liters.compareTo(BigDecimal.ZERO) <= 0
                || cost == null || cost.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }
        return cost.divide(liters, SCALE, ROUNDING);
    }

    MetricVariation variation(BigDecimal current, BigDecimal previous) {
        return new MetricVariation(
                current,
                previous,
                percentChange(current, previous)
        );
    }

    BigDecimal percentChange(BigDecimal current, BigDecimal previous) {
        if (current == null || previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }
        return current.subtract(previous)
                .multiply(HUNDRED)
                .divide(previous, SCALE, ROUNDING);
    }

    // ---------- helpers ----------

    private void validatePeriod(LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            throw new BusinessRuleException("Both from and to dates are required");
        }
        if (from.isAfter(to)) {
            throw new BusinessRuleException("from must be before or equal to to");
        }
    }

    private Period previousPeriod(LocalDate from, LocalDate to) {
        long days = ChronoUnit.DAYS.between(from, to) + 1;
        LocalDate prevTo = from.minusDays(1);
        LocalDate prevFrom = prevTo.minusDays(days - 1);
        return new Period(prevFrom, prevTo);
    }

    private int nullToZero(Integer value) {
        return value == null ? 0 : value;
    }

    private BigDecimal nullToZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private record Period(LocalDate from, LocalDate to) {}
}
