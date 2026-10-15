# FleetWise AI — System Architecture

> Technical reference for the FleetWise AI fleet management platform.  
> Built as a portfolio project demonstrating AI-assisted development velocity.

---

## System Overview

FleetWise AI is a full-stack enterprise fleet management platform that centralises
vehicle, trip, fuel and expense data and uses a generative AI layer to help fleet
managers identify cost drivers and operational anomalies.

┌─────────────────────────────────────────────────────────────────┐
│ BROWSER (Angular 21) │
│ Login → Dashboard → Companies → Vehicles → Driver Portal │
│ Angular Signals + Tailwind CSS + HTTP Interceptor (JWT) │
└──────────────────────┬──────────────────────────────────────────┘
│ HTTPS / REST API (Bearer Token)
┌──────────────────────▼──────────────────────────────────────────┐
│ Spring Boot 3.4 (Java 21) │
│ │
│ ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐ │
│ │ auth │ │ company │ │ vehicle │ │ trip │ │ fueling │ │
│ └─────────┘ └──────────┘ └──────────┘ └────────┘ └─────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
│ │ analytics│ │ report │ │ ai │ │ common (security) │ │
│ └──────────┘ └──────────┘ └──────────┘ └────────────────────┘ │
│ │
│ Spring Security + JWT │ JPA/Hibernate │ OpenPDF │
└──────┬───────────────────────────────┬────────────────────────── ┘
│ │
┌──────▼──────┐ ┌────────▼────────┐
│ PostgreSQL │ │ Groq Cloud │
│ (Railway) │ │ openai-gpt-oss │
│ │ │ -20b (free) │
└─────────────┘ └─────────────────┘

---

## Stack

| Layer | Technology | Rationale |
|---|---|---|
| Language | Java 21 (LTS) | Long-term support, records, pattern matching |
| Framework | Spring Boot 3.4 | Industry standard, auto-config, embedded Tomcat |
| Security | Spring Security + JWT | Stateless RBAC, no session overhead |
| Persistence | Spring Data JPA + Hibernate 6 | Type-safe queries, schema evolution via `ddl-auto` |
| Validation | Bean Validation (Jakarta) | Declarative, controller-layer validation |
| PDF Engine | OpenPDF (LibrePDF 2.0) | LGPL, zero native deps, Alpine-compatible |
| Frontend | Angular 21 (Standalone + Signals) | Enterprise-grade, reactive state without RxJS boilerplate |
| Styling | Tailwind CSS v4 | Utility-first, dark mode, zero runtime |
| AI Layer | Groq Cloud — openai-gpt-oss-20b | Free tier, low latency, OpenAI-compatible API |
| Database (local) | PostgreSQL 16 (Docker) | Production parity in development |
| Database (prod) | PostgreSQL (Railway managed) | Zero-ops, automatic backups |
| Deploy | Railway (Docker multi-stage) | Git-push deploy, free tier, public URL |
| CI/CD | GitHub Actions | Backend (Java 21 + H2) + Frontend (Node 20) |

---

## Domain Model

Company
└── Vehicle (brand, model, fuelType, initialMileage)
├── Trip (date, start/end location, mileage, distance)
└── Fueling (date, liters, pricePerLiter, totalCost, odometer)

Company
└── Driver (name, license)
└── Trip (assigned driver per trip)

Vehicle
├── Expense (maintenance costs, other expenses)
└── Maintenance (type, mileage, cost, description)


---

## Package Structure (Feature / Domain Oriented)

com.fleetwise
├── auth/ # JWT login, JwtService, filter, demo users
│ ├── AuthController.java
│ ├── AuthService.java
│ ├── dto/ # LoginRequest, AuthResponse
│ └── security/ # JwtService, JwtAuthFilter, UserDetailsServiceImpl
├── common/
│ ├── config/ # SecurityConfig, DataSeeder, SpaForwardController
│ └── exception/ # ResourceNotFoundException, BusinessRuleException, GlobalExceptionHandler
├── company/ # CRUD + DTOs + Mapper + Repository
├── vehicle/ # CRUD + DTOs + Mapper + Repository
├── driver/ # CRUD + DTOs + Mapper + Repository
├── trip/ # CRUD + business rule: distance = endMileage - startMileage
├── fueling/ # CRUD + business rule: totalCost = liters × pricePerLiter
├── expense/ # CRUD
├── maintenance/ # CRUD
├── analytics/ # Fleet & vehicle metrics, anomaly detection, rule-based insights
│ └── dto/ # FleetAnalyticsResponse, VehicleAnalyticsResponse, AnomalyResponse
├── ai/ # Groq LLM integration, AI insight endpoint
│ ├── GeminiService.java # RestClient → Groq Cloud API
│ ├── AiInsightController.java
│ └── AiInsightResponse.java
└── report/ # PDF (OpenPDF) + CSV export
├── ReportController.java
└── ReportService.java


---

## API Reference

| Resource | Method | Path | Roles |
|---|---|---|---|
| Auth | POST | `/api/v1/auth/login` | Public |
| Companies | GET | `/api/v1/companies` | All authenticated |
| Companies | POST / PUT / DELETE | `/api/v1/companies` | ADMIN, FLEET_MANAGER |
| Vehicles | GET | `/api/v1/vehicles` | All authenticated |
| Vehicles | POST / DELETE | `/api/v1/vehicles` | ADMIN, FLEET_MANAGER |
| Drivers | GET / POST | `/api/v1/drivers` | ADMIN, FLEET_MANAGER |
| Trips | GET | `/api/v1/trips` | All authenticated |
| Trips | POST | `/api/v1/trips` | All authenticated |
| Fuelings | GET / POST | `/api/v1/fuelings` | All authenticated |
| Expenses | GET / POST | `/api/v1/expenses` | ADMIN, FLEET_MANAGER |
| Maintenances | GET / POST | `/api/v1/maintenances` | ADMIN, FLEET_MANAGER |
| Analytics | GET | `/api/v1/analytics/fleet` | ADMIN, FLEET_MANAGER |
| Analytics | GET | `/api/v1/analytics/anomalies` | ADMIN, FLEET_MANAGER |
| Analytics | GET | `/api/v1/analytics/insights` | ADMIN, FLEET_MANAGER |
| AI Insights | GET | `/api/v1/ai/insights` | ADMIN, FLEET_MANAGER |
| Reports | GET | `/api/v1/reports/fleet/pdf` | ADMIN, FLEET_MANAGER |
| Reports | GET | `/api/v1/reports/fleet/csv` | ADMIN, FLEET_MANAGER |

---

## Key Engineering Decisions

### 1. Distance calculated server-side
`distance = endMileage - startMileage` is enforced in `TripService`, not trusted from the client. Prevents data manipulation and centralises the business rule.

### 2. Fuel cost calculated server-side
`totalCost = liters × pricePerLiter` (scale 2, HALF_UP) computed in `FuelingService`. Guarantees financial accuracy regardless of client rounding.

### 3. DTOs + Bean Validation — entities never exposed
All API contracts use dedicated request/response records. `@NotNull`, `@Min`, `@Size` annotations validate at the controller boundary before reaching the service layer.

### 4. RFC 7807 ProblemDetail
`GlobalExceptionHandler` returns consistent JSON error responses for 400 (validation), 404 (not found) and 422 (business rules). Clients always receive a structured `type`, `title`, `detail` and `timestamp`.

### 5. Stateless JWT — no sessions
`SessionCreationPolicy.STATELESS` in `SecurityConfig`. Every request carries a self-contained bearer token. No server-side session state — horizontally scalable from day one.

### 6. open-in-view: false
Eliminates the anti-pattern of lazy-loading database associations during JSON serialisation. All required associations are explicitly fetched with `JOIN FETCH` in repository queries.

### 7. Feature packages over layer packages
Code is organised by domain (`company/`, `vehicle/`, `trip/`) not by layer (`controllers/`, `services/`, `repositories/`). Each domain is self-contained and independently navigable.

### 8. AI layer is additive, not load-bearing
`GeminiService` wraps the Groq API call in a try/catch that returns a fallback string on failure. The application remains fully functional if the AI provider is unavailable.

### 9. Multi-stage Docker build
`Dockerfile` uses Node 21 Alpine to build the Angular SPA, then Maven 3.9 / Java 21 to build the JAR, and copies Angular `dist/` into Spring Boot's `static/` folder. Single container, zero reverse proxy needed.

### 10. DataSeeder runs on !test profile
`@Profile("!test")` ensures the seeder never runs in CI (H2 test profile). In production, it checks `companyRepository.count() > 0` before inserting — idempotent, safe to redeploy.

---

## Local Development

### Prerequisites
- Java 21
- Maven 3.9+
- Node 20+
- Docker

### Backend

```bash
# Start PostgreSQL
docker run -d --name fleetwise-db \
  -e POSTGRES_DB=fleetwise \
  -e POSTGRES_USER=fleetwise \
  -e POSTGRES_PASSWORD=fleetwise \
  -p 5432:5432 postgres:16-alpine

# Run Spring Boot (demo data seeded automatically)
mvn spring-boot:run -Dspring-boot.run.profiles=local
# API available at http://localhost:8081
```

### Frontend

```bash
cd frontend
npm install
npm start
# App available at http://localhost:4200
```

### Demo Credentials

| User | Password | Role |
|---|---|---|
| admin | admin123 | ADMIN |
| manager | manager123 | FLEET_MANAGER |
| driver | driver123 | DRIVER |

---

## CI/CD Pipeline

Push to main
├── Backend CI (GitHub Actions)
│ Java 21 → mvn clean verify (H2 test profile) → JAR artifact
└── Frontend CI (GitHub Actions)
Node 20 → npm ci → npm run build → dist artifact

Railway (auto-deploy on main)
Docker multi-stage build → Spring Boot + Angular → PostgreSQL


---

## AI-Assisted Development

This project was built demonstrating AI-assisted development velocity.
Full benchmark log available in [`AI_MIGRATION_LOG.md`](AI_MIGRATION_LOG.md).

| Phase | Manual Estimate | With AI | Saved |
|---|---|---|---|
| 1–2 Domain + API | ~15 h | ~2 h | ~13 h |
| 3 Analytics | ~6 h | ~1.5 h | ~4.5 h |
| 4 Angular Frontend | ~14 h | ~1.25 h | ~12.75 h |
| 5 JWT + RBAC | ~8 h | ~1.5 h | ~6.5 h |
| 6 Deploy (Railway) | ~6 h | ~2.25 h | ~3.75 h |
| 8 AI Insights (LLM) | ~10 h | ~1 h | ~9 h |
| 10 PDF/CSV Reports | ~5 h | ~0.75 h | ~4.25 h |
| 11 CI/CD | ~4 h | ~0.75 h | ~3.25 h |
| **Total** | **~68 h** | **~11 h** | **~57 h** |