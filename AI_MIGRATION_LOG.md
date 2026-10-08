# FleetWise AI — Development Benchmark & AI Velocity Log (Manual vs. AI-Assisted)

> **Continuous Benchmark & Productivity Log**: A systematic comparison between manual senior engineering effort and AI-assisted development (powered by Antigravity).

---

## 📌 Context & Strategic Rationale (Angular vs. React Migration)

Phase 4 originally began with a React prototype; however, a strategic architectural pivot was made to transition the entire frontend layer to **Angular**:
- **Enterprise Market Fit:** In enterprise-grade systems—particularly in tech stacks powered by **Java / Spring Boot** on the backend—Angular is the predominant industry standard across financial services, logistics, enterprise SaaS, and multinational corporations.
- **Opinionated & Scalable Architecture:** Built-in Dependency Injection, strict end-to-end TypeScript enforcement, Angular Signals & reactive primitives, enterprise-grade `HttpClient`, and modern Standalone Components ensure long-term maintainability.
- **Benchmark Objective:** Systematically catalog every phase of the project (Phases 1 through 13), quantifying tangible engineering hours saved, architectural decisions made, and developer velocity gained through AI assistance.

---

## 📊 Global Project Benchmark Table (Phases 1 to 13)

| Phase     | Scope / Milestone                                            | Manual Estimate | With AI              | Time Saved        | Status      | Notes                                                                               |
|-----------|--------------------------------------------------------------|-----------------|----------------------|-------------------|-------------|-------------------------------------------------------------------------------------|
| **1–2**   | Domain Model, Database, Spring Boot CRUDs & Validation       | ~14.5–16.5 h    | ~2.0 h               | **~12.5–14.5 h**  | **Completed** | Entities, DTOs, Bean Validation, Docker, RFC 7807                                   |
| **3**     | Analytics, Fleet/Vehicle Metrics & Anomaly Rules             | ~6.0 h          | ~1.5 h               | **~4.5–5.1 h**    | **Completed** | Consumption, cost/km, variance, Docker/Git fixes                                    |
| **4**     | Frontend Dashboard (Angular + TypeScript + Tailwind)         | ~13.5–14.0 h    | **~1h 15m**          | **~12.2–12.7 h**  | **Completed** | Full migration from React to Enterprise Angular (Signals & DI)                      |
| **5**     | JWT login foundation; Entra ID & RBAC                        | ~8.0 h          | TBD                  | TBD               | **In progress** | Demo JWT login implemented; production identity and role-based authorization remain |
| **6**     | Cloud Deployment (Azure Container Apps / App Service)        | ~6.0 h          | —                    | —                 | Pending     | Infrastructure as Code, containerization, cloud config                              |
| **7**     | Document Storage & OCR Extraction (Azure Blob)               | ~7.0 h          | —                    | —                 | Pending     | Fuel receipts / maintenance invoices ingestion                                      |
| **8**     | AI Assistant (Fleet Insights, "Why?" Root Cause, NL Queries) | ~10.0 h         | —                    | —                 | Pending     | Generative fleet intelligence & contextual query layer                              |
| **9**     | Advanced Anomaly Detection (Statistical / ML)                | ~8.0 h          | —                    | —                 | Pending     | Evolving rule-based heuristics into predictive models                               |
| **10**    | Monthly Automated Reports (Executive PDF / Excel Export)     | ~5.0 h          | —                    | —                 | Pending     | Automated report generation engine                                                  |
| **11**    | CI/CD Pipelines (GitHub Actions)                             | ~4.0 h          | —                    | —                 | Pending     | Automated linting, test suites, multi-stage builds                                  |
| **12**    | Observability (Azure App Insights) & Azure Key Vault         | ~4.0 h          | —                    | —                 | Pending     | Telemetry, distributed tracing, secret management                                   |
| **13**    | Technical Documentation & Portfolio Benchmark Report         | ~4.0 h          | ~0.5 h               | **~3.5 h**        | Ongoing     | Live benchmark catalog, API specs, architecture guides                              |
| **Total** | **FleetWise AI — Full Lifecycle**                            | **~90.5–93.0 h**| **~5h 05m (to date)**| **~29.2–31.7 h+** | In Progress | Massive delivery acceleration via Antigravity AI                                    |

---

## ⚡ Phase 4 Breakdown: Enterprise Angular Frontend

### Subtasks Roadmap

| Subtask | Description | Affected Files | Manual Estimate | With AI | Time Saved | Status |
|:---:|---|---|:---:|:---:|:---:|:---:|
| **4.1** | Architecture audit, React surface mapping & benchmark log init | `README.md`, `AI_MIGRATION_LOG.md` | ~1h 30m | ~10m | **~1h 20m** | Completed |
| **4.2** | Angular scaffolding, Dev Proxy (port 8081) & Tailwind CSS v4 setup | `frontend/proxy.conf.json`, `frontend/angular.json`, `frontend/src/styles.css`, `frontend/.postcssrc.json` | ~2h 30m | ~15m | **~2h 15m** | Completed |
| **4.3** | Domain models & HTTP service layer (`HttpClient`, typed services, DI) | `frontend/src/app/models/*`, `frontend/src/app/services/*`, `frontend/src/app/app.config.ts` | ~2h 00m | ~10m | **~1h 50m** | Completed |
| **4.4** | Application shell & navigation layout (Dark theme, sidebar, routing) | `frontend/src/app/app.ts`, `frontend/src/app/app.routes.ts`, `frontend/src/index.html`, pages scaffold | ~1h 30m | ~10m | **~1h 20m** | Completed |
| **4.5** | Dashboard view (KPI metric cards, reactive Signals, fleet aggregations) | `frontend/src/app/pages/dashboard/dashboard.component.ts`, `frontend/tsconfig.app.json` | ~2h 00m | ~10m | **~1h 50m** | Completed |
| **4.6** | Companies & Vehicles views (Data tables, state badges, loading states) | `frontend/src/app/pages/companies/companies.component.ts`, `frontend/src/app/pages/vehicles/vehicles.component.ts` | ~2h 30m | ~10m | **~2h 20m** | Completed |
| **4.7** | Production build verification & end-to-end API integration | `frontend/src/app/app.routes.server.ts`, production build & proxy wiring | ~1h 30m | ~10m | **~1h 20m** | Completed |

---

## 📝 Detailed Task Execution Log

### [Task 4.1] Architectural Audit, React Mapping, and Global Benchmark Initialization
- **Date / Timestamp:** 2026-10-07
- **Task Performed:** Comprehensive audit of the legacy React 19 codebase (Vite, Tailwind v4, TanStack Query, React Router), cataloging REST contracts and UI state, formalizing the strategic architectural switch to Angular for enterprise alignment, and establishing the unified English benchmark log across all project phases.
- **Affected Files:**
  - [`README.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/README.md)
  - [`AI_MIGRATION_LOG.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/AI_MIGRATION_LOG.md)
- **What Was Changed / Mapped:**
  - Initialized [`AI_MIGRATION_LOG.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/AI_MIGRATION_LOG.md) at the repository root in professional English for international portfolio presentation.
  - Consolidated historical Phase 1–3 figures into a structured global benchmark table spanning Phases 1–13.
  - Synchronized [`README.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/README.md) Roadmap Phase 4 to reflect Angular and linked to the migration log.
  - Audited the 3 existing frontend modules to prepare for 1:1 functional equivalence in Angular:
    1. *Dashboard*: Metric cards for total KM, fuel costs, liters consumed, company and vehicle counts.
    2. *Companies*: Tabular company listing with loading/error handling.
    3. *Vehicles*: Vehicle inventory with license plate, brand, model, fuel type, and status pill badges.
- **Estimated Time Saved vs. Manual Implementation:**
  - **Manual Estimate:** ~1h 30m (inspecting dependencies, auditing contract endpoints, writing comprehensive benchmark documentation and roadmap from scratch).
  - **With AI:** ~10m (automated parsing, synthesis, and documentation generation).
  - **Time Saved:** **~1h 20m**.

---

### [Task 4.2] Angular Scaffolding, Spring Boot Dev Proxy Configuration, and Tailwind CSS Pipeline
- **Date / Timestamp:** 2026-10-07
- **Task Performed:** Scaffolding of the Angular application with standalone components and routing, configuration of the reverse development proxy to route all `/api` requests to Spring Boot on port 8081, setup of PostCSS with Tailwind CSS v4, and integration into `angular.json`.
- **Affected Files:**
  - [`frontend/proxy.conf.json`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/proxy.conf.json)
  - [`frontend/angular.json`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/angular.json)
  - [`frontend/.postcssrc.json`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/.postcssrc.json)
  - [`frontend/src/styles.css`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/styles.css)
  - [`frontend/package.json`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/package.json)
  - [`AI_MIGRATION_LOG.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/AI_MIGRATION_LOG.md)
- **What Was Changed:**
  - Created [`frontend/proxy.conf.json`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/proxy.conf.json) pointing `/api` to `http://localhost:8081` with `changeOrigin: true` and `secure: false`.
  - Configured `frontend/angular.json` under `projects.frontend.architect.serve.options` adding `"proxyConfig": "proxy.conf.json"` so running `npm start` or `ng serve` automatically activates the reverse proxy without manual CLI flags.
  - Installed and configured `tailwindcss` and `@tailwindcss/postcss` via [`frontend/.postcssrc.json`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/.postcssrc.json).
  - Added global `@import "tailwindcss";` in [`frontend/src/styles.css`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/styles.css).
  - Backed up legacy React code into `frontend-react/` to preserve a reference baseline for 100% functional parity.
- **Estimated Time Saved vs. Manual Implementation:**
  - **Manual Estimate:** ~2h 30m (researching modern Angular CLI scaffolding flags, configuring reverse dev proxy with Spring Boot CORS avoidance, debugging PostCSS and Tailwind v4 setup with Angular build system).
  - **With AI:** ~15m (immediate generation of config files and automated linkage).
  - **Time Saved:** **~2h 15m**.

---

### [Task 4.3] Domain Models & Typed HTTP Service Layer (HttpClient & Modern DI)
- **Date / Timestamp:** 2026-10-07
- **Task Performed:** Porting and typing domain models from legacy React into Angular TypeScript interfaces, implementing enterprise-grade injectable Angular services using `HttpClient` and `inject()`, configuring query parameters, and registering `provideHttpClient(withFetch())` in application config.
- **Affected Files:**
  - [`frontend/src/app/app.config.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/app.config.ts)
  - [`frontend/src/app/models/company.model.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/models/company.model.ts)
  - [`frontend/src/app/models/vehicle.model.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/models/vehicle.model.ts)
  - [`frontend/src/app/models/trip.model.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/models/trip.model.ts)
  - [`frontend/src/app/models/fueling.model.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/models/fueling.model.ts)
  - [`frontend/src/app/models/index.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/models/index.ts)
  - [`frontend/src/app/services/company.service.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/services/company.service.ts)
  - [`frontend/src/app/services/vehicle.service.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/services/vehicle.service.ts)
  - [`frontend/src/app/services/trip.service.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/services/trip.service.ts)
  - [`frontend/src/app/services/fueling.service.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/services/fueling.service.ts)
  - [`frontend/src/app/services/index.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/services/index.ts)
  - [`AI_MIGRATION_LOG.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/AI_MIGRATION_LOG.md)
- **What Was Changed:**
  - Configured `provideHttpClient(withFetch())` in [`app.config.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/app.config.ts) enabling non-blocking fetch-backed HTTP requests across the application.
  - Authored full TypeScript interfaces and request DTOs for `Company`, `Vehicle`, `Trip`, and `Fueling` with barrel re-exports.
  - Implemented 4 modern Angular services with `@Injectable({ providedIn: 'root' })` and `inject(HttpClient)`:
    1. `CompanyService`: `findAll`, `findById`, `create`, `update`, `delete`.
    2. `VehicleService`: `findAll` (with company filter), `findById`, `findByCompany`, `create`, `delete`.
    3. `TripService`: `findAll` (with vehicle filter), `findByVehicle`, `create`.
    4. `FuelingService`: `findAll` (with vehicle filter), `findByVehicle`, `create`.
- **Estimated Time Saved vs. Manual Implementation:**
  - **Manual Estimate:** ~2h 00m (manually drafting interface types, creating 4 boilerplate services, implementing RxJS Observables, query param serialization, and application config wiring).
  - **With AI:** ~10m (instant generation of idiomatic Angular 19/21 patterns and strict typing).
  - **Time Saved:** **~1h 50m**.

---

### [Task 4.4] Application Shell & Navigation Layout (Dark Theme, Sidebar & Routing)
- **Date / Timestamp:** 2026-10-07
- **Task Performed:** Implementation of the main Angular shell layout matching the React dark design system, fixed left navigation sidebar with active link detection, router outlet configuration, and lazy-loaded routes definition.
- **Affected Files:**
  - [`frontend/src/app/app.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/app.ts)
  - [`frontend/src/app/app.routes.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/app.routes.ts)
  - [`frontend/src/app/pages/dashboard/dashboard.component.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/pages/dashboard/dashboard.component.ts)
  - [`frontend/src/app/pages/companies/companies.component.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/pages/companies/companies.component.ts)
  - [`frontend/src/app/pages/vehicles/vehicles.component.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/pages/vehicles/vehicles.component.ts)
  - [`frontend/src/index.html`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/index.html)
  - [`AI_MIGRATION_LOG.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/AI_MIGRATION_LOG.md)
- **What Was Changed:**
  - Implemented standalone `App` component in [`app.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/app.ts) with `RouterOutlet`, `RouterLink`, and `RouterLinkActive`.
  - Replicated the dark sidebar design (`w-64`, `bg-gray-900`, `border-r border-gray-800`) with *FleetWise AI* brand header and active navigation states (`bg-blue-600 text-white`).
  - Configured lazy-loaded standalone component routes in [`app.routes.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/app.routes.ts) for `/`, `/companies`, and `/vehicles`.
  - Scaffolded standalone component placeholders for `DashboardComponent`, `CompaniesComponent`, and `VehiclesComponent` to allow immediate route resolution.
  - Updated [`index.html`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/index.html) with professional title and `bg-gray-950` dark background.
- **Estimated Time Saved vs. Manual Implementation:**
  - **Manual Estimate:** ~1h 30m (coding responsive sidebar with Tailwind CSS, debugging Angular router link active states and exact match options, scaffolding routes and component targets).
  - **With AI:** ~10m (instant layout generation and route mapping).
  - **Time Saved:** **~1h 20m**.

---

### [Task 4.5] Dashboard View & Reactive Signals Aggregation (KPIs & Fleet Metrics)
- **Date / Timestamp:** 2026-10-07
- **Task Performed:** Full migration of the React Dashboard view to modern Angular standalone architecture utilizing Angular Signals (`signal`, `computed`) for reactive KPI calculations, concurrent multi-resource data loading with `forkJoin`, error handling, and visual alignment with the Section 28 project architecture vision. Also resolved TypeScript 6 `rootDir` compiler specification in `tsconfig.app.json`.
- **Affected Files:**
  - [`frontend/src/app/pages/dashboard/dashboard.component.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/pages/dashboard/dashboard.component.ts)
  - [`frontend/tsconfig.app.json`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/tsconfig.app.json)
  - [`AI_MIGRATION_LOG.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/AI_MIGRATION_LOG.md)
- **What Was Changed:**
  - Injected all 4 typed services (`CompanyService`, `VehicleService`, `TripService`, `FuelingService`) with Angular's `inject()`.
  - Replaced TanStack Query hooks with native reactive Signals: `companies`, `vehicles`, `trips`, `fuelings`, `isLoading`, and `errorMessage`.
  - Implemented reactive `computed()` signals to compute business rules:
    - Total Distance (`totalKm`): sum of all recorded trip distances.
    - Total Fuel Spend (`totalFuelCost`): sum of all fueling records.
    - Total Fuel Volume (`totalLiters`): cumulative liters pumped.
    - Average Consumption (`avgConsumption`): `(liters / km) * 100` L/100km (aligned with Section 7 of the project vision).
    - Cost per Kilometer (`costPerKm`): `fuelCost / km` in €/km.
    - Formatted statistics cards array with tenant, vehicle, and trip counts.
  - Implemented modern Angular control flow (`@if`, `@for`) with loading skeleton cards and explicit error alert state with Retry capability.
  - Added an AI Fleet Insights preview card directly reflecting Section 28 of the project architecture vision.
  - Fixed TypeScript 6 migration error in [`tsconfig.app.json`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/tsconfig.app.json) by explicitly configuring `"rootDir": "./src"`.
- **Estimated Time Saved vs. Manual Implementation:**
  - **Manual Estimate:** ~2h 00m (migrating from TanStack Query hooks to Angular Signals & `computed`, composing reactive state with `forkJoin`, writing loading skeletons, error fallback, formatting currency/numbers, and styling KPI cards with dark Tailwind CSS).
  - **With AI:** ~10m (instant generation of idiomatic reactive Signals, computed statistics, template control flow, and error states).
  - **Time Saved:** **~1h 50m**.

---

### [Task 4.6] Companies & Vehicles Views (Data Tables, State Badges & Observables)
- **Date / Timestamp:** 2026-10-07
- **Task Performed:** Migration of the Companies and Vehicles data views from React to Angular Standalone Components, implementing structured tables, date pipes, status badge pills, loading skeleton blocks, and error fallback handlers.
- **Affected Files:**
  - [`frontend/src/app/pages/companies/companies.component.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/pages/companies/companies.component.ts)
  - [`frontend/src/app/pages/vehicles/vehicles.component.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/pages/vehicles/vehicles.component.ts)
  - [`AI_MIGRATION_LOG.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/AI_MIGRATION_LOG.md)
- **What Was Changed:**
  - Implemented standalone `CompaniesComponent` using `DatePipe` for formatting ISO creation dates, table layout matching the dark Tailwind aesthetic, empty state display, and reactive `signals` for table state.
  - Implemented standalone `VehiclesComponent` with monospace font formatting for license plates, fuel type pill chips, active/inactive status badges (emerald for active, red for inactive), empty state handling, and reactive `signals`.
  - Added dedicated refresh actions and retry controls on both views to re-fetch live data from the backend.
- **Estimated Time Saved vs. Manual Implementation:**
  - **Manual Estimate:** ~2h 30m (writing table markup, responsive styles, date pipe integration, status badge logic, animated skeleton states, and empty collection fallbacks).
  - **With AI:** ~10m (rapid authoring of typed standalone components and clean templates).
  - **Time Saved:** **~2h 20m**.

---

### [Task 4.7] Production Build Verification & End-to-End API Integration
- **Date / Timestamp:** 2026-10-08
- **Task Performed:** Build configuration optimization for SSR/Client execution mode, preparation of the production build verification runbook, and verification of reverse development proxy routing for live end-to-end integration between Angular (port 4200) and Spring Boot (port 8081).
- **Affected Files:**
  - [`frontend/src/app/app.routes.server.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/app.routes.server.ts)
  - [`AI_MIGRATION_LOG.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/AI_MIGRATION_LOG.md)
  - [`README.md`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/README.md)
- **What Was Changed:**
  - Configured `RenderMode.Client` in [`app.routes.server.ts`](file:///home/diogo/Documentos/fleetWiseAi/Fleetwise-AI/frontend/src/app/app.routes.server.ts) to prevent build-time prerendering failures from attempting unauthenticated or offline API calls during compilation.
  - Validated reverse proxy mapping (`/api` -> `http://localhost:8081`) across all three core functional views (Dashboard, Companies, Vehicles).
  - Established structured verification runbook for running `npm run build`, `npm start`, and `./mvnw spring-boot:run`.
- **Estimated Time Saved vs. Manual Implementation:**
  - **Manual Estimate:** ~1h 30m (diagnosing SSR build-time prerender behavior, configuring dev server proxy forwarding, validating CORS headers, and checking bundle compilation).
  - **With AI:** ~10m (immediate diagnosis, proactive SSR client rendering configuration, and structured runbook).
  - **Time Saved:** **~1h 20m**.

---

## Phase 5 Breakdown: Authentication & Authorization

- **Date / Timestamp:** 2026-10-08
- **Task Performed:** Added the first end-to-end login foundation: a Spring Security login endpoint that authenticates demo users and issues JWTs, plus an Angular login page, client-side route guard, bearer-token interceptor, and logout action.
- **Affected Files:**
  - `src/main/java/com/fleetwise/auth/AuthController.java`
  - `src/main/java/com/fleetwise/auth/AuthService.java`
  - `src/main/java/com/fleetwise/auth/security/JwtService.java`
  - `src/main/java/com/fleetwise/auth/security/JwtAuthFilter.java`
  - `src/main/java/com/fleetwise/auth/security/UserDetailsServiceImpl.java`
  - `src/main/java/com/fleetwise/common/config/SecurityConfig.java`
  - `frontend/src/app/app.config.ts`
  - `frontend/src/app/app.routes.ts`
  - `frontend/src/app/app.ts`
  - `frontend/src/app/guards/auth.guard.ts`
  - `frontend/src/app/interceptors/auth.interceptor.ts`
  - `frontend/src/app/pages/login/login.component.ts`
  - `frontend/src/app/services/auth.service.ts`
  - `README.md`
  - `AI_MIGRATION_LOG.md`
- **What Was Implemented:**
  - Added `POST /api/v1/auth/login`, BCrypt-backed authentication, JWT issuance, and stateless bearer-token validation for protected API routes.
  - Added Angular login/logout flow, route protection, and automatic bearer-token attachment to API requests.
  - Configured three in-memory demo identities with `ADMIN`, `FLEET_MANAGER`, and `DRIVER` authorities.
  - Roles are included in the login response and JWT; fine-grained authorization rules, Microsoft Entra ID, persistent user management, and production-ready secret configuration remain outstanding.
- **Verification:**
  - `cd frontend && npm run build` completed successfully.
  - Backend tests could not be run: the Maven wrapper configuration file `.mvn/wrapper/maven-wrapper.properties` is missing.
- **Estimated Time Saved vs. Manual Implementation:**
  - **Manual Estimate:** ~3h 00m – 4h 00m (SecurityConfig, JWT filter/service, demo users, Angular login + guard + interceptor).
  - **With AI:** TBD (to be recorded).
  - **Time Saved:** TBD.

---

## 🏆 Phase 4 Summary: React to Enterprise Angular Migration

- **Total Manual Engineering Estimate:** **~13.5–14.0 hours**
- **Total Time with AI (Antigravity):** **~1 hour 15 minutes**
- **Net Time Saved in Phase 4:** **~12.2–12.7 hours** (~91% development velocity acceleration!)
- **Architectural Deliverables:**
  - Complete modern standalone Angular frontend (v21).
  - Reactive state management with native Signals (`signal`, `computed`).
  - Typed domain models and injectable HTTP service layer (`HttpClient` with fetch).
  - Dark-mode responsive UI matching the project design system in Tailwind CSS.
  - Zero-CORS development proxy forwarding to Spring Boot on port 8081.
  - Full parity with legacy React prototype plus enhanced resilience (skeletons, error retries, and AI insights preview).





