# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

ChaufHER is a women-focused ride-hailing platform. This repository contains all strategic documentation (ADRs, PRD, architecture) and is **transitioning to a monorepo structure** that will consolidate all application code.

**Tech Stack:**
- Backend: .NET 9 (ASP.NET Core) with PostgreSQL
- Frontend: Progressive Web App (PWA) using Next.js/TypeScript
- Admin Portal: React/Next.js
- Infrastructure: Azure (Bicep IaC)
- CI/CD: GitHub Actions
- Monorepo Tool: Turborepo with pnpm workspaces

## Repository Structure

### Current State (Documentation Hub)
```
chaufher/
├── adr/              # 27 Architecture Decision Records
├── docs/             # PRD, personas, architecture, data model
└── WARP.md           # This file
```

### Target Monorepo Structure
```
chaufher/
├── apps/
│   ├── pwa/          # Next.js PWA for riders/drivers
│   ├── admin/        # Next.js admin dashboard
│   └── api/          # .NET 9 backend
├── packages/
│   └── ui/           # Shared design system
├── infra/            # Azure infrastructure (Bicep)
├── adr/              # Architecture decisions (preserved)
├── docs/             # All documentation (preserved)
├── .github/workflows/# CI/CD pipelines
├── package.json      # pnpm workspace root
└── turbo.json        # Turborepo configuration
```

## Migration Status

**Current Phase:** Documentation consolidation complete. Application code migration in progress.

**What's Consolidated:**
- ✅ All ADRs (27 architectural decisions)
- ✅ Product documentation (PRD, personas, journey maps)
- ✅ Technical documentation (architecture, data model, API specs)
- ✅ OpenAPI specifications (from `chaufher-api`)
- ✅ Postman collections (from `chaufher-api`)
- ✅ Design variants (archived from `chaufher-web`)

**What's Coming:**
- 🔄 PWA application code (Next.js)
- 🔄 Admin dashboard code (Next.js)
- 🔄 Backend API code (.NET 9)
- 🔄 Infrastructure code (Bicep)
- 🔄 Shared UI package (React components)

**Note:** If you see references to separate `chaufher-app`, `chaufher-api`, `chaufher-web` repositories in documentation, those are legacy references being consolidated into this monorepo.

## Transition Helper

**If `apps/` directory doesn't exist yet:**
You're still in the documentation-only phase. The commands below will work once the monorepo structure is complete. For now:

```powershell
# Focus on documentation updates
code docs/           # Edit documentation
code adr/            # Review/update ADRs

# Check what's been consolidated
Get-ChildItem docs/ -Recurse -File | Measure-Object | Select-Object Count
Get-ChildItem adr/ -File | Measure-Object | Select-Object Count
```

**If `apps/` directory exists:**
You're ready for full-stack development! Use the commands in the sections below.

## Local Development Setup (Monorepo)

### Prerequisites

```powershell
# Install required tools
winget install Git.Git
winget install OpenJS.NodeJS.LTS
winget install Microsoft.DotNet.SDK.9
winget install Docker.DockerDesktop
winget install Microsoft.VisualStudioCode
winget install Microsoft.AzureCLI

# Install pnpm globally
npm install -g pnpm

# Verify installations
git --version
node --version
dotnet --version
pnpm --version
az --version
```

### First-Time Setup

```powershell
# Clone the repository
git clone https://github.com/phoenixvc/chaufher.git
cd chaufher

# Install all dependencies (once apps/ exists)
pnpm install

# Set up local services (PostgreSQL, Redis)
docker compose up -d

# Initialize database (once API exists)
cd apps/api
dotnet ef database update --project src/ChaufHER.Infrastructure --startup-project src/ChaufHER.Api
cd ../..

# Start all apps in dev mode
pnpm dev
```

**What runs when you do `pnpm dev`:**
- PWA at `http://localhost:3000`
- Admin at `http://localhost:3001`
- API at `https://localhost:5001` (Swagger at `/swagger`)

## Common Development Commands

### Documentation and Repository Navigation

```powershell
# Read key documentation (in order of priority)
# 1. README.md - Platform overview
# 2. docs/PRD.md - Product requirements
# 3. docs/architecture.md - System architecture
# 4. docs/onboarding-guide.md - Developer setup

# Browse ADRs (Architecture Decision Records)
Get-ChildItem adr/*.md | Sort-Object Name
```

### Monorepo Setup

Once the monorepo structure is in place:

```powershell
# Install all dependencies
pnpm install

# Build all apps and packages
pnpm build

# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm dev --filter=pwa
pnpm dev --filter=admin
```

### API Development (.NET 9)

```powershell
# If monorepo structure exists:
cd apps/api
dotnet watch run --project src/ChaufHER.Api

# If still in separate repo:
cd ..\chaufher-api
dotnet watch run --project src/ChaufHER.Api

# Run tests
dotnet test

# Run specific test project
dotnet test tests/ChaufHER.Application.Tests

# Database migrations
dotnet ef migrations add MigrationName --project src/ChaufHER.Infrastructure --startup-project src/ChaufHER.Api
dotnet ef database update --project src/ChaufHER.Infrastructure --startup-project src/ChaufHER.Api

# Format code
dotnet format
```

### PWA Development (Next.js/TypeScript)

```powershell
# If monorepo structure exists:
cd apps/pwa
pnpm dev              # Start dev server
pnpm test             # Run tests
pnpm test:e2e         # E2E tests
pnpm typecheck        # Type checking
pnpm lint             # Linting
pnpm build            # Production build

# Or from monorepo root:
pnpm dev --filter=pwa
pnpm test --filter=pwa
```

### Infrastructure (Bicep)

```powershell
# Navigate to infra directory
cd infra

# Validate Bicep templates
az bicep build --file main.bicep

# Preview infrastructure changes (what-if)
az deployment group what-if `
  --resource-group chaufher-dev-rg `
  --template-file main.bicep `
  --parameters environments/dev.bicepparam

# Deploy infrastructure
az deployment group create `
  --resource-group chaufher-dev-rg `
  --template-file main.bicep `
  --parameters environments/dev.bicepparam
```

### Git Workflow

```powershell
# Create feature branch
git checkout -b feature/your-feature-name

# Commit with conventional commits (feat, fix, docs, refactor, test, chore)
git commit -m "feat(scope): description"

# Push and create PR
git push -u origin feature/your-feature-name
```

## Architecture Overview

### Monorepo Structure (Target)

```
chaufher/ (this repo)
├── apps/
│   ├── pwa/           # Next.js PWA for riders/drivers
│   │   ├── src/
│   │   │   ├── app/         # Next.js 14 app router
│   │   │   ├── components/  # React components
│   │   │   ├── lib/         # API clients, utilities
│   │   │   └── styles/      # Global styles, Tailwind
│   │   ├── public/          # Static assets
│   │   └── package.json
│   │
│   ├── admin/         # Next.js admin dashboard
│   │   └── src/           # Similar structure to PWA
│   │
│   └── api/           # .NET 9 backend
│       ├── src/
│       │   ├── ChaufHER.Api/           # Controllers, endpoints
│       │   ├── ChaufHER.Application/   # Business logic (CQRS)
│       │   ├── ChaufHER.Domain/        # Entities, interfaces
│       │   └── ChaufHER.Infrastructure/# EF Core, external services
│       └── tests/
│
├── packages/
│   └── ui/            # Shared design system
│       ├── src/
│       │   ├── components/  # Reusable React components
│       │   ├── hooks/       # Shared hooks
│       │   └── utils/       # Shared utilities
│       └── package.json
│
├── infra/             # Azure infrastructure (Bicep)
│   ├── main.bicep
│   └── modules/
│
├── docs/              # Strategic documentation
│   ├── PRD.md
│   ├── architecture.md
│   └── ... (31 documents)
│
├── adr/               # 27 Architecture Decision Records
│
├── .github/workflows/ # CI/CD pipelines
├── package.json       # pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json         # Turborepo configuration
└── WARP.md            # This file
```

### Service Architecture (API)

The backend follows clean architecture with clear separation:

```
src/ChaufHER.Api/           # REST API endpoints, SignalR hubs, middleware
src/ChaufHER.Application/   # Business logic (CQRS pattern with commands/queries)
src/ChaufHER.Domain/        # Entities, value objects, domain interfaces
src/ChaufHER.Infrastructure/# Data access (EF Core), external service integrations
```

**Key Patterns:**
- CQRS for separating reads/writes
- Minimal APIs for simple endpoints, Controllers for complex flows
- Repository pattern for data access
- Service layer for business logic

### Data Layer

**PostgreSQL (primary database):**
- Users, rides, payments, vehicles
- Entity Framework Core for ORM
- Migrations tracked in `ChaufHER.Infrastructure`

**Redis (caching):**
- Session management
- Geolocation caching for driver matching
- Rate limiting

**Azure Blob Storage:**
- Profile photos, vehicle photos
- Driver documents (licenses, insurance)
- Ride receipts

### Real-Time Communication

SignalR hubs for real-time updates:
- `RideHub` - Ride status, driver location, matching events
- `NotificationHub` - Safety alerts, system messages

### Key External Integrations

- **Azure AD B2C** - Phone-based authentication (OTP)
- **PayFast** - Payment processing
- **Google Maps** - Geolocation, routing
- **SendGrid** - Email notifications
- **Africa's Talking** - SMS notifications
- **Firebase** - Push notifications (PWA)

## Key Architectural Decisions

Review these ADRs to understand critical technology choices:

- **ADR-001**: PWA chosen over Flutter/React Native for rapid MVP delivery (now Next.js PWA)
- **ADR-009**: .NET 9 selected for backend (performance, Azure integration, SignalR)
- **ADR-002**: PostgreSQL for relational data
- **ADR-003**: SignalR for real-time communication
- **ADR-004**: Redis for caching and session management
- **ADR-007**: Azure AD B2C for authentication
- **ADR-008**: Azure as cloud provider
- **ADR-010**: Bicep for infrastructure as code
- **ADR-011**: GitHub Actions for CI/CD

**Recent Decisions:**
- **Monorepo**: Consolidating to Turborepo for faster builds and better DX
- **Next.js**: Replacing Vite for better SSR, SEO, and PWA capabilities
- **pnpm**: Fast, disk-efficient package manager for monorepo

**Trade-offs to remember:**
- PWA provides speed-to-market but has iOS limitations (live tracking is future phase)
- MVP focuses on scheduled rides only (on-demand is future scope)
- Monorepo adds complexity but improves code sharing and deployment coordination

## Development Principles

### Safety-First Design

From `docs/design_guardrails.md`:
- Safety signals must be visible and concrete
- Users must always know current status and next steps
- Clear paths to human help in all critical states
- Flows optimized for recurring patterns (school runs, work commutes)

### Code Quality Standards

- **Linting**: Enforced per repo (ESLint for TS, dotnet format for C#)
- **Testing**: Minimum 80% coverage for critical paths
- **Security**: Never commit secrets; use Azure Key Vault
- **Conventional Commits**: Required for all commit messages
- **Branch Strategy**: Feature branches from `main`, squash and merge

### Environment Strategy

Three environments with progressive deployment:
- **Development** (`dev`) - Auto-deploy on merge to `develop` branch
- **Staging** (`staging`) - Auto-deploy on merge to `main`, mirrors production
- **Production** (`prod`) - Manual approval required, canary rollout (10% → 50% → 100%)
### Testing Strategy

### API Tests

```powershell
# In monorepo:
cd apps/api
dotnet test

# Unit tests
dotnet test tests/ChaufHER.Application.Tests

# Integration tests (requires local services)
dotnet test tests/ChaufHER.Integration.Tests

# With coverage
dotnet test --collect:"XPlat Code Coverage"
```

### PWA Tests

```powershell
# In monorepo:
cd apps/pwa
pnpm test

# Unit/component tests
pnpm test

# E2E tests (Playwright/Cypress)
pnpm test:e2e

# Type checking (critical for TypeScript PWA)
pnpm typecheck

# Or from monorepo root:
pnpm test --filter=pwa
pnpm test --filter=admin
```
```

### Contract Tests

API contract tests validate breaking changes don't occur between API and clients.

## Debugging

### API Debugging

- Use VS Code with C# extension
- Launch configuration provided in `.vscode/launch.json`
- Set breakpoints in service/controller code
- Swagger UI available at `https://localhost:5001/swagger`

### PWA Debugging

- Chrome DevTools (F12) for frontend debugging
- React DevTools extension recommended
- Network tab for API call inspection
- Application tab for service worker/cache debugging

### Database Debugging

```powershell
# Connect to PostgreSQL
psql -h localhost -U postgres -d chaufher_dev

# Or use Azure Data Studio / pgAdmin GUI
```

### Redis Debugging

```powershell
# Connect to Redis CLI
redis-cli

# Useful commands:
KEYS *                    # List all keys
GET driver:location:123   # Get specific key
MONITOR                   # Watch all commands in real-time
```

## Common Workflows

### Adding a New API Endpoint

1. Define request/response DTOs in `ChaufHER.Api/Models/`
2. Create command/query in `ChaufHER.Application/Commands/` or `Queries/`
3. Add endpoint in `ChaufHER.Api/Endpoints/` (Minimal API) or controller
4. Add validation using FluentValidation
5. Write unit tests in `tests/ChaufHER.Application.Tests/`
6. Update OpenAPI documentation (Swagger annotations)

### Adding a New Database Entity

1. Create entity in `ChaufHER.Domain/Entities/`
2. Configure mapping in `ChaufHER.Infrastructure/Persistence/Configurations/`
3. Add repository interface to `ChaufHER.Domain/Interfaces/`
4. Implement repository in `ChaufHER.Infrastructure/Persistence/Repositories/`
5. Create and apply migration:
   ```powershell
   dotnet ef migrations add AddEntityName --project src/ChaufHER.Infrastructure --startup-project src/ChaufHER.Api
   dotnet ef database update --project src/ChaufHER.Infrastructure --startup-project src/ChaufHER.Api
   ```

### Monorepo Release Process

With the monorepo structure, releases are coordinated in a single repository:

```powershell
# Tag release
git tag v1.2.3
git push --tags
```

**Automated Release Pipeline:**
1. GitHub Actions triggered by tag push
2. Turborepo builds all apps in dependency order
3. Run all tests (unit, integration, E2E)
4. Build Docker images for API
5. Deploy to staging environment
6. Run smoke tests
7. **Manual approval gate** for production
8. Canary deploy to production (10% → 50% → 100%)
9. Monitor metrics, auto-rollback on errors
10. Release notes auto-generated from conventional commits

**Versioning:**
- Monorepo uses single version for all apps
- Individual packages (e.g., `@chaufher/ui`) can have independent versions
- Changesets used for automated versioning and changelogs

## Monitoring and Observability

### Application Insights

- API telemetry tracked automatically
- Custom events for business metrics (rides booked, payments processed)
- Performance counters (request duration, dependency calls)

### Key Metrics

- API latency (p95 target: <200ms)
- Ride completion rate (target: >95%)
- Payment success rate (target: >99.5%)
- Driver response time (median target: <30s)

### Health Checks

```powershell
# API health endpoint
curl https://localhost:5001/health

# Expected response includes database and Redis status
```

## Security Considerations

### Secrets Management

- **Never commit secrets** to source control
- Use Azure Key Vault for all secrets (API keys, connection strings)
- Local development: Use `.env.local` files (git-ignored)
- CI/CD: Use GitHub Actions secrets with OIDC authentication

### Authentication Flow

1. User enters phone number
2. Azure AD B2C initiates OTP via SMS
3. User verifies OTP
4. JWT tokens issued (access + refresh)
5. Tokens cached in Redis with expiry
6. API validates JWT on each request

### Data Protection

- All data encrypted at rest (Azure Storage AES-256)
- TLS 1.3 for data in transit
- PII handling compliant with GDPR
- Payment data follows PCI-DSS requirements

## Contact and Support

- **Tech Lead**: Jurie (jurie@phoenixvc.tech)
- **Product/BA**: Eben (eben@phoenixvc.tech)
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Notion (primary), this workspace (technical)

## Additional Resources

- **Product Requirements**: `docs/PRD.md`
- **Architecture Diagrams**: `docs/architecture.md`, `docs/c4-diagrams.md`
- **Data Model**: `docs/data-model.md`
- **API Reference**: `docs/api-reference.md`
- **Onboarding Guide**: `docs/onboarding-guide.md`
- **Design Guidelines**: `docs/design_guardrails.md`
- **User Personas**: `docs/user_personas.md`
