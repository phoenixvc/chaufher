# ADR-028: Container Runtime – Azure Container Apps

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps
**Technical Story:** Container orchestration and runtime for backend services

---

## Context

ChaufHER's backend consists of multiple .NET 9 services that need to be deployed, scaled, and managed:

- Rides API
- Users API
- Payments Service
- Notifications Service
- Background Job Workers

The platform must:
- Deploy containerized .NET services
- Scale based on demand (ride requests, peak hours)
- Provide zero-downtime deployments
- Handle service-to-service communication
- Integrate with Azure ecosystem
- Be cost-effective for startup scale
- Support SignalR real-time connections

---

## Decision Drivers

1. **Ease of Use** – Operational simplicity for small team
2. **Cost** – Startup-appropriate pricing
3. **Scaling** – Auto-scale based on demand
4. **Azure Integration** – Native integration with other Azure services
5. **Developer Experience** – Easy local development and deployment
6. **Managed Infrastructure** – Minimize ops burden
7. **Kubernetes Compatibility** – Future migration path
8. **Networking** – Ingress, service mesh, internal communication
9. **Observability** – Logging, tracing, metrics integration
10. **SignalR Support** – Sticky sessions, WebSocket handling

---

## Options Considered

### Option A: Azure Container Apps (ACA)

Managed container platform built on Kubernetes.

**Pros:**
- Serverless containers (pay per use)
- Built-in auto-scaling (including scale to zero)
- Native Azure integration
- Dapr integration for microservices
- Simple deployment model
- KEDA-based scaling
- Revision management
- No Kubernetes expertise needed

**Cons:**
- Less control than full Kubernetes
- Some advanced scenarios not supported
- Newer service (GA 2022)
- Limited customization

### Option B: Azure Kubernetes Service (AKS)

Managed Kubernetes cluster.

**Pros:**
- Full Kubernetes feature set
- Maximum flexibility
- Industry standard
- Portable to other clouds
- Large ecosystem

**Cons:**
- Operational complexity
- Requires Kubernetes expertise
- Minimum cluster cost even when idle
- More configuration required
- Overkill for 4-5 services

### Option C: Azure App Service

Managed PaaS for web apps.

**Pros:**
- Very simple deployment
- Built-in CI/CD
- Auto-scaling
- Multiple language support

**Cons:**
- Less container-native
- Limited networking options
- Can be expensive at scale
- Less flexibility

### Option D: Azure Functions

Serverless compute.

**Pros:**
- True serverless
- Pay only for execution
- Event-driven
- Simple functions model

**Cons:**
- Not suited for long-running services
- Cold start issues
- SignalR limitations
- Not ideal for REST APIs

---

## Weighted Evaluation Matrix

| Criterion | Weight | ACA | AKS | App Service | Functions |
|-----------|--------|-----|-----|-------------|-----------|
| **Ease of Use** | 20% | 5 | 2 | 5 | 4 |
| **Cost** | 18% | 5 | 3 | 3 | 4 |
| **Scaling** | 15% | 5 | 5 | 4 | 5 |
| **Azure Integration** | 12% | 5 | 4 | 5 | 5 |
| **Developer Experience** | 10% | 4 | 3 | 5 | 3 |
| **Managed Infrastructure** | 10% | 5 | 3 | 5 | 5 |
| **K8s Compatibility** | 5% | 4 | 5 | 1 | 1 |
| **Networking** | 5% | 4 | 5 | 3 | 2 |
| **Observability** | 3% | 5 | 5 | 4 | 4 |
| **SignalR Support** | 2% | 4 | 5 | 5 | 2 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure Container Apps** | (5×.20)+(5×.18)+(5×.15)+(5×.12)+(4×.10)+(5×.10)+(4×.05)+(4×.05)+(5×.03)+(4×.02) | **4.73** |
| **Azure Kubernetes Service** | (2×.20)+(3×.18)+(5×.15)+(4×.12)+(3×.10)+(3×.10)+(5×.05)+(5×.05)+(5×.03)+(5×.02) | **3.45** |
| **Azure App Service** | (5×.20)+(3×.18)+(4×.15)+(5×.12)+(5×.10)+(5×.10)+(1×.05)+(3×.05)+(4×.03)+(5×.02) | **4.16** |
| **Azure Functions** | (4×.20)+(4×.18)+(5×.15)+(5×.12)+(3×.10)+(5×.10)+(1×.05)+(2×.05)+(4×.03)+(2×.02) | **4.04** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Azure Container Apps** | 4.73 |
| 2 | Azure App Service | 4.16 |
| 3 | Azure Functions | 4.04 |
| 4 | Azure Kubernetes Service | 3.45 |

---

## Decision

**Selected: Azure Container Apps** for all backend services

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTAINER APPS ENVIRONMENT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                          INGRESS (Front Door)                         │   │
│  └─────────────────────────────────┬────────────────────────────────────┘   │
│                                    │                                         │
│       ┌────────────────────────────┼────────────────────────────┐           │
│       │                            │                            │           │
│       ▼                            ▼                            ▼           │
│  ┌──────────┐              ┌──────────┐              ┌──────────┐          │
│  │ Rides    │              │ Users    │              │ Payments │          │
│  │ API      │              │ API      │              │ Service  │          │
│  │ (2-10)   │              │ (2-5)    │              │ (2-3)    │          │
│  └──────────┘              └──────────┘              └──────────┘          │
│       │                            │                            │           │
│       └────────────────────────────┼────────────────────────────┘           │
│                                    │                                         │
│                                    ▼                                         │
│                          ┌──────────────────┐                               │
│                          │ Hangfire Workers │                               │
│                          │ (Background Jobs)│                               │
│                          │ (1-3)            │                               │
│                          └──────────────────┘                               │
│                                                                              │
│  Internal networking: Container Apps internal DNS                            │
│  External: Azure Front Door → Container Apps ingress                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Container App Configuration

```bicep
resource ridesApi 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'ca-chaufher-rides-api'
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'http'
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]
      }
      secrets: [
        {
          name: 'connection-string'
          keyVaultUrl: 'https://kv-chaufher.vault.azure.net/secrets/db-connection'
          identity: 'system'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'rides-api'
          image: 'ghcr.io/chaufher/rides-api:${imageTag}'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'ASPNETCORE_ENVIRONMENT'
              value: environment
            }
            {
              name: 'ConnectionStrings__Default'
              secretRef: 'connection-string'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 2
        maxReplicas: 10
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  }
}
```

### Scaling Rules

| Service | Min | Max | Scaling Trigger |
|---------|-----|-----|-----------------|
| Rides API | 2 | 10 | HTTP requests (100 concurrent) |
| Users API | 2 | 5 | HTTP requests (100 concurrent) |
| Payments | 2 | 3 | HTTP requests (50 concurrent) |
| Workers | 1 | 3 | Queue depth |

### Cost Estimate (MVP)

| Service | vCPU | Memory | Est. Monthly |
|---------|------|--------|--------------|
| Rides API (2 replicas) | 1.0 | 2 GB | ~R800 |
| Users API (2 replicas) | 0.5 | 1 GB | ~R400 |
| Payments (2 replicas) | 0.5 | 1 GB | ~R400 |
| Workers (1 replica) | 0.5 | 1 GB | ~R200 |
| Environment | - | - | ~R300 |
| **Total** | | | **~R2,100/month** |

---

## Consequences

### Positive

- Simple deployment model without Kubernetes complexity
- Cost-effective with scale-to-minimum capability
- Native Azure integration (managed identity, Key Vault)
- Easy CI/CD with GitHub Actions
- Built-in revision management for rollbacks

### Negative

- Less flexibility than full Kubernetes
- Vendor lock-in to Azure
- Some advanced networking scenarios not supported

### Neutral

- Team learns Container Apps specifics
- Can migrate to AKS if needed for advanced scenarios
- Dapr available for service mesh if needed later

---

## Related Documents

- [ADR-008: Cloud Provider (Azure)](008-cloud-provider-azure.md)
- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)
- [ADR-010: Infrastructure as Code (Bicep)](010-infrastructure-bicep.md)
- [ADR-011: CI/CD (GitHub Actions)](011-cicd-github-actions.md)

---

## References

- [Azure Container Apps Documentation](https://docs.microsoft.com/azure/container-apps/)
- [Container Apps vs AKS](https://docs.microsoft.com/azure/container-apps/compare-options)
- [KEDA Scaling](https://keda.sh/)
- [Dapr in Container Apps](https://docs.microsoft.com/azure/container-apps/dapr-overview)
