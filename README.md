# ChaufHER Workspace — Platform Coordination Hub

The unified entry point for development, operations, and governance across the ChaufHER platform. Orchestrates multi-repo coordination, enforces engineering standards, and streamlines safe delivery of features.

---

## Table of Contents

### Product Documentation
- [Product Requirements (PRD)](#product-requirements)
- [User Personas & Journey](#user-personas--customer-journey)
- [Design Guardrails](#design-guardrails)

### Business & Product
- [Product Overview](#product-overview)
- [Purpose & Value](#purpose--value)
- [Target Audience](#target-audience)
- [Expected Outcomes](#expected-outcomes)

### Architecture & Design
- [Multi-Repo Architecture](#multi-repo-architecture)
- [Design Philosophy](#design-philosophy)
- [Cross-Repo Coordination](#cross-repo-coordination)
- [System Interfaces](#system-interfaces)

### Operations
- [Deployment](#deployment)
- [Testing & Quality](#testing--quality)
- [Contact & Support](#contact--support)

### Developer Guide
- [Quick Start](#quick-start)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)

### Reference
- [Documentation Index](#documentation-index)
- [Related Repositories](#related-repositories)

---

# Product Documentation

## Product Requirements

The **[Product Requirements Document (PRD)](docs/PRD.md)** defines ChaufHER's vision, goals, and scope:

- **Mission**: A ride-hail platform designed for women, providing scheduled rides with vetted female drivers
- **MVP Focus**: Scheduled rides only (on-demand is future scope)
- **Core Features**: Ride scheduling, driver profiles, status notifications, secure payments
- **Target Metrics**: 1,000+ rides in 3 months, 100+ active drivers, 4.8+ CSAT score

> **Read the full PRD**: [docs/PRD.md](docs/PRD.md)

## User Personas & Customer Journey

ChaufHER serves six core personas across riders, drivers, and administrators:

| Persona | Role | Primary Need |
|---------|------|--------------|
| **Sarah** | Corporate Guardian | Safe child transport logistics |
| **Nomsa** | Community Driver | Flexible income with safety |
| **Aisha** | Solo Commuter | Reliable late-shift transport |
| **Thandi** | School Admin | Group transport efficiency |
| **Zanele** | Young Professional | Digital-first, transparent service |
| **Lerato** | Family Advocate | Multi-household coordination |

The **[Customer Journey Map](docs/CUSTOMER_JOURNEY_MAP.md)** details the full experience across five stages:

1. **Awareness** — Discovery via referrals, social media, school/corporate channels
2. **Consideration** — Evaluating safety protocols, driver vetting, testimonials
3. **Decision** — Onboarding, registration, first ride setup
4. **Retention** — Regular bookings, recurring schedules, live tracking
5. **Advocacy** — Referrals, community participation, feedback

> **Read more**: [User Personas](docs/user_personas.md) | [Customer Journey Map](docs/CUSTOMER_JOURNEY_MAP.md)

## Design Guardrails

The **[Design Guardrails](docs/DESIGN_GUARDRAILS.md)** define non-negotiable UX principles:

| Guardrail | Principle |
|-----------|-----------|
| **Safety First** | Safety signals must be visible and concrete, not implied |
| **Status Clarity** | Users must always know "what is happening now" and "what happens next" |
| **Predictability** | Simple, predictable rules beat many configuration options |
| **Human Fallback** | Clear paths to human help in all critical states |
| **Repetition-Ready** | Flows optimized for recurring patterns (school runs, shifts) |

> **Read the full guardrails**: [docs/DESIGN_GUARDRAILS.md](docs/DESIGN_GUARDRAILS.md)

---

# Business & Product

## Product Overview

ChaufHER Workspace is the orchestration hub for the entire ChaufHER platform, bringing together mobile, backend, web, and infrastructure codebases into a unified, coordinated development environment.

### Core Value Proposition

- **Single Source of Truth**: Centralized documentation, policies, and standards
- **Rapid Onboarding**: Streamlined setup for new contributors across all repos
- **Coordinated Delivery**: Synchronized releases and environment promotions
- **Governance Enforcement**: Automated policy checks and compliance validation
- **Operational Excellence**: Unified CI/CD, monitoring, and incident response

### Key Capabilities

| Capability | Description | Benefit |
|-----------|-------------|---------|
| **Shared Documentation** | Centralized guides, policies, standards | Consistent knowledge base |
| **CI/CD Orchestration** | Cross-repo pipeline coordination | Synchronized releases |
| **Environment Management** | Dev/staging/prod promotion workflows | Controlled deployments |
| **Policy Enforcement** | Automated security, compliance checks | Risk mitigation |
| **Onboarding Automation** | Standardized setup procedures | Faster productivity |
| **Incident Coordination** | Unified runbooks, escalation paths | Rapid response |

---

## Purpose & Value

### Business Problems Solved

1. **Onboarding Friction**: New engineers productive in hours, not weeks
2. **Configuration Drift**: Synchronized policies prevent inconsistencies
3. **Release Coordination**: Atomic multi-repo deployments reduce failures
4. **Compliance Burden**: Automated audits simplify regulatory requirements
5. **Knowledge Silos**: Centralized documentation eliminates tribal knowledge

### Technical Challenges Addressed

1. **Multi-Repo Complexity**: Orchestrated workflows manage dependencies
2. **Environment Parity**: Consistent configs across dev/staging/prod
3. **Secret Management**: Centralized Key Vault with automated rotation
4. **Policy Enforcement**: Automated checks prevent non-compliant merges
5. **Incident Response**: Standardized runbooks enable rapid recovery

### Example Scenarios

**Scenario 1: New Engineer Onboarding**
- Engineer joins team, follows Workspace onboarding guide
- Automated scripts configure local environments for all repos
- Pre-commit hooks enforce code standards
- First PR merged within 24 hours

**Scenario 2: Coordinated Release**
- Product team requests feature deployment
- Workspace orchestrates builds across app, api, web repos
- Automated tests validate cross-repo compatibility
- Staged rollout to staging, then production
- Release notes auto-generated and published

**Scenario 3: Security Policy Update**
- Security team updates secrets-handling policy
- Workspace CI enforces new policy across all repos
- Non-compliant PRs automatically blocked
- Audit trail generated for compliance review

---

## Target Audience

### Primary Users

#### Engineers
- **Role**: Develop features, fix bugs, maintain code quality
- **Needs**: Standardized setup, clear guidelines, reliable CI/CD
- **Pain Points**: Inconsistent environments, unclear standards

#### DevOps/SRE
- **Role**: Orchestrate deployments, monitor systems, respond to incidents
- **Needs**: Runbooks, automation tools, observability dashboards
- **Pain Points**: Manual deployments, fragmented monitoring

### Secondary Users

#### Product/Engineering Managers
- **Role**: Track delivery, assess team productivity, plan capacity
- **Needs**: Metrics dashboards, release cadence visibility
- **Tools**: GitHub Insights, custom dashboards

#### Security/Compliance Teams
- **Role**: Audit adherence, enforce policies, assess risk
- **Needs**: Automated compliance reports, audit trails
- **Tools**: Policy scan results, secrets audit logs

#### Leadership
- **Role**: Strategic oversight, risk assessment, resource allocation
- **Needs**: Platform reliability metrics, incident summaries
- **Tools**: Executive dashboards, quarterly reports

---

## Expected Outcomes

### Business Impact

**Short-Term (0-6 months):**
- Reduced onboarding time (target: <4 hours)
- Faster release cadence (target: daily deploys)
- Fewer deployment failures (target: <5%)
- Improved developer satisfaction

**Long-Term (6-24 months):**
- Full audit compliance (SOC 2, ISO 27001)
- Predictable delivery timelines
- Reduced incident recovery time
- Scalable engineering processes

### Key Performance Indicators

| Metric | Target | Measurement | Owner |
|--------|--------|-------------|-------|
| **Median Onboarding Time** | <4 hours | Time to first PR | Engineering Manager |
| **Change Lead Time** | <24 hours | Code to production | DevOps Lead |
| **Deployment Success Rate** | >95% | Successful deploys | Platform Lead |
| **Incident Recovery Time** | <30 min | MTTR for P1 incidents | SRE Lead |
| **Policy Compliance** | 100% | Automated scan pass rate | Security Lead |
| **Developer Satisfaction** | >80% | Quarterly survey NPS | Engineering Manager |

---

# Architecture & Design

## Multi-Repo Architecture

ChaufHER's source is structured into four primary repositories, orchestrated by the Workspace:

```
ChaufHER/
├── workspace/        ← This repo: shared docs, CI/CD orchestration
├── app/              ← Client application (PWA)
├── api/              ← Backend services (.NET 9)
├── web/              ← Admin portal (React)
└── infra/            ← Infrastructure (Bicep/Terraform)
```

### Repository Responsibilities

| Repository | Purpose | Technology | Orchestration |
|------------|---------|------------|---------------|
| **workspace** (this repo) | Shared docs, CI/CD, policies | Markdown, YAML | Coordinates all repos |
| **app** | Client PWA for riders/drivers | Progressive Web App | Triggered by workspace |
| **api** | Backend services, business logic | .NET 9, PostgreSQL | Triggered by workspace |
| **web** | Admin portal, operations dashboard | React/TypeScript | Triggered by workspace |
| **infra** | Infrastructure as code, provisioning | Bicep/Terraform | Triggered by workspace |

> **Why PWA?** See [ADR-001: Client Technology Selection](adr/001-client-technology-flutter-vs-pwa.md) for the weighted evaluation of Flutter, React Native, Native, and PWA approaches.

### Orchestration Flow

```
+-------------+    +----------+      +-----------+      +-----------+
|   app repo  |<-->| workspace|<---->| web repo  |<---->| api repo  |
+-------------+    +----------+      +-----------+      +-----------+
                                  ^                       |
                                  |                       |
                                +-----------+    +--------+--------+
                                |    infra   |<--|  Shared workflows|
                                +-----------+    +-----------------+
```

### Repo Boundaries

- **Autonomy**: Each repo maintains local development independence
- **Coordination**: Workspace enforces shared policies and orchestrates deployments
- **Ownership**: Teams mapped by component, reviewers tracked per repo
- **Integration**: GitHub Actions with shared workflow templates

---

## Design Philosophy

### Core Principles

#### 1. Single Source of Truth
- All shared documentation lives in Workspace
- Policies defined once, enforced everywhere
- No duplicate or conflicting standards

#### 2. Automation First
- Manual processes are technical debt
- CI/CD handles repetitive tasks
- Policy enforcement automated via checks

#### 3. Safety by Default
- Breaking changes blocked automatically
- Secrets never in source code
- All deployments reversible

#### 4. Auditability
- Every action logged with timestamp
- Compliance reports auto-generated
- Incident timelines traceable

#### 5. Developer Experience
- Fast feedback loops (CI <10 min)
- Clear error messages
- Self-service documentation

### Design Patterns

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **Event-Driven Pipelines** | GitHub Actions triggers | Parallel execution, fast feedback |
| **Layered Environments** | Dev → Staging → Prod | Controlled rollout, risk mitigation |
| **DRY Policy Enforcement** | Shared YAML templates | Consistency, maintainability |
| **Semantic Versioning** | Release tagging | Clear compatibility signals |
| **Feature Flags** | Staged rollouts | Safe experimentation |

---

## Cross-Repo Coordination

### Environment Promotion

Coordinated promotion across all repos via Workspace workflows:

```
Development → Staging → Production
     ↓            ↓           ↓
  Auto-deploy  Validation  Manual approval
```

**Promotion Workflow:**
1. Tag release in Workspace (`release/v1.2.3`)
2. Trigger builds across all repos
3. Run cross-repo integration tests
4. Deploy to staging environment
5. Automated smoke tests + manual validation
6. Approval gate (product + ops sign-off)
7. Canary deploy to production (10% → 50% → 100%)
8. Monitor metrics, auto-rollback on errors
9. Generate and publish release notes

### Secrets Management

- **Centralized**: Azure Key Vault per environment
- **Automated Rotation**: Every 90 days
- **Access Control**: Managed identities, least-privilege
- **Audit Trail**: All access logged

### Version Gating

- **PR Checks**: Cross-repo compatibility validated
- **Semantic Versioning**: Major.Minor.Patch enforced
- **Breaking Changes**: Require major version bump
- **Deprecation Policy**: 3 months notice before removal

### Compliance Triggers

Automated checks before merge:
- License scanning (FOSSA, Black Duck)
- Secrets detection (Gitleaks, TruffleHog)
- Dependency vulnerabilities (Dependabot, Snyk)
- Policy compliance (custom checks)

---

## System Interfaces

### Internal APIs

- **REST/GraphQL**: App/web to API communication
- **SignalR**: Real-time updates (WebSocket)
- **OpenAPI**: Centralized API documentation

### Third-Party Integrations

| Service | Purpose | Protocol |
|---------|---------|----------|
| **GitHub** | Actions, Checks, Releases | REST API, Webhooks |
| **Azure Key Vault** | Secrets management | HTTPS, OAuth |
| **Slack/Teams** | Alerts, incident comms | Webhooks, REST API |
| **Sentry** | Error tracking | HTTPS, SDK |
| **Application Insights** | Monitoring, metrics | HTTPS, SDK |

### Authentication

- **OAuth/OpenID**: User authentication
- **Managed Identities**: Service-to-service auth
- **JWT Tokens**: API authentication

---

# Operations

## Deployment

### Deployment Environments

| Environment | Purpose | Infrastructure | Data |
|-------------|---------|---------------|------|
| **Development** | Feature development | Local/cloud hybrid | Synthetic |
| **Staging** | Pre-production validation | Mirrors production | Scrubbed prod copy |
| **Production** | Live customer traffic | Multi-AZ, auto-scaling | Real customer data |

### Deployment Tools

- **Orchestrator**: GitHub Actions
- **IaC**: Terraform/Bicep (infra repo)
- **Containers**: Docker, Kubernetes with Helm
- **Secrets**: Azure Key Vault integration

### Deployment Steps

1. **Tag Release**: Push `release/*` tag in Workspace
2. **Trigger Orchestration**: Workspace workflow launches per-repo builds
3. **Run Validations**: Cross-repo E2E, contract, secrets checks
4. **Promote to Staging**: Deploy all repos to staging
5. **Stakeholder Review**: Automated + manual sign-off
6. **Promote to Production**: Canary rollout with monitoring
7. **Monitor & Rollback**: Auto-rollback on failure
8. **Publish Release Notes**: Changelog to docs and Slack

### Post-Deployment Verification

- **Health Checks**: Automated endpoint validation
- **Secrets Check**: Ensure no credential exposure
- **Monitoring**: Sentry/Application Insights integration
- **Audit Logs**: All actions logged for compliance

---

## Testing & Quality

### Test Strategy

| Test Type | Scope | Tools | Frequency |
|-----------|-------|-------|-----------|
| **E2E** | Cross-repo user workflows | Cypress, Playwright | Every PR |
| **Contract** | API compatibility | Postman, Newman | Every PR |
| **Integration** | Service boundaries | Jest, pytest | Every PR |
| **Security** | Secrets, vulnerabilities | Gitleaks, Snyk | Every commit |
| **Compliance** | Policy adherence | Checkov, custom | Every PR |
| **DR Drills** | Disaster recovery | Manual + automated | Quarterly |

### Testing Environments

- **Sandbox**: PR validations, onboarding walkthroughs
- **Staging**: Pre-release validation, mirrors production
- **Production**: Canary deploys, monitored rollouts

### Test Cases

| Test Case | Description | Expected Outcome |
|-----------|-------------|------------------|
| **App E2E Login** | Validate user sign-in/sign-up | Consistent success/error handling |
| **API Contract** | Test breaking changes | Zero incompatible changes |
| **Secrets Rotation** | Simulate key rotation | No disruption, alerts as expected |
| **DR Drill** | Trigger failover | Full recovery in SLA timeframe |

### Metrics & Reporting

**Tracked Metrics:**
- E2E suite pass/fail rate
- API contract change failures
- DR drill recovery times
- Secrets scan incidents

**Reporting:**
- Automated dashboards (GitHub, Grafana)
- Scheduled reports to Slack/Teams
- Stakeholder summaries for releases

---

## Contact & Support

### Team

| Name | Role | Email |
|------|------|-------|
| **Jurie** | Primary Contact | jurie@phoenixvc.tech |
| **Eben** | Secondary Contact | eben@phoenixvc.tech |

### Getting Help

For questions, issues, or support:
- **Primary**: jurie@phoenixvc.tech
- **CC**: eben@phoenixvc.tech
- **GitHub Issues**: Bug reports, feature requests

---

# Developer Guide

## Quick Start

### Prerequisites

- Git, Node.js 16+, .NET 9 SDK, Flutter 3.0+
- Docker (optional for local services)
- Azure CLI (for Key Vault access)

### Initial Setup

1. **Clone Workspace**
2. **Run Setup Script**
3. **Configure Environments**
4. **Verify Setup**

### Local Development

**Start all services:**

**Individual repos:**
- See repo-specific READMEs for detailed setup
- All repos follow consistent structure

---

## Development Guidelines

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Branches** | `feature/`, `fix/`, `chore/` | `feature/panic-button` |
| **Commits** | Conventional commits | `feat(auth): add JWT refresh` |
| **Tags** | Semantic versioning | `v1.2.3` |
| **Workflows** | kebab-case | `cross-repo-promotion.yml` |

### Commit Conventions

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

**Examples:**
- `feat(workspace): add cross-repo promotion workflow`
- `fix(ci): resolve secrets rotation script timeout`
- `docs(readme): update onboarding checklist`

### Git Workflow

**Branching Strategy:**
- `main` — Production-ready
- `feature/*` — Feature branches
- `fix/*` — Bugfix branches
- `release/*` — Release preparation

**Pull Request Process:**
1. Create feature branch from `main`
2. Push and open PR with description
3. All checks must pass (tests, linters, policy)
4. Await code review approval
5. Squash and merge on approval
6. Delete branch after merge

### Code Quality Standards

- **Linting**: Enforced per repo (ESLint, Prettier, etc.)
- **Testing**: Minimum 80% coverage for critical paths
- **Security**: No secrets in code, automated scans
- **Documentation**: Update docs with code changes

---

## Contributing

### Before You Commit

- [ ] Code follows naming conventions
- [ ] All tests pass locally
- [ ] Linting passes
- [ ] No secrets in commit
- [ ] Commit message follows convention
- [ ] Documentation updated
- [ ] Branch up-to-date with `main`

### Pull Request Checklist

- [ ] PR description explains changes
- [ ] Related issues linked
- [ ] Breaking changes documented
- [ ] Tests added/updated
- [ ] CI checks passing
- [ ] Reviewers assigned

### Review Process

1. Automated checks run (CI/CD)
2. Code review by team member
3. Address feedback, re-request review
4. Approval required before merge
5. Squash and merge to `main`

---

# Reference

## Documentation Index

### Product & Design

- [Product Requirements Document (PRD)](docs/PRD.md) — Vision, goals, user stories, functional requirements
- [User Personas](docs/user_personas.md) — Detailed profiles of riders, drivers, and administrators
- [Customer Journey Map](docs/CUSTOMER_JOURNEY_MAP.md) — End-to-end experience across all touchpoints
- [Design Guardrails](docs/DESIGN_GUARDRAILS.md) — Non-negotiable UX principles

### Architecture Decision Records (ADRs)

All architectural decisions are documented with weighted evaluation matrices per [ADR-000](adr/000-adr-specification.md).

| ADR | Title | Status | Category |
|-----|-------|--------|----------|
| [ADR-000](adr/000-adr-specification.md) | ADR Specification | Accepted | Process |
| [ADR-001](adr/001-client-technology-flutter-vs-pwa.md) | Client Technology (PWA vs Flutter) | Accepted | Frontend |
| [ADR-002](adr/002-database-postgresql.md) | Database Technology (PostgreSQL) | Accepted | Data |
| [ADR-003](adr/003-realtime-signalr.md) | Real-Time Communication (SignalR) | Accepted | Backend |
| [ADR-004](adr/004-caching-redis.md) | Caching Strategy (Redis) | Accepted | Backend |
| [ADR-005](adr/005-documentation-notion.md) | Documentation Platform (Notion) | Accepted | Process |
| [ADR-006](adr/006-team-communication.md) | Team Communication (Slack) | Accepted | Process |
| [ADR-007](adr/007-authentication-azure-ad-b2c.md) | Authentication (Azure AD B2C) | Accepted | Security |
| [ADR-008](adr/008-cloud-provider-azure.md) | Cloud Provider (Azure) | Accepted | Infrastructure |
| [ADR-009](adr/009-backend-framework-dotnet.md) | Backend Framework (.NET 9) | Accepted | Backend |
| [ADR-010](adr/010-infrastructure-bicep.md) | Infrastructure as Code (Bicep) | Accepted | Infrastructure |
| [ADR-011](adr/011-cicd-github-actions.md) | CI/CD Platform (GitHub Actions) | Accepted | DevOps |

### Repository Documentation

Technical documentation for each repository in the ChaufHER platform:

| Repository | Documentation | Description |
|------------|---------------|-------------|
| **chaufher-app** | [docs/app/README.md](docs/app/README.md) | PWA technical design, architecture, development guide |
| **chaufher-api** | [docs/api/README.md](docs/api/README.md) | .NET 9 backend, API endpoints, authentication |
| **chaufher-web** | [docs/web/README.md](docs/web/README.md) | React admin portal, design variants, operations |
| **chaufher-infra** | [docs/infra/README.md](docs/infra/README.md) | Azure infrastructure, Bicep modules, runbooks |

### Quick Links

- [Onboarding Checklist](docs/ONBOARDING.md)
- [Security Policy](docs/SECURITY.md)
- [CI/CD Pipeline Reference](docs/CICD.md)
- [Incident & DR Runbooks](runbooks/)
- [Contribution Guidelines](CONTRIBUTING.md)
- [Architecture Diagrams](docs/architecture/)

### Policies & Standards

- [Secrets Management](docs/SECRETS.md)
- [Code Review Standards](docs/CODE_REVIEW.md)
- [Deployment Policy](docs/DEPLOYMENT.md)
- [Incident Response](docs/INCIDENT_RESPONSE.md)
- [Compliance Requirements](docs/COMPLIANCE.md)

### Runbooks

- [Deployment Runbook](runbooks/DEPLOYMENT.md)
- [Rollback Procedures](runbooks/ROLLBACK.md)
- [Incident Response](runbooks/INCIDENT_RESPONSE.md)
- [DR Drill Procedures](runbooks/DR_DRILL.md)
- [Secrets Rotation](runbooks/SECRETS_ROTATION.md)

---

## Related Repositories

| Repository | Purpose | Link |
|------------|---------|------|
| **chaufher-workspace** (this repo) | Platform coordination hub | [GitHub](https://github.com/phoenixvc/chaufher-workspace) |
| **chaufher-app** | PWA client for riders/drivers | [GitHub](https://github.com/phoenixvc/chaufher-app) |
| **chaufher-api** | .NET backend services | [GitHub](https://github.com/phoenixvc/chaufher-api) |
| **chaufher-web** | React admin portal | [GitHub](https://github.com/phoenixvc/chaufher-web) |
| **chaufher-infra** | Azure IaC, CI/CD | [GitHub](https://github.com/phoenixvc/chaufher-infra) |

---

## License

Copyright (c) 2025 ChaufHER. All rights reserved.

[Add License Here — e.g., MIT, Apache 2.0, or proprietary]

---

**ChaufHER Workspace** delivers unified orchestration for safe, reliable, and auditable platform delivery.
