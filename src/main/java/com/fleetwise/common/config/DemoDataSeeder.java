package com.fleetwise.common.config;

import com.fleetwise.company.Company;
import com.fleetwise.company.CompanyRepository;
import com.fleetwise.driver.Driver;
import com.fleetwise.driver.DriverRepository;
import com.fleetwise.fueling.Fueling;
import com.fleetwise.fueling.FuelingRepository;
import com.fleetwise.trip.Trip;
import com.fleetwise.trip.TripRepository;
import com.fleetwise.vehicle.Vehicle;
import com.fleetwise.vehicle.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DemoDataSeeder implements ApplicationRunner {

    private final CompanyRepository companyRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final FuelingRepository fuelingRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // Se já há veículos, assume seed completo
        if (vehicleRepository.count() > 0) {
            log.info("Demo seed skipped: vehicles already present ({})", vehicleRepository.count());
            return;
        }

        log.info("Running demo data seed...");

        Company company = companyRepository.findAll().stream().findFirst()
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name("FleetWise Demo Ltd")
                        .taxNumber("PT500123456")
                        .build()));

        List<Vehicle> vehicles = List.of(
                vehicle("AA-00-01", "Mercedes", "Sprinter", 2021, "DIESEL", 45000, company),
                vehicle("BB-11-22", "Volkswagen", "Crafter", 2020, "DIESEL", 62000, company),
                vehicle("CC-33-44", "Toyota", "Corolla", 2022, "HYBRID", 28000, company),
                vehicle("DD-55-66", "Renault", "Master", 2019, "DIESEL", 89000, company),
                vehicle("EE-77-88", "Peugeot", "Partner", 2023, "DIESEL", 12000, company)
        );
        vehicles = vehicleRepository.saveAll(vehicles);

        List<Driver> drivers = List.of(
                driver("João Silva", "P-1234567", company),
                driver("Maria Santos", "P-7654321", company),
                driver("Pedro Costa", "P-1122334", company)
        );
        drivers = driverRepository.saveAll(drivers);

        LocalDate today = LocalDate.now();

        // Trips (últimos ~30 dias)
        saveTrip(vehicles.get(0), drivers.get(0), today.minusDays(2), "Lisboa", "Porto", 45000, 45320);
        saveTrip(vehicles.get(0), drivers.get(0), today.minusDays(8), "Porto", "Lisboa", 45320, 45640);
        saveTrip(vehicles.get(1), drivers.get(1), today.minusDays(3), "Lisboa", "Faro", 62000, 62380);
        saveTrip(vehicles.get(1), drivers.get(1), today.minusDays(12), "Faro", "Lisboa", 62380, 62750);
        saveTrip(vehicles.get(2), drivers.get(2), today.minusDays(1), "Lisboa", "Coimbra", 28000, 28200);
        saveTrip(vehicles.get(2), drivers.get(2), today.minusDays(15), "Coimbra", "Lisboa", 28200, 28410);
        saveTrip(vehicles.get(3), drivers.get(0), today.minusDays(5), "Lisboa", "Évora", 89000, 89140);
        saveTrip(vehicles.get(4), drivers.get(1), today.minusDays(4), "Lisboa", "Setúbal", 12000, 12055);

        // Fuelings
        saveFueling(vehicles.get(0), today.minusDays(2), 45320, "48.5", "1.65", "Galp Lisboa");
        saveFueling(vehicles.get(0), today.minusDays(20), 44800, "52.0", "1.62", "BP Porto");
        saveFueling(vehicles.get(1), today.minusDays(3), 62380, "55.0", "1.68", "Repsol Faro");
        saveFueling(vehicles.get(1), today.minusDays(18), 61800, "50.0", "1.60", "Galp Lisboa");
        saveFueling(vehicles.get(2), today.minusDays(1), 28200, "30.0", "1.55", "Prio Coimbra");
        saveFueling(vehicles.get(3), today.minusDays(5), 89140, "60.0", "1.70", "Galp Évora");
        saveFueling(vehicles.get(4), today.minusDays(4), 12055, "35.0", "1.64", "BP Setúbal");

        // Período anterior (para variações/anomalias nos insights)
        saveTrip(vehicles.get(0), drivers.get(0), today.minusDays(40), "Lisboa", "Braga", 44000, 44400);
        saveFueling(vehicles.get(0), today.minusDays(40), 44400, "40.0", "1.58", "Galp Braga");
        saveTrip(vehicles.get(1), drivers.get(1), today.minusDays(45), "Lisboa", "Aveiro", 61000, 61300);
        saveFueling(vehicles.get(1), today.minusDays(45), 61300, "42.0", "1.59", "Repsol Aveiro");

        log.info("Demo seed completed: company={}, vehicles={}, drivers={}, trips={}, fuelings={}",
                company.getName(),
                vehicleRepository.count(),
                driverRepository.count(),
                tripRepository.count(),
                fuelingRepository.count());
    }

    private Vehicle vehicle(String plate, String brand, String model, int year,
                            String fuel, int mileage, Company company) {
        return Vehicle.builder()
                .company(company)
                .licensePlate(plate)
                .brand(brand)
                .model(model)
                .manufactureYear(year)
                .fuelType(fuel)
                .initialMileage(mileage)
                .active(true)
                .build();
    }

    private Driver driver(String name, String license, Company company) {
        return Driver.builder()
                .company(company)
                .name(name)
                .license(license)
                .active(true)
                .build();
    }

    private void saveTrip(Vehicle v, Driver d, LocalDate date, String from, String to,
                          int startKm, int endKm) {
        tripRepository.save(Trip.builder()
                .vehicle(v)
                .driver(d)
                .date(date)
                .startLocation(from)
                .endLocation(to)
                .startMileage(startKm)
                .endMileage(endKm)
                .distance(endKm - startKm)
                .purpose("Demo route")
                .build());
    }

    private void saveFueling(Vehicle v, LocalDate date, int odometer,
                             String liters, String price, String station) {
        BigDecimal l = new BigDecimal(liters);
        BigDecimal p = new BigDecimal(price);
        fuelingRepository.save(Fueling.builder()
                .vehicle(v)
                .date(date)
                .odometer(odometer)
                .liters(l)
                .pricePerLiter(p)
                .totalCost(l.multiply(p).setScale(2, RoundingMode.HALF_UP))
                .fuelStation(station)
                .build());
    }
}