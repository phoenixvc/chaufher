# ADR-021: Feature Flags – Azure App Configuration

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Product
**Technical Story:** Feature flag management for staged rollouts and experimentation

---

## Context

ChaufHER requires feature flag capabilities for:
- Staged rollouts (canary releases)
- A/B testing experiments
- Kill switches for problematic features
- Beta features for select users
- Environment-specific configurations
- Gradual percentage-based rollouts

The platform must:
- Support both client (PWA) and server (.NET) flags
- Allow dynamic flag changes without deployment
- Provide targeting (user segments, percentages)
- Integrate with Azure ecosystem
- Be cost-effective for startup
- Not impact application performance

---

## Decision Drivers

1. **Azure Integration** – Native Azure ecosystem fit
2. **Cost** – Pricing for startup scale
3. **Dynamic Updates** – Change flags without deploy
4. **Targeting** – User segments, percentages
5. **Performance** – Flag evaluation speed
6. **Developer Experience** – SDK quality
7. **Dashboard** – Flag management UI
8. **Audit Trail** – Who changed what, when
9. **PWA Support** – Client-side flags
10. **Simplicity** – Setup and maintenance

---

## Options Considered

### Option A: Azure App Configuration

Microsoft's configuration and feature flag service.

**Pros:**
- Native Azure integration
- Feature flags built-in
- Managed identity auth
- .NET SDK excellent
- Real-time updates (SignalR)
- Key Vault integration
- Audit logging
- Free tier (1,000 requests/day)
- Percentage-based targeting
- User targeting

**Cons:**
- Basic compared to LaunchDarkly
- Limited experimentation features
- No A/B testing analytics
- Targeting less sophisticated
- JavaScript SDK newer

### Option B: LaunchDarkly

Industry-leading feature management.

**Pros:**
- Most feature-rich solution
- Advanced targeting rules
- Experimentation platform
- Excellent SDKs all platforms
- Real-time updates
- Detailed analytics
- Workflow integrations

**Cons:**
- Expensive ($10/seat/month minimum)
- Overkill for MVP
- Another vendor to manage
- Not Azure-native

### Option C: Split.io

Feature flags with experimentation.

**Pros:**
- Good feature set
- Experimentation focus
- Free tier (10 seats)
- Good SDKs

**Cons:**
- Less popular than LaunchDarkly
- Not Azure-native
- Limited integrations
- Steeper learning curve

### Option D: Unleash

Open-source feature management.

**Pros:**
- Open-source (free)
- Self-hosted option
- Growing community
- Basic targeting

**Cons:**
- Self-hosting overhead
- Less polished than commercial
- Fewer integrations
- Limited analytics

### Option E: Custom Implementation

Build with configuration/database.

**Pros:**
- Full control
- No vendor cost
- Simple requirements

**Cons:**
- Development time
- No real-time updates
- Manual targeting logic
- No dashboard
- Technical debt

---

## Weighted Evaluation Matrix

| Criterion | Weight | Azure App Config | LaunchDarkly | Split.io | Unleash | Custom |
|-----------|--------|------------------|--------------|----------|---------|--------|
| **Azure Integration** | 20% | 5 | 2 | 2 | 3 | 4 |
| **Cost** | 15% | 5 | 2 | 4 | 5 | 5 |
| **Dynamic Updates** | 12% | 5 | 5 | 5 | 4 | 2 |
| **Targeting** | 12% | 4 | 5 | 5 | 3 | 2 |
| **Performance** | 10% | 5 | 5 | 4 | 4 | 4 |
| **Developer Experience** | 10% | 4 | 5 | 4 | 3 | 3 |
| **Dashboard** | 8% | 4 | 5 | 4 | 3 | 1 |
| **Audit Trail** | 5% | 5 | 5 | 4 | 3 | 2 |
| **PWA Support** | 5% | 3 | 5 | 4 | 3 | 3 |
| **Simplicity** | 3% | 4 | 3 | 3 | 2 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure App Config** | (5×.20)+(5×.15)+(5×.12)+(4×.12)+(5×.10)+(4×.10)+(4×.08)+(5×.05)+(3×.05)+(4×.03) | **4.55** |
| **LaunchDarkly** | (2×.20)+(2×.15)+(5×.12)+(5×.12)+(5×.10)+(5×.10)+(5×.08)+(5×.05)+(5×.05)+(3×.03) | **3.89** |
| **Split.io** | (2×.20)+(4×.15)+(5×.12)+(5×.12)+(4×.10)+(4×.10)+(4×.08)+(4×.05)+(4×.05)+(3×.03) | **3.81** |
| **Unleash** | (3×.20)+(5×.15)+(4×.12)+(3×.12)+(4×.10)+(3×.10)+(3×.08)+(3×.05)+(3×.05)+(2×.03) | **3.54** |
| **Custom** | (4×.20)+(5×.15)+(2×.12)+(2×.12)+(4×.10)+(3×.10)+(1×.08)+(2×.05)+(3×.05)+(4×.03) | **3.19** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Azure App Configuration** | 4.55 |
| 2 | LaunchDarkly | 3.89 |
| 3 | Split.io | 3.81 |
| 4 | Unleash | 3.54 |
| 5 | Custom | 3.19 |

---

## Analysis

### Why Azure App Configuration Wins for ChaufHER

1. **Azure Native**: Seamless integration:
   - Same subscription
   - Managed identity auth
   - Azure Portal management
   - Single billing

2. **Free Tier**: Sufficient for MVP:
   - 1,000 requests/day free
   - 10 MB storage
   - Feature flags included
   - No per-seat pricing

3. **Feature Flag Capabilities**:
   ```csharp
   // Percentage rollout
   "BetaBookingFlow": {
     "enabled": true,
     "conditions": {
       "client_filters": [{
         "name": "Percentage",
         "parameters": { "Value": 25 }
       }]
     }
   }

   // User targeting
   "PremiumFeatures": {
     "enabled": true,
     "conditions": {
       "client_filters": [{
         "name": "Targeting",
         "parameters": {
           "Users": ["user-123", "user-456"],
           "Groups": ["beta-testers"]
         }
       }]
     }
   }
   ```

4. **Real-Time Updates**: Via SignalR/polling:
   - Change flag in Azure Portal
   - Apps pick up change within seconds
   - No deployment needed

5. **Right-Sized**: MVP-appropriate features without complexity of LaunchDarkly.

### LaunchDarkly Consideration

LaunchDarkly scored well (3.89) and is better for:
- Large engineering teams
- Complex experimentation needs
- Multi-platform consistency
- Advanced analytics

For MVP with small team, Azure App Configuration is sufficient.

### When to Reconsider

Consider LaunchDarkly if:
- Need advanced A/B testing analytics
- Team grows significantly
- Complex targeting rules required
- Multi-platform beyond .NET/PWA

---

## Decision

**Selected: Azure App Configuration** for feature flags

### Feature Flag Strategy

| Flag Type | Use Case | Example |
|-----------|----------|---------|
| **Release** | Gradual rollout | `NewBookingFlow` |
| **Ops** | Kill switch | `DisablePayments` |
| **Experiment** | A/B test | `AlternateDriverCard` |
| **Permission** | User segment | `BetaTesterFeatures` |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Feature Flag Flow                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │  Azure Portal    │────▶│ Azure App        │                  │
│  │  (Manage Flags)  │     │ Configuration    │                  │
│  └──────────────────┘     └────────┬─────────┘                  │
│                                    │                             │
│                    ┌───────────────┼───────────────┐            │
│                    │               │               │            │
│                    ▼               ▼               ▼            │
│           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│           │  .NET API    │ │  PWA App     │ │  Admin Web   │   │
│           │  (Server)    │ │  (Client)    │ │  (Client)    │   │
│           └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### .NET Integration

```csharp
// Program.cs
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(connectionString)
           .UseFeatureFlags(featureOptions =>
           {
               featureOptions.CacheExpirationInterval = TimeSpan.FromSeconds(30);
           });
});

builder.Services.AddFeatureManagement();

// Controller usage
public class RidesController : ControllerBase
{
    private readonly IFeatureManager _featureManager;

    [HttpPost]
    public async Task<IActionResult> CreateRide(CreateRideRequest request)
    {
        if (await _featureManager.IsEnabledAsync("NewBookingFlow"))
        {
            return await CreateRideV2(request);
        }
        return await CreateRideV1(request);
    }
}

// Attribute-based
[FeatureGate("BetaFeatures")]
[HttpGet("beta/stats")]
public async Task<IActionResult> GetBetaStats() { ... }
```

### PWA Integration

```typescript
// Feature flag service
class FeatureFlagService {
  private flags: Map<string, boolean> = new Map();

  async loadFlags(): Promise<void> {
    const response = await fetch('/api/feature-flags');
    const flags = await response.json();
    this.flags = new Map(Object.entries(flags));
  }

  isEnabled(flag: string): boolean {
    return this.flags.get(flag) ?? false;
  }
}

// Component usage
function BookingFlow() {
  const featureFlags = useFeatureFlags();

  if (featureFlags.isEnabled('NewBookingFlow')) {
    return <NewBookingFlow />;
  }
  return <LegacyBookingFlow />;
}
```

### API Endpoint for PWA

```csharp
[ApiController]
[Route("api/feature-flags")]
public class FeatureFlagsController : ControllerBase
{
    private readonly IFeatureManager _featureManager;

    [HttpGet]
    public async Task<IActionResult> GetFlags()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var context = new FeatureFilterContext { UserId = userId };

        var flags = new Dictionary<string, bool>
        {
            ["NewBookingFlow"] = await _featureManager.IsEnabledAsync("NewBookingFlow", context),
            ["BetaFeatures"] = await _featureManager.IsEnabledAsync("BetaFeatures", context),
            ["AlternateDriverCard"] = await _featureManager.IsEnabledAsync("AlternateDriverCard", context)
        };

        return Ok(flags);
    }
}
```

### Configuration

```json
// Azure App Configuration feature flags
{
  "feature_management": {
    "feature_flags": [
      {
        "id": "NewBookingFlow",
        "enabled": true,
        "conditions": {
          "client_filters": [
            {
              "name": "Percentage",
              "parameters": { "Value": 10 }
            }
          ]
        }
      },
      {
        "id": "DisablePayments",
        "enabled": false
      },
      {
        "id": "BetaFeatures",
        "enabled": true,
        "conditions": {
          "client_filters": [
            {
              "name": "Targeting",
              "parameters": {
                "Users": ["beta-user-1", "beta-user-2"]
              }
            }
          ]
        }
      }
    ]
  }
}
```

---

## Consequences

### Positive

- Native Azure integration simplifies setup
- Free tier covers MVP needs
- No per-seat licensing costs
- Real-time flag updates
- Managed identity authentication

### Negative

- Less sophisticated than LaunchDarkly
- Limited experimentation analytics
- JavaScript SDK less mature
- Basic targeting rules

### Neutral

- Team learns Azure App Configuration
- Can add analytics separately
- Can migrate to LaunchDarkly if needed

---

## Related Documents

- [ADR-008: Cloud Provider (Azure)](008-cloud-provider-azure.md)
- [ADR-011: CI/CD (GitHub Actions)](011-cicd-github-actions.md)
- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)

---

## References

- [Azure App Configuration](https://docs.microsoft.com/azure/azure-app-configuration/)
- [Feature Flags in .NET](https://docs.microsoft.com/azure/azure-app-configuration/quickstart-feature-flag-aspnet-core)
- [Feature Management Library](https://github.com/microsoft/FeatureManagement-Dotnet)
- [Azure App Configuration Pricing](https://azure.microsoft.com/pricing/details/app-configuration/)
