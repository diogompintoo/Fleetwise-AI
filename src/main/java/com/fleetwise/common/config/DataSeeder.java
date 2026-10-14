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
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final FuelingRepository fuelingRepository;

    @Override
    public void run(String... args) {
        if (companyRepository.count() > 0) {
            log.info("Demo data already exists, skipping seed.");
            return;
        }

        log.info("Seeding demo data...");

        Company company = companyRepository.save(Company.builder()
            .name("FleetWise Demo Ltd")
            .taxNumber("PT500123456")
            .build());

        Vehicle v1 = vehicleRepository.save(Vehicle.builder()
            .company(company).licensePlate("AA-00-FW")
            .brand("Mercedes-Benz").model("Sprinter 314")
            .manufactureYear(2022).fuelType("DIESEL").initialMileage(15000).build());

        Vehicle v2 = vehicleRepository.save(Vehicle.builder()
            .company(company).licensePlate("BB-11-FW")
            .brand("Volkswagen").model("Crafter 35")
            .manufactureYear(2021).fuelType("DIESEL").initialMileage(28000).build());

        Vehicle v3 = vehicleRepository.save(Vehicle.builder()
            .company(company).licensePlate("CC-22-FW")
            .brand("Ford").model("Transit Custom")
            .manufactureYear(2023).fuelType("DIESEL").initialMileage(8000).build());

        Driver driver = driverRepository.save(Driver.builder()
            .company(company).name("João Silva")
            .license("C-123456").build());

        LocalDate base = LocalDate.of(2026, 9, 1);

        // Trips — distance calculated manually (endMileage - startMileage)
        saveTrip(v1, driver, base,        15000, 15320, "Lisboa", "Porto", "Delivery");
        saveTrip(v1, driver, base.plusDays(3),  15320, 15680, "Porto",  "Coimbra", "Client visit");
        saveTrip(v1, driver, base.plusDays(6),  15680, 16100, "Coimbra","Lisboa",  "Return");

        saveTrip(v2, driver, base.plusDays(1),  28000, 28410, "Lisboa", "Setúbal", "Delivery");
        saveTrip(v2, driver, base.plusDays(4),  28410, 28790, "Setúbal","Évora",   "Client visit");
        saveTrip(v2, driver, base.plusDays(7),  28790, 29250, "Évora",  "Lisboa",  "Return");

        saveTrip(v3, driver, base.plusDays(2),  8000,  8380,  "Lisboa", "Leiria",  "Delivery");
        saveTrip(v3, driver, base.plusDays(5),  8380,  8710,  "Leiria", "Braga",   "Client visit");
        saveTrip(v3, driver, base.plusDays(8),  8710,  9150,  "Braga",  "Lisboa",  "Return");

        // Fuelings
        saveFueling(v1, base.plusDays(2),  15200, 45.0, 1.689, "Galp Lisboa");
        saveFueling(v1, base.plusDays(8),  15600, 42.0, 1.695, "Repsol Porto");
        saveFueling(v2, base.plusDays(3),  28300, 50.0, 1.689, "BP Setúbal");
        saveFueling(v2, base.plusDays(9),  28900, 48.0, 1.701, "Galp Évora");
        saveFueling(v3, base.plusDays(4),  8200,  38.0, 1.689, "Galp Lisboa");
        saveFueling(v3, base.plusDays(10), 8600,  40.0, 1.695, "Repsol Leiria");

        log.info("Demo data seeded successfully — company, 3 vehicles, 1 driver, 9 trips, 6 fuelings.");
    }

    private void saveTrip(Vehicle vehicle, Driver driver, LocalDate date,
                          int startMileage, int endMileage,
                          String startLocation, String endLocation, String purpose) {
        tripRepository.save(Trip.builder()
            .vehicle(vehicle).driver(driver).date(date)
            .startLocation(startLocation).endLocation(endLocation)
            .startMileage(startMileage).endMileage(endMileage)
            .distance(endMileage - startMileage)
            .purpose(purpose).build());
    }

    private void saveFueling(Vehicle vehicle, LocalDate date, int odometer,
                             double liters, double price, String station) {
        BigDecimal l = BigDecimal.valueOf(liters);
        BigDecimal p = BigDecimal.valueOf(price);
        fuelingRepository.save(Fueling.builder()
            .vehicle(vehicle).date(date).odometer(odometer)
            .liters(l).pricePerLiter(p)
            .totalCost(l.multiply(p).setScale(2, java.math.RoundingMode.HALF_UP))
            .fuelStation(station).build());
    }
}