# ChaufHER Developer Onboarding Guide

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben

---

## Welcome to ChaufHER! 🚗

This guide will help you get up and running with the ChaufHER platform. Follow these steps to set up your development environment and make your first contribution.

---

## Day 1: Environment Setup

### Prerequisites

Ensure you have the following installed:

| Tool | Version | Installation |
|------|---------|--------------|
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com/) |
| **Node.js** | 18 LTS | [nodejs.org](https://nodejs.org/) |
| **.NET SDK** | 9.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) |
| **Docker** | 24+ | [docker.com](https://www.docker.com/) |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Azure CLI** | 2.50+ | [docs.microsoft.com](https://docs.microsoft.com/cli/azure/install-azure-cli) |

### Step 1: Clone Repositories

```bash
# Create workspace directory
mkdir -p ~/chaufher && cd ~/chaufher

# Clone all repositories
git clone https://github.com/phoenixvc/chaufher-workspace.git
git clone https://github.com/phoenixvc/chaufher-app.git
git clone https://github.com/phoenixvc/chaufher-api.git
git clone https://github.com/phoenixvc/chaufher-web.git
git clone https://github.com/phoenixvc/chaufher-infra.git
```

### Step 2: Install VS Code Extensions

Install recommended extensions:

```bash
# Run from any repository root
code --install-extension ms-dotnettools.csharp
code --install-extension ms-dotnettools.csdevkit
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-azuretools.vscode-bicep
code --install-extension bradlc.vscode-tailwindcss
code --install-extension humao.rest-client
```

### Step 3: Start Local Services

```bash
# From chaufher-workspace directory
cd chaufher-workspace

# Start local development services
docker compose up -d

# This starts:
# - PostgreSQL (localhost:5432)
# - Redis (localhost:6379)
# - Azurite (Azure Storage emulator, localhost:10000)
```

Verify services are running:
```bash
docker compose ps
```

### Step 4: Configure Environment Variables

```bash
# API configuration
cd ~/chaufher/chaufher-api
cp .env.example .env.local

# Edit .env.local with your settings
# Note: Ask team lead for development secrets
```

Required environment variables:

```env
# Database
DATABASE_URL=Host=localhost;Database=chaufher_dev;Username=postgres;Password=postgres

# Redis
REDIS_CONNECTION=localhost:6379

# Azure AD B2C (use development tenant)
AZURE_AD_B2C_TENANT=chaufherdev
AZURE_AD_B2C_CLIENT_ID=<ask-team-lead>

# External Services (development keys)
GOOGLE_MAPS_API_KEY=<ask-team-lead>
SENDGRID_API_KEY=<ask-team-lead>
PAYFAST_MERCHANT_ID=<sandbox-id>
```

### Step 5: Run Database Migrations

```bash
cd ~/chaufher/chaufher-api

# Install EF Core tools if needed
dotnet tool install --global dotnet-ef

# Run migrations
dotnet ef database update --project src/ChaufHER.Infrastructure
```

### Step 6: Start the API

```bash
cd ~/chaufher/chaufher-api

# Restore packages
dotnet restore

# Run the API
dotnet run --project src/ChaufHER.Api

# API will be available at https://localhost:5001
# Swagger UI at https://localhost:5001/swagger
```

### Step 7: Start the PWA

```bash
cd ~/chaufher/chaufher-app

# Install dependencies
npm install

# Start development server
npm run dev

# App will be available at http://localhost:5173
```

### Step 8: Verify Setup

Run the health check:
```bash
curl https://localhost:5001/health
```

Expected response:
```json
{
  "status": "Healthy",
  "checks": {
    "database": "Healthy",
    "redis": "Healthy"
  }
}
```

---

## Day 2: Understand the Codebase

### Repository Structure

```
~/chaufher/
├── chaufher-workspace/     # Documentation, ADRs, coordination
│   ├── adr/                # Architecture Decision Records
│   ├── docs/               # Technical documentation
│   └── README.md           # Platform overview
│
├── chaufher-api/           # .NET 9 Backend
│   ├── src/
│   │   ├── ChaufHER.Api/           # REST API, controllers
│   │   ├── ChaufHER.Application/   # Business logic, services
│   │   ├── ChaufHER.Domain/        # Entities, value objects
│   │   └── ChaufHER.Infrastructure/# Data access, external services
│   └── tests/
│
├── chaufher-app/           # Rider/Driver PWA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API clients
│   │   ├── stores/         # State management
│   │   └── utils/          # Helpers
│   └── public/
│
├── chaufher-web/           # Admin Portal (React)
│   └── src/
│
└── chaufher-infra/         # Azure Infrastructure
    ├── bicep/              # Infrastructure as Code
    ├── scripts/            # Deployment scripts
    └── .github/workflows/  # CI/CD pipelines
```

### Key Documentation to Read

| Priority | Document | Time | Purpose |
|----------|----------|------|---------|
| 1 | [README.md](../README.md) | 30 min | Platform overview |
| 2 | [PRD](PRD.md) | 45 min | Product requirements |
| 3 | [Architecture](architecture.md) | 30 min | System design |
| 4 | [C4 Diagrams](c4-diagrams.md) | 20 min | Visual architecture |
| 5 | [Data Model](data-model.md) | 30 min | Database schema |
| 6 | [API Reference](api-reference.md) | 45 min | API endpoints |
| 7 | [Design Guardrails](design_guardrails.md) | 15 min | UX principles |

### Key ADRs to Read

| ADR | Topic | Why It Matters |
|-----|-------|----------------|
| [ADR-001](../adr/001-client-technology-flutter-vs-pwa.md) | PWA vs Flutter | Why we chose PWA |
| [ADR-009](../adr/009-backend-framework-dotnet.md) | .NET 9 | Backend technology |
| [ADR-007](../adr/007-authentication-azure-ad-b2c.md) | Authentication | Auth flow |
| [ADR-026](../adr/026-driver-matching-algorithm.md) | Driver Matching | Core algorithm |

---

## Day 3: Make Your First Contribution

### Git Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# ... edit files ...

# 3. Commit with conventional commits
git commit -m "feat: add driver rating display"
# Types: feat, fix, docs, style, refactor, test, chore

# 4. Push and create PR
git push -u origin feature/your-feature-name

# 5. Create PR via GitHub
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Examples:
```
feat(rides): add fare estimate caching

Cache fare estimates in Redis for 5 minutes to reduce
Google Maps API calls.

Closes #123
```

```
fix(auth): handle expired OTP gracefully

Show user-friendly message when OTP expires instead of
generic error.
```

### Code Review Checklist

Before submitting a PR, verify:

- [ ] Code compiles without warnings
- [ ] All tests pass (`dotnet test` / `npm test`)
- [ ] Linting passes (`dotnet format` / `npm run lint`)
- [ ] New features have tests
- [ ] API changes documented
- [ ] No secrets in code
- [ ] Migrations included if DB changes

---

## Development Workflows

### Running Tests

```bash
# API tests
cd chaufher-api
dotnet test

# Run specific test project
dotnet test tests/ChaufHER.Application.Tests

# With coverage
dotnet test --collect:"XPlat Code Coverage"

# PWA tests
cd chaufher-app
npm test

# E2E tests
npm run test:e2e
```

### Database Migrations

```bash
cd chaufher-api

# Create a new migration
dotnet ef migrations add AddDriverRating \
  --project src/ChaufHER.Infrastructure \
  --startup-project src/ChaufHER.Api

# Apply migrations
dotnet ef database update \
  --project src/ChaufHER.Infrastructure \
  --startup-project src/ChaufHER.Api

# Rollback last migration
dotnet ef database update PreviousMigrationName \
  --project src/ChaufHER.Infrastructure \
  --startup-project src/ChaufHER.Api
```

### API Development

```bash
# Watch mode (auto-restart on changes)
cd chaufher-api
dotnet watch run --project src/ChaufHER.Api

# Run with specific environment
ASPNETCORE_ENVIRONMENT=Development dotnet run

# Generate OpenAPI spec
dotnet swagger tofile --output swagger.json \
  src/ChaufHER.Api/bin/Debug/net9.0/ChaufHER.Api.dll v1
```

### PWA Development

```bash
cd chaufher-app

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix
```

---

## Debugging

### API Debugging (VS Code)

1. Open `chaufher-api` folder in VS Code
2. Press `F5` or select "Run > Start Debugging"
3. Breakpoints will be hit automatically

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch API",
      "type": "coreclr",
      "request": "launch",
      "program": "${workspaceFolder}/src/ChaufHER.Api/bin/Debug/net9.0/ChaufHER.Api.dll",
      "args": [],
      "cwd": "${workspaceFolder}/src/ChaufHER.Api",
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  ]
}
```

### PWA Debugging

1. Open `chaufher-app` folder in VS Code
2. Start dev server: `npm run dev`
3. Open Chrome DevTools (F12)
4. Use "Sources" tab for breakpoints
5. React DevTools extension recommended

### Database Debugging

```bash
# Connect to local PostgreSQL
psql -h localhost -U postgres -d chaufher_dev

# Common queries
SELECT * FROM "User" LIMIT 10;
SELECT * FROM "Ride" WHERE status = 'in_progress';

# Using pgAdmin (GUI)
# Connect to localhost:5432 with postgres/postgres
```

### Redis Debugging

```bash
# Connect to local Redis
redis-cli

# Common commands
KEYS *                    # List all keys
GET driver:location:123   # Get driver location
TTL session:abc           # Check key TTL
MONITOR                   # Watch all commands
```

---

## Useful Commands

### Docker

```bash
# View logs
docker compose logs -f api

# Restart a service
docker compose restart postgres

# Reset everything
docker compose down -v
docker compose up -d
```

### .NET CLI

```bash
# Add package
dotnet add package Newtonsoft.Json

# List packages
dotnet list package

# Clean build
dotnet clean && dotnet build

# Format code
dotnet format
```

### npm

```bash
# Add dependency
npm install axios

# Add dev dependency
npm install -D @types/node

# Update dependencies
npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

---

## Getting Help

### Team Contacts

| Role | Name | Slack | For |
|------|------|-------|-----|
| **Tech Lead** | Jurie | @jurie | Architecture, blockers |
| **Product** | Eben | @eben | Requirements, priorities |
| **DevOps** | TBD | @devops | Infrastructure, deployments |

### Resources

| Resource | URL |
|----------|-----|
| **Linear (Tasks)** | linear.app/chaufher |
| **Notion (Docs)** | notion.so/chaufher |
| **Slack** | chaufher.slack.com |
| **GitHub** | github.com/phoenixvc |
| **Figma** | figma.com/chaufher |

### Common Issues

#### Port already in use
```bash
# Find and kill process
lsof -i :5001
kill -9 <PID>

# Or use different port
dotnet run --urls "https://localhost:5002"
```

#### Database connection failed
```bash
# Check PostgreSQL is running
docker compose ps
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up -d postgres
dotnet ef database update
```

#### Node modules issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Onboarding Checklist

### Week 1

- [ ] Complete environment setup
- [ ] Read key documentation
- [ ] Join Slack channels (#dev, #general, #alerts)
- [ ] Get access to Linear, Notion, GitHub
- [ ] Meet with tech lead
- [ ] Complete first small task/bug fix

### Week 2

- [ ] Understand ride booking flow end-to-end
- [ ] Review driver matching algorithm
- [ ] Complete a feature task
- [ ] Shadow a code review
- [ ] Set up monitoring dashboards access

### Week 3

- [ ] Understand payment flow
- [ ] Review security architecture
- [ ] Complete a medium-sized feature
- [ ] Lead a code review
- [ ] Document something you learned

### Week 4

- [ ] Understand CI/CD pipeline
- [ ] Review infrastructure setup
- [ ] Complete an independent feature
- [ ] Present at team meeting
- [ ] Mentor next new joiner (when applicable)

---

## Next Steps

1. **Complete environment setup** (Day 1)
2. **Read documentation** (Day 2)
3. **Make first contribution** (Day 3)
4. **Schedule 1:1 with tech lead**
5. **Pick first task from Linear**

Welcome to the team! 🎉

---

## Related Documents

- [Architecture Overview](architecture.md)
- [API Reference](api-reference.md)
- [Data Model](data-model.md)
- [C4 Diagrams](c4-diagrams.md)
