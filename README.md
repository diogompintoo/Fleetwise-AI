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
| 1 | Database + domain model | **Done** |
| 2 | Spring Boot REST API + business rules | **Done** |
| 3 | Analytics (consumption, cost/km, variation, anomaly rules) | **Done** |
| 4 | Angular + TypeScript dashboard (migrated from React for enterprise stack) | **Done** |
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

This section catalogues work done with AI assistance, so the portfolio can show concrete time savings. For detailed task-by-task execution logs (including the frontend migration to Angular), see [`AI_MIGRATION_LOG.md`](AI_MIGRATION_LOG.md).

|      Phase           |  Manual estimate   | With AI      | Saved            |  Notes


| **Total Phase 1–2**  | **~14.5–16.5 h**   | **~2 h**     | **~12.5–14.5 h** | Domain, CRUDs, validation, docker

| **Total Phase 3**    | **~6 h**           | **~1h 30min**| **~5.1 h**       | Fleet/vehicle metrics & anomalies (Fix docker and git problems)

| **Total Phase 4**    | **~13.5–14.0 h**   | **~1h 15min**| **~12.2–12.7 h** | Enterprise Angular migration (Signals, DI, HttpClient, Tailwind)

| **Total Phase 5**    | **~ h**            | **~ **       | **~**            | 

| **Total Phase 6**    | **~ h**            | **~ **       | **~**            | 

| **Total Phase 7**    | **~ h**            | **~ **       | **~**            | 

| **Total Phase 8**    | **~ h**            | **~ **       | **~**            | 

| **Total Phase 9**    | **~ h**            | **~ **       | **~**            | 

| **Total Phase 10**   | **~ h**            | **~ **       | **~**            | 

| **Total Phase 11**   | **~ h**            | **~ **       | **~**            | 

| **Total Phase 12**   | **~ h**            | **~ **       | **~**            | 

| **Total Phase 13**   | **~ h**            | **~ **       | **~**            | 

| **Grand Total (Phases 1–4)** | **~34.0–36.5 h**   | **~4 h 45m** | **~29.2–31.7 h** | Domain, CRUDs, Docker, metrics & Angular enterprise frontend 

Estimates are realistic for a senior developer writing everything from scratch (including thinking time, naming, edge cases and consistency). AI reduced boilerplate and kept the structure consistent across seven features.

---

## License

MIT
