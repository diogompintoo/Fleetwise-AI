package com.fleetwise.maintenance;

import com.fleetwise.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "maintenances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer mileage;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal cost;
}
