package com.fleetwise.fueling;

import com.fleetwise.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fuelings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fueling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Integer odometer;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal liters;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal pricePerLiter;

    /**
     * Always derived: liters * pricePerLiter.
     * Never accepted from the client.
     */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCost;

    @Column(length = 200)
    private String fuelStation;
}
