package fleetwise.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_entries")
@Data
public class FuelEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Double liters;

    @Column(nullable = false)
    private Double pricePerLiter;

    @Column(nullable = false)
    private Double totalCost;

    @Column(nullable = false)
    private Integer odometerKm;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
}