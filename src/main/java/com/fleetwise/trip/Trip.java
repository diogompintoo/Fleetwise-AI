package com.fleetwise.trip;

import com.fleetwise.driver.Driver;
import com.fleetwise.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 255)
    private String startLocation;

    @Column(nullable = false, length = 255)
    private String endLocation;

    @Column(nullable = false)
    private Integer startMileage;

    @Column(nullable = false)
    private Integer endMileage;

    /**
     * Always derived: endMileage - startMileage.
     * Never accepted from the client.
     */
    @Column(nullable = false)
    private Integer distance;

    @Column(length = 500)
    private String purpose;
}
