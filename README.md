# FleetWise AI

Fleet management platform that centralises vehicle, trip, fuel and expense data and uses AI to help managers identify cost drivers and anomalies.

> Portfolio project focused on demonstrating **how AI assists software development** (time savings, architecture decisions, clean domain design).

---

## Stack

| Layer | Technology |
|-------|------------|
| Language | Java 17 |
| Framework | Spring Boot 3.4 |
| API | Spring Web (REST) |
| Persistence | Spring Data JPA + Hibernate |
| Validation | Bean Validation |
| Security | Spring Security (open in Phase 1; Entra ID later) |
| Database (local) | PostgreSQL 16 |
| Database (prod target) | Azure SQL |
| Build | Maven |

---

## Architecture (current – Phase 1 / 2)

```
Client
  │ HTTPS
  ▼
REST API  (/api/v1/...)
  │
  ├── Company
  ├── Vehicle
  ├── Driver
  ├── Trip          ← distance = endMileage - startMileage (backend only)
  ├── Fueling       ← totalCost = liters × pricePerLiter (backend only)
  ├── Expense
  └── Maintenance
  │
  ▼
PostgreSQL
```

Business rules live in the **service layer**, never in the controller or the client.

---

## Project structure (feature / domain oriented)

```
com.fleetwise
├── common
│   ├── config          SecurityConfig
│   └── exception       ResourceNotFound, BusinessRule, GlobalExceptionHandler
├── company             Entity, Repo, Service, Controller, Mapper, dto/
├── vehicle
├── driver
├── trip
├── fueling
├── expense
└── maintenance
```

## Key engineering decisions

1. **Distance is calculated on the backend**  
   `distance = endMileage - startMileage`. The client only sends the two odometer readings. This prevents tampering and keeps the rule in one place.

2. **Fuel total cost is calculated on the backend**  
   `totalCost = liters × pricePerLiter` (scale 2, HALF_UP).

3. **DTOs + Bean Validation**  
   Entities are never exposed. Requests are validated before they reach the service.

4. **RFC 7807 ProblemDetail**  
   Consistent error responses for 404, 422 (business rules) and 400 (validation).

5. **Feature packages**  
   Ready for the next phases (analytics, AI, reports) without restructuring.


## API overview

| Resource | Base path |
|----------|-----------|
| Companies | `/api/v1/companies` |
| Vehicles | `/api/v1/vehicles` |
| Drivers | `/api/v1/drivers` |
| Trips | `/api/v1/trips` |
| Fuelings | `/api/v1/fuelings` |
| Expenses | `/api/v1/expenses` |
| Maintenances | `/api/v1/maintenances` |

All support standard CRUD. List endpoints accept optional filters (`companyId`, `vehicleId`).

---

## Roadmap

| Phase | Scope | Status |
|-------|--------|--------|
| 0 | Product definition | Done |
| 1 | Database + domain model | **Done (this commit series)** |
| 2 | Spring Boot REST API + business rules | **Done** |
| 3 | Analytics (consumption, cost/km, variation, anomaly rules) | Next |
| 4 | React + TypeScript dashboard | Pending |
| 5 | Auth (Entra ID + RBAC) | Pending |
| 6 | Azure deployment | Pending |
| 7 | Blob Storage + document extraction | Pending |
| 8 | AI assistant (insights, “why?”, NL questions) | Pending |
| 9 | Anomaly detection (rules → ML) | Pending |
| 10 | AI monthly reports (PDF) | Pending |
| 11 | CI/CD (GitHub Actions) | Pending |
| 12 | Monitoring (App Insights) + Key Vault | Pending |
| 13 | Documentation | Ongoing |

---

## Development log – AI-assisted time tracking

This section catalogues work done with AI assistance, so the portfolio can show concrete time savings.

| # | Commit / work | Manual estimate | With AI | Saved | Notes |
|---|----------------|-----------------|---------|-------|-------|
| 1 | Domain model alignment (Company, Vehicle, Driver, Trip, Fueling, Expense, Maintenance) | ~3–4 h | ~25 min | ~3 h | Entities + relationships + naming |
| 2 | Feature-package restructure + DTOs + mappers | ~4–5 h | ~35 min | ~4 h | Full package move + Create/Update/Response records |
| 3 | Services with business rules (distance, totalCost, company consistency) | ~3 h | ~25 min | ~2.5 h | Validation of inactive entities, same-company rule |
| 4 | REST controllers + GlobalExceptionHandler (ProblemDetail) | ~2 h | ~15 min | ~1.75 h | Consistent API surface |
| 5 | Local config (application.yml profiles) + docker-compose | ~1 h | ~10 min | ~50 min | PostgreSQL ready |
| 6 | README + architecture decisions documentation | ~1.5 h | ~15 min | ~1.25 h | This file |
| **Total Phase 1–2** | | **~14.5–16.5 h** | **~2 h** | **~12.5–14.5 h** | |

Estimates are realistic for a senior developer writing everything from scratch (including thinking time, naming, edge cases and consistency). AI reduced boilerplate and kept the structure consistent across seven features.

---

## License

MIT
