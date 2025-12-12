# ADR-011: CI/CD Platform – GitHub Actions

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps
**Technical Story:** Continuous Integration and Deployment platform selection

---

## Context

ChaufHER requires a CI/CD platform for:
- Automated builds on pull requests
- Running tests (unit, integration, E2E)
- Code quality checks (linting, security scanning)
- Building and pushing container images
- Deploying to Azure environments (dev, staging, prod)
- Infrastructure deployment (Bicep)
- Release management and versioning

The platform must:
- Integrate with GitHub (source control)
- Support .NET and Node.js builds
- Deploy to Azure services
- Enable environment-based workflows
- Provide good visibility and debugging
- Be cost-effective for small team

---

## Decision Drivers

1. **GitHub Integration** – Native integration with source control
2. **Azure Deployment** – First-class Azure deployment support
3. **Ease of Use** – Intuitive workflow configuration
4. **Ecosystem** – Marketplace actions, community support
5. **Cost** – Free tier, reasonable paid plans
6. **Flexibility** – Custom workflows, matrix builds
7. **Security** – Secrets management, OIDC support
8. **Visibility** – Build logs, status checks, notifications
9. **Self-Hosted Option** – Runners for specific needs
10. **Reliability** – Uptime, build performance

---

## Options Considered

### Option A: GitHub Actions

GitHub's built-in CI/CD platform.

**Pros:**
- Native GitHub integration (seamless)
- YAML-based workflow configuration
- Large marketplace (15,000+ actions)
- Matrix builds for parallel testing
- Environment protection rules
- OIDC for Azure authentication (no secrets)
- Free tier generous (2,000 minutes/month)
- GitHub-hosted and self-hosted runners
- Excellent visibility in PRs
- Reusable workflows

**Cons:**
- Limited build minutes on free tier for private repos
- Debugging can be challenging
- No native dashboard (Actions UI is basic)
- Workflow syntax can be verbose
- Limited caching compared to some alternatives

### Option B: Azure DevOps Pipelines

Microsoft's enterprise CI/CD platform.

**Pros:**
- Deep Azure integration
- Classic (GUI) and YAML pipelines
- Extensive enterprise features
- Built-in test management
- Release gates and approvals
- Good for large organizations

**Cons:**
- Separate from GitHub (context switching)
- More complex setup
- YAML syntax different from GitHub Actions
- Free tier more limited (1,800 minutes)
- Overkill for small team
- Less community action ecosystem

### Option C: CircleCI

Popular cloud CI/CD platform.

**Pros:**
- Fast builds
- Good caching
- Docker layer caching
- Orbs for reusable configs
- Parallelism and resource classes
- Good debugging (SSH into builds)

**Cons:**
- Third-party service (another vendor)
- Free tier limited (6,000 minutes)
- Adds complexity vs native GitHub
- Azure integration requires setup
- Cost scales with concurrency

### Option D: Jenkins

Self-hosted open-source automation server.

**Pros:**
- Highly customizable
- Extensive plugin ecosystem
- Self-hosted (data control)
- No per-minute costs
- Mature, battle-tested

**Cons:**
- Requires infrastructure management
- Plugin maintenance burden
- Security responsibility
- UI dated compared to modern tools
- Groovy pipeline syntax complexity
- No native GitHub integration

### Option E: GitLab CI/CD

GitLab's built-in CI/CD (with GitHub mirroring).

**Pros:**
- Powerful CI/CD features
- Auto DevOps
- Good container registry integration
- Built-in security scanning
- Free tier includes CI/CD

**Cons:**
- Requires GitHub mirroring (complexity)
- Better with GitLab as source control
- Context switching from GitHub
- Less Azure-native than alternatives

---

## Weighted Evaluation Matrix

| Criterion | Weight | GitHub Actions | Azure DevOps | CircleCI | Jenkins | GitLab CI |
|-----------|--------|----------------|--------------|----------|---------|-----------|
| **GitHub Integration** | 20% | 5 | 3 | 4 | 3 | 2 |
| **Azure Deployment** | 15% | 5 | 5 | 3 | 3 | 3 |
| **Ease of Use** | 15% | 5 | 3 | 4 | 2 | 4 |
| **Ecosystem** | 12% | 5 | 4 | 4 | 5 | 4 |
| **Cost** | 10% | 4 | 4 | 3 | 5 | 4 |
| **Flexibility** | 8% | 5 | 5 | 4 | 5 | 4 |
| **Security** | 8% | 5 | 5 | 4 | 3 | 4 |
| **Visibility** | 5% | 4 | 4 | 4 | 3 | 4 |
| **Self-Hosted** | 4% | 4 | 4 | 3 | 5 | 4 |
| **Reliability** | 3% | 4 | 5 | 4 | 3 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **GitHub Actions** | (5×.20)+(5×.15)+(5×.15)+(5×.12)+(4×.10)+(5×.08)+(5×.08)+(4×.05)+(4×.04)+(4×.03) | **4.79** |
| **Azure DevOps** | (3×.20)+(5×.15)+(3×.15)+(4×.12)+(4×.10)+(5×.08)+(5×.08)+(4×.05)+(4×.04)+(5×.03) | **3.95** |
| **CircleCI** | (4×.20)+(3×.15)+(4×.15)+(4×.12)+(3×.10)+(4×.08)+(4×.08)+(4×.05)+(3×.04)+(4×.03) | **3.71** |
| **GitLab CI** | (2×.20)+(3×.15)+(4×.15)+(4×.12)+(4×.10)+(4×.08)+(4×.08)+(4×.05)+(4×.04)+(4×.03) | **3.41** |
| **Jenkins** | (3×.20)+(3×.15)+(2×.15)+(5×.12)+(5×.10)+(5×.08)+(3×.08)+(3×.05)+(5×.04)+(3×.03) | **3.50** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **GitHub Actions** | 4.79 |
| 2 | Azure DevOps | 3.95 |
| 3 | CircleCI | 3.71 |
| 4 | Jenkins | 3.50 |
| 5 | GitLab CI | 3.41 |

---

## Analysis

### Why GitHub Actions Wins for ChaufHER

1. **Native Integration**: Source code and CI/CD in one place:
   - PR status checks automatic
   - Actions in repo context
   - No external service configuration
   - Branch protection with required checks

2. **Azure OIDC Authentication**: Federated credentials eliminate secrets:
   ```yaml
   - uses: azure/login@v1
     with:
       client-id: ${{ secrets.AZURE_CLIENT_ID }}
       tenant-id: ${{ secrets.AZURE_TENANT_ID }}
       subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
   ```

3. **Marketplace Ecosystem**: Pre-built actions for everything:
   - `azure/webapps-deploy` – App Service deployment
   - `azure/arm-deploy` – Bicep/ARM deployment
   - `actions/setup-dotnet` – .NET SDK setup
   - `docker/build-push-action` – Container builds

4. **Environment Protection**: Built-in deployment environments:
   - Required reviewers
   - Wait timers
   - Environment secrets
   - Deployment branches

5. **Reusable Workflows**: DRY principle for CI/CD:
   ```yaml
   jobs:
     deploy:
       uses: ./.github/workflows/deploy-template.yml
       with:
         environment: production
   ```

6. **Free Tier**: 2,000 minutes/month for private repos is sufficient for MVP.

### Azure DevOps Consideration

Azure DevOps scored well (3.95) and is a strong alternative for:
- Larger teams with complex release management
- Organizations using Azure Boards for work tracking
- Need for advanced test management features

For a small team with code on GitHub, the simplicity of GitHub Actions wins.

### When to Reconsider

Consider alternatives if:
- Build minutes become expensive at scale
- Complex release orchestration needed
- Azure Boards adoption for project management
- Self-hosted runners become primary (Jenkins may be simpler)

---

## Decision

**Selected: GitHub Actions** for CI/CD

### Workflow Structure

```
.github/
├── workflows/
│   ├── ci.yml              # PR checks (build, test, lint)
│   ├── deploy-dev.yml      # Deploy to development
│   ├── deploy-staging.yml  # Deploy to staging
│   ├── deploy-prod.yml     # Deploy to production
│   ├── infra.yml           # Infrastructure deployment
│   └── security.yml        # Security scanning
└── actions/
    └── deploy/
        └── action.yml      # Reusable deployment action
```

### CI Workflow (Pull Requests)

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'
      - run: dotnet build
      - run: dotnet test --no-build

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: dotnet format --verify-no-changes

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/analyze@v2
```

### Deployment Workflow

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - uses: azure/webapps-deploy@v2
        with:
          app-name: chaufher-prod-api
          package: ./publish
```

### Environment Configuration

| Environment | Trigger | Protection | Reviewers |
|-------------|---------|------------|-----------|
| Development | Push to `develop` | None | None |
| Staging | Push to `main` | Wait 5 min | None |
| Production | Manual dispatch | Required | 1 reviewer |

### Secrets Management

| Secret | Scope | Purpose |
|--------|-------|---------|
| `AZURE_CLIENT_ID` | Repository | OIDC app registration |
| `AZURE_TENANT_ID` | Repository | Azure AD tenant |
| `AZURE_SUBSCRIPTION_ID` | Repository | Target subscription |
| `NUGET_API_KEY` | Repository | Package publishing |

---

## Consequences

### Positive

- Single platform for code and CI/CD
- Native GitHub integration (PR checks, status)
- Azure OIDC eliminates credential management
- Large marketplace reduces custom scripting
- Free tier sufficient for MVP

### Negative

- Build minutes can become expensive at scale
- Debugging failed builds requires log analysis
- Complex workflows can become hard to maintain
- Limited compared to full CD platforms (Argo, Spinnaker)

### Neutral

- Team learns GitHub Actions (common skill)
- YAML workflows are version-controlled
- Can migrate to Azure DevOps if needed

---

## Related Documents

- [ADR-008: Cloud Provider Selection (Azure)](008-cloud-provider-azure.md)
- [ADR-010: Infrastructure as Code (Bicep)](010-infrastructure-bicep.md)
- [ADR-006: Team Communication (Slack)](006-team-communication.md)

---

## References

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Azure Login Action](https://github.com/Azure/login)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax Reference](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions)
