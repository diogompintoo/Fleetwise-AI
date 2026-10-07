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

| Phase | Scope / Milestone | Manual Estimate | With AI | Time Saved | Status | Notes |
|:---:|---|:---:|:---:|:---:|:---:|---|
| **1–2** | Domain Model, Database, Spring Boot CRUDs & Validation | ~14.5–16.5 h | ~2.0 h | **~12.5–14.5 h** | **Completed** | Entities, DTOs, Bean Validation, Docker, RFC 7807 |
| **3** | Analytics, Fleet/Vehicle Metrics & Anomaly Rules | ~6.0 h | ~1.5 h | **~4.5–5.1 h** | **Completed** | Consumption, cost/km, variance, Docker/Git fixes |
| **4** | **Frontend Dashboard (Angular + TypeScript + Tailwind)** | **~14.0 h** | **~25m (to date)** | **~3h 35m (to date)** | **In Progress** | Strategic migration from React to Enterprise Angular |
| **5** | Authentication & RBAC (Microsoft Entra ID) | ~8.0 h | — | — | Pending | Enterprise identity, JWT validation, role security |
| **6** | Cloud Deployment (Azure Container Apps / App Service) | ~6.0 h | — | — | Pending | Infrastructure as Code, containerization, cloud config |
| **7** | Document Storage & OCR Extraction (Azure Blob) | ~7.0 h | — | — | Pending | Fuel receipts / maintenance invoices ingestion |
| **8** | AI Assistant (Fleet Insights, "Why?" Root Cause, NL Queries) | ~10.0 h | — | — | Pending | Generative fleet intelligence & contextual query layer |
| **9** | Advanced Anomaly Detection (Statistical / ML) | ~8.0 h | — | — | Pending | Evolving rule-based heuristics into predictive models |
| **10** | Monthly Automated Reports (Executive PDF / Excel Export) | ~5.0 h | — | — | Pending | Automated report generation engine |
| **11** | CI/CD Pipelines (GitHub Actions) | ~4.0 h | — | — | Pending | Automated linting, test suites, multi-stage builds |
| **12** | Observability (Azure App Insights) & Azure Key Vault | ~4.0 h | — | — | Pending | Telemetry, distributed tracing, secret management |
| **13** | Technical Documentation & Portfolio Benchmark Report | ~4.0 h | ~0.5 h | **~3.5 h** | Ongoing | Live benchmark catalog, API specs, architecture guides |
| **Total** | **FleetWise AI — Full Lifecycle** | **~90.5–93.0 h** | **~4h 15m (to date)** | **~20.8–23.0 h+** | In Progress | Massive delivery acceleration via Antigravity AI |

---

## ⚡ Phase 4 Breakdown: Enterprise Angular Frontend

### Subtasks Roadmap

| Subtask | Description | Affected Files | Manual Estimate | With AI | Time Saved | Status |
|:---:|---|---|:---:|:---:|:---:|:---:|
| **4.1** | Architecture audit, React surface mapping & benchmark log init | `README.md`, `AI_MIGRATION_LOG.md` | ~1h 30m | ~10m | **~1h 20m** | Completed |
| **4.2** | Angular scaffolding, Dev Proxy (port 8081) & Tailwind CSS v4 setup | `frontend/proxy.conf.json`, `frontend/angular.json`, `frontend/src/styles.css`, `frontend/.postcssrc.json` | ~2h 30m | ~15m | **~2h 15m** | Completed |
| **4.3** | Domain models & HTTP service layer (`HttpClient`, typed services, DI) | Angular models & service classes | ~2h 00m | TBD | TBD | Up Next |
| **4.4** | Application shell & navigation layout (Dark theme, sidebar, routing) | Shell component, nav links, routes config | ~1h 30m | TBD | TBD | Pending |
| **4.5** | Dashboard view (KPI metric cards, reactive Signals, fleet aggregations) | Dashboard component & reactive logic | ~2h 00m | TBD | TBD | Pending |
| **4.6** | Companies & Vehicles views (Data tables, state badges, loading states) | Companies and Vehicles components | ~2h 30m | TBD | TBD | Pending |
| **4.7** | Production build verification & end-to-end API integration | Build output, bundle analyzer, API wiring | ~1h 30m | TBD | TBD | Pending |

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

