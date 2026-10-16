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
| Database (prod) | H2 (In-memory) | Fast, zero-config embedded database for Azure environment |
| Deploy | Microsoft Azure App Service (F1 Tier) | Java 21 Linux Web App, continuous deployment |
| CI/CD | GitHub Actions | Automated build (Angular ng build + Maven jar) & deployment |

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

```text
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


```

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

```

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

### 9. Automatic Environment Profile
Uses application-azure.yml active profile on Azure App Service. Automatically sets up database initialization mode, Tomcat server settings, and JWT secret defaults.

```

## Local Development

### Prerequisites
- Java 21
- Maven 3.9+
- Node 20+

### Backend & Frontend Combined (Production Style)

# 1. Build Angular frontend
cd frontend
npm install
npx ng build --configuration=production

# 2. Copy static files to Spring Boot static resources
mkdir -p ../src/main/resources/static
cp -r dist/*/browser/. ../src/main/resources/static/

# 3. Run Spring Boot
cd ..
mvn spring-boot:run
# App available at http://localhost:8080


```

### Demo Credentials

| User | Password | Role |
|---|---|---|
| admin | admin123 | ADMIN |
| manager | manager123 | FLEET_MANAGER |
| driver | driver123 | DRIVER |

```

## CI/CD Pipeline

Push to main
 ├── 1. Setup Node.js 20 & install Angular dependencies
 ├── 2. Compile Angular SPA (npx ng build --configuration=production)
 ├── 3. Copy compiled assets to src/main/resources/static/
 ├── 4. Setup Java 21 Temurin & compile Spring Boot with Maven
 └── 5. Deploy executable JAR to Azure App Service via Publish Profile

---

## AI-Assisted Development

This project was built demonstrating AI-assisted development velocity.
Full benchmark log available in [`AI_MIGRATION_LOG.md`](AI_MIGRATION_LOG.md).

| Phase | Manual Estimate | With AI | Saved |
|---|---|---|---|
| 1–2 Domain + API | ~15.5 h | ~2.0 h | ~13.5 h |
| 3 Analytics | ~6.0 h | ~1.5 h | ~4.5 h |
| 4 Angular Frontend | ~13.7 h | ~1.25 h | ~12.5 h |
| 5 JWT + RBAC | ~8.0 h | ~1.5 h | ~6.5 h |
| 6 Deploy (Railway) | ~5.5 h | ~2.25 h | ~3.2 h |
| 8 AI Insights (LLM) | ~10.0 h | ~1.5 h | ~8.5 h |
| 10 PDF/CSV Reports | ~5.0 h | ~0.75 h | ~4.2 h |
| 11 CI/CD | ~4.0 h | ~0.75 h | ~3.2 h |
| **Total** | **~67.7 h** | **~11.0 h** | **~56.1 h** |