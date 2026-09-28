package fleetwise.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String licensePlate;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String fuelType;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<Trip> trips;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<FuelEntry> fuelEntries;
}