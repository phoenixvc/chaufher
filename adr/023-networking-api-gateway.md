# ADR-023: Networking & API Gateway – Azure Front Door

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps, Security
**Technical Story:** Network architecture, API gateway, traffic management, and edge security

---

## Context

ChaufHER requires a robust networking architecture for:
- Global load balancing and traffic distribution
- API gateway functionality (routing, rate limiting, authentication)
- DDoS protection and WAF (Web Application Firewall)
- SSL/TLS termination
- CDN for static assets
- Health monitoring and failover
- Future multi-region expansion

The platform must:
- Handle variable traffic patterns (rush hour spikes)
- Protect against common web attacks (OWASP Top 10)
- Provide low latency for South African users
- Support WebSocket connections (SignalR)
- Enable zero-downtime deployments
- Be cost-effective for startup scale

---

## Decision Drivers

1. **Azure Integration** – Native Azure ecosystem fit
2. **Security** – WAF, DDoS protection
3. **Performance** – Latency, global edge
4. **WebSocket Support** – SignalR compatibility
5. **Cost** – Pricing at MVP scale
6. **Scalability** – Handle traffic growth
7. **Observability** – Logging, metrics
8. **SSL Management** – Certificate handling
9. **Health Checks** – Automatic failover
10. **Simplicity** – Operational complexity

---

## Options Considered

### Option A: Azure Front Door (Premium)

Microsoft's global load balancer with integrated WAF.

**Pros:**
- Native Azure integration
- Global anycast network
- Integrated WAF (managed rules)
- DDoS protection included
- WebSocket support
- SSL termination with managed certificates
- Health probes and automatic failover
- Real-time analytics
- Private Link support
- Rules engine for routing

**Cons:**
- More expensive than basic options
- Learning curve for rules engine
- Some features require Premium tier
- Overkill for single-region MVP

### Option B: Azure Application Gateway

Regional load balancer with WAF.

**Pros:**
- Lower cost than Front Door
- WAF v2 with custom rules
- WebSocket support
- URL-based routing
- SSL termination
- Azure-native

**Cons:**
- Regional only (not global)
- No built-in CDN
- Manual scaling configuration
- No global anycast
- Less suitable for multi-region

### Option C: Azure API Management

Full API gateway with developer portal.

**Pros:**
- Complete API gateway features
- Rate limiting built-in
- API versioning
- Developer portal
- Request/response transformation
- Caching
- OAuth integration

**Cons:**
- Expensive ($150+/month minimum)
- Complex for simple routing
- No WAF included (needs separate)
- Overkill for MVP
- Longer cold start times

### Option D: Kong Gateway (Self-hosted)

Open-source API gateway.

**Pros:**
- Open-source (free)
- Highly extensible (plugins)
- Rate limiting, auth, logging
- Community support
- Multi-cloud portable

**Cons:**
- Operational overhead
- Self-hosted responsibility
- Need separate WAF/DDoS
- Need separate load balancer
- More complex setup

### Option E: Nginx + Azure Load Balancer

Traditional reverse proxy setup.

**Pros:**
- Proven technology
- Full control
- Low cost
- Highly configurable
- Container-friendly

**Cons:**
- Manual configuration
- Self-managed SSL
- No managed WAF
- Operational overhead
- No global distribution

---

## Weighted Evaluation Matrix

| Criterion | Weight | Front Door | App Gateway | API Mgmt | Kong | Nginx |
|-----------|--------|------------|-------------|----------|------|-------|
| **Azure Integration** | 18% | 5 | 5 | 5 | 2 | 3 |
| **Security** | 18% | 5 | 4 | 3 | 3 | 2 |
| **Performance** | 15% | 5 | 4 | 3 | 4 | 4 |
| **WebSocket Support** | 12% | 5 | 5 | 3 | 5 | 5 |
| **Cost** | 10% | 3 | 4 | 2 | 5 | 5 |
| **Scalability** | 8% | 5 | 4 | 5 | 4 | 3 |
| **Observability** | 7% | 5 | 4 | 5 | 4 | 3 |
| **SSL Management** | 5% | 5 | 4 | 4 | 3 | 2 |
| **Health Checks** | 4% | 5 | 5 | 4 | 4 | 3 |
| **Simplicity** | 3% | 4 | 4 | 2 | 2 | 3 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure Front Door** | (5×.18)+(5×.18)+(5×.15)+(5×.12)+(3×.10)+(5×.08)+(5×.07)+(5×.05)+(5×.04)+(4×.03) | **4.67** |
| **App Gateway** | (5×.18)+(4×.18)+(4×.15)+(5×.12)+(4×.10)+(4×.08)+(4×.07)+(4×.05)+(5×.04)+(4×.03) | **4.33** |
| **Kong** | (2×.18)+(3×.18)+(4×.15)+(5×.12)+(5×.10)+(4×.08)+(4×.07)+(3×.05)+(4×.04)+(2×.03) | **3.55** |
| **Nginx** | (3×.18)+(2×.18)+(4×.15)+(5×.12)+(5×.10)+(3×.08)+(3×.07)+(2×.05)+(3×.04)+(3×.03) | **3.38** |
| **API Management** | (5×.18)+(3×.18)+(3×.15)+(3×.12)+(2×.10)+(5×.08)+(5×.07)+(4×.05)+(4×.04)+(2×.03) | **3.54** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Azure Front Door** | 4.67 |
| 2 | Azure Application Gateway | 4.33 |
| 3 | Kong Gateway | 3.55 |
| 4 | Azure API Management | 3.54 |
| 5 | Nginx | 3.38 |

---

## Analysis

### Why Azure Front Door Wins for ChaufHER

1. **Integrated Security**: Single service for:
   - WAF with OWASP managed rules
   - DDoS protection (Azure DDoS Standard)
   - Bot protection
   - Rate limiting
   - Geo-filtering

2. **Global Performance**: Even for SA-only MVP:
   - Anycast edge locations
   - Connection pooling to backends
   - HTTP/2 and HTTP/3 support
   - Compression

3. **WebSocket Support**: Critical for SignalR:
   - Full WebSocket passthrough
   - Long-lived connections
   - No timeout issues

4. **Managed Certificates**: Zero-touch SSL:
   - Auto-provision Let's Encrypt
   - Auto-renewal
   - Custom domain support

5. **Future-Ready**: Multi-region expansion:
   - Add backends in other regions
   - Traffic shifting (canary)
   - Geo-routing

### MVP vs Scale Architecture

**MVP (Single Region):**
```
Internet → Azure Front Door → Container Apps (Johannesburg)
```

**Scale (Multi-Region):**
```
Internet → Azure Front Door → ┬→ Container Apps (Johannesburg) [Primary]
                              └→ Container Apps (Cape Town) [DR]
```

### Application Gateway Consideration

Application Gateway scored well (4.33) and is suitable if:
- Staying single-region permanently
- Need WAF but not global distribution
- Cost is primary concern (~30% cheaper)

For ChaufHER, Front Door's global capabilities and simpler multi-region path justify the investment.

### When to Reconsider

Consider alternatives if:
- Cost becomes prohibitive (switch to App Gateway)
- Need advanced API gateway features (add API Management behind Front Door)
- Multi-cloud requirement (consider Kong or Cloudflare)

---

## Decision

**Selected: Azure Front Door (Premium)** with WAF integration

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        NETWORK ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         ┌─────────────────┐                             │
│                         │    Internet     │                             │
│                         └────────┬────────┘                             │
│                                  │                                       │
│                                  ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Azure Front Door (Premium)                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │  │
│  │  │   WAF       │  │   SSL       │  │   Routing   │               │  │
│  │  │   (OWASP)   │  │   Termn.    │  │   Rules     │               │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘               │  │
│  └───────────────────────────┬───────────────────────────────────────┘  │
│                              │                                           │
│          ┌───────────────────┼───────────────────┐                      │
│          │                   │                   │                      │
│          ▼                   ▼                   ▼                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐               │
│  │   CDN        │   │   API        │   │   WebSocket  │               │
│  │   (Static)   │   │   Traffic    │   │   (SignalR)  │               │
│  │              │   │              │   │              │               │
│  │  /static/*   │   │  /api/*      │   │  /hubs/*     │               │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘               │
│         │                  │                  │                        │
│         │                  ▼                  │                        │
│         │      ┌───────────────────────┐      │                        │
│         │      │  Azure Container Apps │      │                        │
│         │      │  ┌─────┐ ┌─────┐     │      │                        │
│         │      │  │Rides│ │Users│ ... │◀─────┘                        │
│         │      │  └─────┘ └─────┘     │                               │
│         │      └───────────────────────┘                               │
│         │                  │                                           │
│         ▼                  ▼                                           │
│  ┌──────────────┐  ┌──────────────┐                                   │
│  │ Blob Storage │  │  PostgreSQL  │                                   │
│  │   (Assets)   │  │    Redis     │                                   │
│  └──────────────┘  └──────────────┘                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Routing Configuration

| Route | Pattern | Backend | Cache |
|-------|---------|---------|-------|
| **Static Assets** | `/static/*`, `/*.js`, `/*.css` | Blob Storage | 1 day |
| **API** | `/api/*` | Container Apps | None |
| **SignalR** | `/hubs/*` | Container Apps | None |
| **Health** | `/health` | Container Apps | None |
| **Default** | `/*` | Blob Storage (PWA) | 1 hour |

### WAF Rules

| Rule Set | Action | Purpose |
|----------|--------|---------|
| **OWASP 3.2** | Block | SQL injection, XSS, etc. |
| **Bot Manager** | Challenge | Scraper/bot protection |
| **Rate Limit** | Rate limit | 1000 req/min per IP |
| **Geo Filter** | Allow | South Africa only (initially) |
| **Custom** | Various | App-specific rules |

### Rate Limiting

| Endpoint | Limit | Window | Action |
|----------|-------|--------|--------|
| `/api/auth/*` | 10 | 1 min | Block |
| `/api/rides/estimate` | 30 | 1 min | Block |
| `/api/*` | 1000 | 1 min | Block |
| `/hubs/*` | 100 connections | - | Reject |

### SSL/TLS Configuration

```hcl
# Bicep configuration
resource frontDoor 'Microsoft.Cdn/profiles@2023-05-01' = {
  name: 'afd-chaufher-${env}'
  location: 'global'
  sku: {
    name: 'Premium_AzureFrontDoor'
  }
}

resource customDomain 'Microsoft.Cdn/profiles/customDomains@2023-05-01' = {
  parent: frontDoor
  name: 'api-chaufher-co-za'
  properties: {
    hostName: 'api.chaufher.co.za'
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}
```

### Health Probes

| Backend | Path | Interval | Threshold |
|---------|------|----------|-----------|
| **API** | `/health` | 30s | 3 failures |
| **Static** | `/index.html` | 60s | 2 failures |

### Cost Estimate (MVP)

| Component | Monthly Cost |
|-----------|--------------|
| Front Door Premium (base) | ~R1,500 |
| WAF Policy | Included |
| Data transfer (50 GB) | ~R150 |
| Requests (10M) | ~R200 |
| **Total** | **~R1,850/month** |

*Note: Includes DDoS protection, WAF, CDN, and global load balancing.*

---

## Implementation

### Bicep Module

```bicep
// modules/frontdoor.bicep
param environmentName string
param backendAddress string
param customDomain string

resource frontDoorProfile 'Microsoft.Cdn/profiles@2023-05-01' = {
  name: 'afd-chaufher-${environmentName}'
  location: 'global'
  sku: {
    name: 'Premium_AzureFrontDoor'
  }
}

resource wafPolicy 'Microsoft.Network/FrontDoorWebApplicationFirewallPolicies@2022-05-01' = {
  name: 'waf-chaufher-${environmentName}'
  location: 'global'
  properties: {
    policySettings: {
      mode: 'Prevention'
      requestBodyCheck: 'Enabled'
    }
    managedRules: {
      managedRuleSets: [
        {
          ruleSetType: 'Microsoft_DefaultRuleSet'
          ruleSetVersion: '2.1'
        }
        {
          ruleSetType: 'Microsoft_BotManagerRuleSet'
          ruleSetVersion: '1.0'
        }
      ]
    }
    customRules: {
      rules: [
        {
          name: 'RateLimitAuth'
          priority: 100
          ruleType: 'RateLimitRule'
          rateLimitThreshold: 10
          rateLimitDurationInMinutes: 1
          matchConditions: [
            {
              matchVariable: 'RequestUri'
              operator: 'Contains'
              matchValue: ['/api/auth/']
            }
          ]
          action: 'Block'
        }
      ]
    }
  }
}

resource endpoint 'Microsoft.Cdn/profiles/afdEndpoints@2023-05-01' = {
  parent: frontDoorProfile
  name: 'endpoint-chaufher-${environmentName}'
  location: 'global'
  properties: {
    enabledState: 'Enabled'
  }
}

resource originGroup 'Microsoft.Cdn/profiles/originGroups@2023-05-01' = {
  parent: frontDoorProfile
  name: 'api-origin-group'
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
    }
    healthProbeSettings: {
      probePath: '/health'
      probeRequestType: 'GET'
      probeProtocol: 'Https'
      probeIntervalInSeconds: 30
    }
  }
}

resource origin 'Microsoft.Cdn/profiles/originGroups/origins@2023-05-01' = {
  parent: originGroup
  name: 'api-origin'
  properties: {
    hostName: backendAddress
    httpPort: 80
    httpsPort: 443
    priority: 1
    weight: 1000
  }
}
```

### Terraform Alternative

```hcl
# For teams preferring Terraform
resource "azurerm_cdn_frontdoor_profile" "main" {
  name                = "afd-chaufher-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  sku_name            = "Premium_AzureFrontDoor"
}

resource "azurerm_cdn_frontdoor_firewall_policy" "main" {
  name                = "waf-chaufher-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  sku_name            = "Premium_AzureFrontDoor"
  mode                = "Prevention"

  managed_rule {
    type    = "Microsoft_DefaultRuleSet"
    version = "2.1"
    action  = "Block"
  }

  managed_rule {
    type    = "Microsoft_BotManagerRuleSet"
    version = "1.0"
    action  = "Block"
  }
}
```

---

## Consequences

### Positive

- Single service for load balancing, WAF, CDN
- Managed SSL certificates (zero maintenance)
- DDoS protection included
- Global edge network for future expansion
- WebSocket support for SignalR
- Integrated Azure Monitor logging

### Negative

- Higher cost than basic load balancer
- Learning curve for rules engine
- Some advanced features require Premium tier

### Neutral

- Team learns Front Door configuration
- Can add API Management later if needed
- Can switch to Application Gateway if cost prohibitive

---

## Related Documents

- [ADR-008: Cloud Provider (Azure)](008-cloud-provider-azure.md)
- [ADR-003: Real-Time Communication (SignalR)](003-realtime-signalr.md)
- [ADR-010: Infrastructure as Code (Bicep)](010-infrastructure-bicep.md)
- [Architecture Overview](../docs/architecture.md)

---

## References

- [Azure Front Door Documentation](https://docs.microsoft.com/azure/frontdoor/)
- [Azure WAF on Front Door](https://docs.microsoft.com/azure/web-application-firewall/afds/)
- [Front Door Routing](https://docs.microsoft.com/azure/frontdoor/front-door-route-matching)
- [Front Door Pricing](https://azure.microsoft.com/pricing/details/frontdoor/)
