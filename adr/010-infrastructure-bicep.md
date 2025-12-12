# ADR-010: Infrastructure as Code – Bicep

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps
**Technical Story:** Infrastructure as Code tooling selection for Azure resources

---

## Context

ChaufHER requires Infrastructure as Code (IaC) tooling for:
- Provisioning Azure resources (App Service, PostgreSQL, Redis, etc.)
- Environment consistency (dev, staging, production)
- Version-controlled infrastructure changes
- Automated deployments via CI/CD
- Drift detection and remediation
- Documentation of infrastructure

The tool must:
- Support all required Azure services
- Enable modular, reusable configurations
- Integrate with GitHub Actions
- Have reasonable learning curve for small team
- Provide good error messages and validation

---

## Decision Drivers

1. **Azure Support** – Comprehensive, day-zero support for Azure services
2. **Learning Curve** – Ease of adoption for team
3. **Modularity** – Reusable components, DRY principle
4. **Validation** – Pre-deployment checks, clear errors
5. **State Management** – Handling infrastructure state
6. **Community** – Documentation, examples, support
7. **CI/CD Integration** – GitHub Actions compatibility
8. **Portability** – Multi-cloud potential (if needed)
9. **Microsoft Support** – Long-term commitment
10. **Tooling** – IDE support, linting, formatting

---

## Options Considered

### Option A: Bicep

Azure's domain-specific language for deploying Azure resources.

**Pros:**
- Native Azure support (Microsoft-developed)
- Day-zero support for new Azure features
- Clean, readable syntax (vs ARM JSON)
- No state file management (Azure is source of truth)
- Excellent VS Code extension (intellisense, validation)
- Compiles to ARM templates (full compatibility)
- Modular with parameters and modules
- What-if deployment preview
- Free, open-source

**Cons:**
- Azure-only (no multi-cloud)
- Newer than Terraform (smaller community)
- Limited ecosystem compared to Terraform
- No import for existing resources (in preview)
- Less mature tooling than Terraform

### Option B: Terraform (HashiCorp)

Multi-cloud IaC tool with declarative HCL syntax.

**Pros:**
- Multi-cloud support (Azure, AWS, GCP, etc.)
- Large community and module registry
- Mature ecosystem (10+ years)
- State management with remote backends
- `terraform plan` for change preview
- Extensive provider ecosystem
- Well-documented patterns

**Cons:**
- State file management complexity
- Azure provider may lag behind new features
- HCL syntax learning curve
- License change controversy (BSL)
- Requires Terraform Cloud or state backend setup
- More complex than Bicep for Azure-only

### Option C: Pulumi

Modern IaC using general-purpose languages.

**Pros:**
- Use C#, TypeScript, Python, Go (familiar languages)
- Multi-cloud support
- Modern developer experience
- Strong typing with IDE support
- Component model for reuse

**Cons:**
- Requires Pulumi Cloud or self-hosted backend
- More complex than declarative approaches
- Smaller community than Terraform
- Cost for team features
- Overkill for simple Azure deployments

### Option D: ARM Templates

Azure's native JSON-based resource deployment.

**Pros:**
- Native Azure support
- Full feature coverage
- No additional tooling needed
- Direct Azure integration

**Cons:**
- Verbose JSON syntax
- Poor readability
- Limited modularity
- Error messages can be cryptic
- Difficult to maintain at scale
- Bicep supersedes ARM

### Option E: Azure CLI Scripts

Imperative infrastructure deployment using az commands.

**Pros:**
- Simple, familiar commands
- Quick for small deployments
- No additional tooling
- Good for prototyping

**Cons:**
- Imperative, not declarative
- No state management
- Difficult to ensure idempotency
- Not suitable for complex infrastructure
- Poor auditability
- Scripting complexity at scale

---

## Weighted Evaluation Matrix

| Criterion | Weight | Bicep | Terraform | Pulumi | ARM | CLI Scripts |
|-----------|--------|-------|-----------|--------|-----|-------------|
| **Azure Support** | 20% | 5 | 4 | 4 | 5 | 4 |
| **Learning Curve** | 15% | 5 | 3 | 3 | 2 | 5 |
| **Modularity** | 12% | 4 | 5 | 5 | 2 | 1 |
| **Validation** | 12% | 5 | 4 | 4 | 3 | 2 |
| **State Management** | 10% | 5 | 3 | 3 | 5 | 1 |
| **Community** | 10% | 3 | 5 | 3 | 4 | 4 |
| **CI/CD Integration** | 8% | 5 | 5 | 4 | 4 | 4 |
| **Portability** | 5% | 1 | 5 | 5 | 1 | 1 |
| **Microsoft Support** | 5% | 5 | 3 | 3 | 5 | 4 |
| **Tooling** | 3% | 5 | 4 | 4 | 3 | 3 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Bicep** | (5×.20)+(5×.15)+(4×.12)+(5×.12)+(5×.10)+(3×.10)+(5×.08)+(1×.05)+(5×.05)+(5×.03) | **4.42** |
| **Terraform** | (4×.20)+(3×.15)+(5×.12)+(4×.12)+(3×.10)+(5×.10)+(5×.08)+(5×.05)+(3×.05)+(4×.03) | **4.01** |
| **Pulumi** | (4×.20)+(3×.15)+(5×.12)+(4×.12)+(3×.10)+(3×.10)+(4×.08)+(5×.05)+(3×.05)+(4×.03) | **3.74** |
| **ARM** | (5×.20)+(2×.15)+(2×.12)+(3×.12)+(5×.10)+(4×.10)+(4×.08)+(1×.05)+(5×.05)+(3×.03) | **3.53** |
| **CLI Scripts** | (4×.20)+(5×.15)+(1×.12)+(2×.12)+(1×.10)+(4×.10)+(4×.08)+(1×.05)+(4×.05)+(3×.03) | **3.03** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Bicep** | 4.42 |
| 2 | Terraform | 4.01 |
| 3 | Pulumi | 3.74 |
| 4 | ARM Templates | 3.53 |
| 5 | CLI Scripts | 3.03 |

---

## Analysis

### Why Bicep Wins for ChaufHER

1. **Azure-Native**: Bicep is developed by Microsoft specifically for Azure:
   - Day-zero support for new Azure services
   - No waiting for provider updates
   - Direct compilation to ARM templates

2. **No State File**: Bicep uses Azure Resource Manager as source of truth:
   - No state file to manage/secure
   - No state locking issues
   - Simpler CI/CD pipelines

3. **Clean Syntax**: Drastically simpler than ARM JSON:
   ```bicep
   resource appService 'Microsoft.Web/sites@2022-03-01' = {
     name: 'chaufher-${environment}-api'
     location: location
     properties: {
       serverFarmId: appServicePlan.id
     }
   }
   ```

4. **Excellent Validation**: `bicep build` and `what-if` deployments:
   - Syntax errors caught early
   - Preview changes before deployment
   - Clear error messages

5. **Learning Curve**: Simpler than Terraform for Azure-only:
   - Fewer concepts (no providers, backends, state)
   - Familiar to anyone with ARM experience
   - Quick to be productive

### Terraform Consideration

Terraform scored well (4.01) and is the industry standard. Key differences:
- Terraform better for multi-cloud (not our current need)
- Terraform has larger module ecosystem
- Bicep simpler for Azure-only deployments

**Recommendation**: If multi-cloud becomes a requirement, evaluate Terraform migration.

### When to Reconsider

Consider Terraform if:
- Multi-cloud deployment becomes necessary
- Need for Terraform's extensive module registry
- Team has deep Terraform expertise
- HashiCorp ecosystem (Vault, Consul) adopted

---

## Decision

**Selected: Bicep** for Azure infrastructure

### Module Structure

```
modules/
├── app-service/
│   ├── main.bicep      # App Service resource
│   └── outputs.bicep   # Outputs
├── postgresql/
│   ├── main.bicep      # PostgreSQL Flexible Server
│   └── outputs.bicep
├── redis/
│   ├── main.bicep      # Azure Cache for Redis
│   └── outputs.bicep
├── signalr/
│   ├── main.bicep      # SignalR Service
│   └── outputs.bicep
├── key-vault/
│   ├── main.bicep      # Key Vault with secrets
│   └── outputs.bicep
└── networking/
    ├── main.bicep      # VNet, NSGs, Private Endpoints
    └── outputs.bicep

environments/
├── dev.bicepparam      # Development parameters
├── staging.bicepparam  # Staging parameters
└── prod.bicepparam     # Production parameters

main.bicep              # Root orchestration template
```

### Naming Convention

```bicep
var resourcePrefix = 'chaufher-${environment}'

// Examples:
// chaufher-dev-api
// chaufher-prod-redis
// chaufher-staging-db
```

### Deployment Pipeline

```yaml
# GitHub Actions
- name: Deploy Infrastructure
  uses: azure/arm-deploy@v1
  with:
    subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    resourceGroupName: chaufher-${{ env.ENVIRONMENT }}-rg
    template: ./main.bicep
    parameters: ./environments/${{ env.ENVIRONMENT }}.bicepparam
```

### What-If Preview

```bash
az deployment group what-if \
  --resource-group chaufher-dev-rg \
  --template-file main.bicep \
  --parameters environments/dev.bicepparam
```

---

## Consequences

### Positive

- Day-zero Azure feature support
- No state file management overhead
- Clean, readable syntax
- Excellent VS Code tooling
- Direct Microsoft support

### Negative

- Azure-only (no multi-cloud portability)
- Smaller community than Terraform
- Fewer pre-built modules available
- Import for existing resources still maturing

### Neutral

- Team builds Bicep expertise (Azure-specific skill)
- Can generate ARM templates if needed
- Architecture decisions are Azure-committed

---

## Related Documents

- [ADR-008: Cloud Provider Selection (Azure)](008-cloud-provider-azure.md)
- [ADR-011: CI/CD Platform (GitHub Actions)](011-cicd-github-actions.md)

---

## References

- [Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)
- [Bicep Playground](https://aka.ms/bicepdemo)
- [Bicep VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep)
- [Azure Verified Modules](https://aka.ms/avm)
