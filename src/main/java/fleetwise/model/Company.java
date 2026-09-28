package fleetwise.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "companies")
@Data
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String taxNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles;
}