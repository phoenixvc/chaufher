# ADR-008: Cloud Provider – Microsoft Azure

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Leadership
**Technical Story:** Cloud platform selection for ChaufHER infrastructure

---

## Context

ChaufHER requires a cloud platform for hosting:
- Backend APIs (.NET services)
- PWA static hosting with CDN
- Database (PostgreSQL)
- Caching (Redis)
- Real-time communication (SignalR)
- Identity management (authentication)
- File storage (driver documents, receipts)
- Monitoring and logging
- CI/CD pipelines

The platform must:
- Support .NET workloads natively
- Provide managed services to reduce operational burden
- Offer regional availability (South Africa for primary market)
- Scale with business growth
- Meet compliance requirements
- Be cost-effective for startup budget

---

## Decision Drivers

1. **.NET Support** – First-class support for .NET workloads
2. **Managed Services** – Reduce operational complexity
3. **Regional Availability** – South Africa region for latency/compliance
4. **Cost** – Startup-friendly pricing, free tier availability
5. **Enterprise Features** – Security, compliance, governance
6. **Developer Experience** – Tooling, documentation, SDKs
7. **Service Breadth** – All required services on one platform
8. **Scalability** – Handle growth from MVP to enterprise scale
9. **Support** – Technical support options
10. **Ecosystem** – Partner network, marketplace, community

---

## Options Considered

### Option A: Microsoft Azure

Microsoft's cloud platform with comprehensive PaaS and IaaS offerings.

**Pros:**
- Best-in-class .NET support (Microsoft ecosystem)
- South Africa regions (North, West) available
- Azure AD B2C for customer identity
- SignalR Service fully managed
- Azure Database for PostgreSQL
- Comprehensive managed services
- Visual Studio/VS Code integration
- GitHub Actions integration (Microsoft-owned)
- Startup programs (Azure for Startups)
- Strong enterprise adoption

**Cons:**
- Can be complex (many overlapping services)
- Some services more expensive than competitors
- Documentation sometimes inconsistent
- Portal UX can be overwhelming
- Learning curve for non-Microsoft shops

### Option B: Amazon Web Services (AWS)

Market-leading cloud platform with broadest service catalog.

**Pros:**
- Largest market share, proven at scale
- Broadest service catalog
- Cape Town region (af-south-1) available
- Mature ecosystem
- Extensive documentation
- Strong serverless offerings (Lambda)

**Cons:**
- .NET support not as native (improving)
- No equivalent to SignalR Service
- No Azure AD B2C equivalent (Cognito less feature-rich)
- Higher complexity for .NET developers
- Pricing can be unpredictable
- Support tiers expensive

### Option C: Google Cloud Platform (GCP)

Google's cloud platform known for data/ML services.

**Pros:**
- Excellent Kubernetes support (GKE)
- Strong data analytics (BigQuery)
- Good pricing (sustained use discounts)
- Firebase for mobile backends
- Clean, modern console

**Cons:**
- No South Africa region
- Weaker .NET support
- Smaller enterprise adoption
- Fewer managed PaaS options
- Less mature than AWS/Azure
- Support less comprehensive

### Option D: DigitalOcean

Developer-friendly cloud for simpler workloads.

**Pros:**
- Simple, predictable pricing
- Easy to use
- Good for small projects
- Managed Kubernetes, databases
- Developer-focused documentation

**Cons:**
- Limited service catalog
- No South Africa region
- Missing enterprise features
- No managed SignalR equivalent
- Limited compliance certifications
- Not suitable for enterprise scale

### Option E: Multi-Cloud

Using best services from multiple providers.

**Pros:**
- Best-of-breed for each need
- Avoid vendor lock-in
- Redundancy across providers

**Cons:**
- Operational complexity
- Integration challenges
- Multiple billing relationships
- Inconsistent security policies
- Higher total cost
- Network latency between clouds

---

## Weighted Evaluation Matrix

| Criterion | Weight | Azure | AWS | GCP | DigitalOcean | Multi-Cloud |
|-----------|--------|-------|-----|-----|--------------|-------------|
| **.NET Support** | 20% | 5 | 3 | 3 | 3 | 4 |
| **Managed Services** | 15% | 5 | 5 | 4 | 3 | 5 |
| **Regional Availability (ZA)** | 15% | 5 | 5 | 1 | 1 | 4 |
| **Cost** | 12% | 3 | 3 | 4 | 5 | 2 |
| **Enterprise Features** | 10% | 5 | 5 | 4 | 2 | 4 |
| **Developer Experience** | 8% | 4 | 4 | 4 | 5 | 3 |
| **Service Breadth** | 8% | 5 | 5 | 4 | 2 | 5 |
| **Scalability** | 5% | 5 | 5 | 5 | 3 | 5 |
| **Support** | 4% | 4 | 4 | 3 | 3 | 3 |
| **Ecosystem** | 3% | 5 | 5 | 4 | 3 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure** | (5×.20)+(5×.15)+(5×.15)+(3×.12)+(5×.10)+(4×.08)+(5×.08)+(5×.05)+(4×.04)+(5×.03) | **4.57** |
| **AWS** | (3×.20)+(5×.15)+(5×.15)+(3×.12)+(5×.10)+(4×.08)+(5×.08)+(5×.05)+(4×.04)+(5×.03) | **4.17** |
| **GCP** | (3×.20)+(4×.15)+(1×.15)+(4×.12)+(4×.10)+(4×.08)+(4×.08)+(5×.05)+(3×.04)+(4×.03) | **3.35** |
| **DigitalOcean** | (3×.20)+(3×.15)+(1×.15)+(5×.12)+(2×.10)+(5×.08)+(2×.08)+(3×.05)+(3×.04)+(3×.03) | **2.92** |
| **Multi-Cloud** | (4×.20)+(5×.15)+(4×.15)+(2×.12)+(4×.10)+(3×.08)+(5×.08)+(5×.05)+(3×.04)+(4×.03) | **3.92** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Microsoft Azure** | 4.57 |
| 2 | AWS | 4.17 |
| 3 | Multi-Cloud | 3.92 |
| 4 | GCP | 3.35 |
| 5 | DigitalOcean | 2.92 |

---

## Analysis

### Why Azure Wins for ChaufHER

1. **.NET Native**: Azure is Microsoft's cloud, providing:
   - First-class .NET support
   - Visual Studio integration
   - Azure SDK for .NET
   - App Service optimized for .NET
   - Entity Framework tooling

2. **South Africa Regions**: Both South Africa North (Johannesburg) and South Africa West (Cape Town) available:
   - Low latency for SA users
   - Data residency compliance
   - Local redundancy options

3. **Complete Service Stack**: All required services in one platform:
   - Azure AD B2C (authentication)
   - Azure SignalR Service (real-time)
   - Azure Cache for Redis (caching)
   - Azure Database for PostgreSQL (database)
   - Azure App Service (hosting)
   - Azure Static Web Apps (PWA)

4. **Startup Program**: Azure for Startups provides:
   - Up to $150,000 in credits
   - Technical support
   - Partner benefits

5. **GitHub Integration**: Microsoft owns GitHub:
   - GitHub Actions integrates natively
   - Azure DevOps alternative available
   - Seamless deployment workflows

### AWS Consideration

AWS scored well (4.17) and would be viable, especially with AWS's Activate program for startups. Key differences:
- .NET support is improving but not native
- No SignalR equivalent (would need self-hosted or alternative)
- Cognito less feature-rich than Azure AD B2C

For a .NET-focused team, Azure's ecosystem advantages outweigh AWS's broader market position.

### When to Reconsider

Consider alternatives if:
- Team has deep AWS expertise
- Specific AWS services become critical (e.g., Lambda@Edge)
- Azure pricing becomes uncompetitive
- Multi-region outside Azure's footprint needed

---

## Decision

**Selected: Microsoft Azure**

### Service Mapping

| Need | Azure Service | Tier |
|------|---------------|------|
| API Hosting | App Service | B1 (dev), P1v3 (prod) |
| PWA Hosting | Static Web Apps | Free (dev), Standard (prod) |
| Database | Azure Database for PostgreSQL | Flexible Server |
| Cache | Azure Cache for Redis | Standard C1 |
| Authentication | Azure AD B2C | Free tier |
| Real-time | Azure SignalR Service | Standard |
| File Storage | Azure Blob Storage | Hot tier |
| Monitoring | Application Insights | Pay-as-you-go |
| CI/CD | GitHub Actions | Free tier |
| DNS | Azure DNS | Pay-as-you-go |
| CDN | Azure CDN | Standard |

### Regional Strategy

| Environment | Primary Region | DR Region |
|-------------|----------------|-----------|
| Development | South Africa North | N/A |
| Staging | South Africa North | N/A |
| Production | South Africa North | South Africa West |

### Cost Estimate (MVP)

| Service | Monthly Cost (approx.) |
|---------|------------------------|
| App Service (B1) | $13 |
| PostgreSQL (Burstable B1) | $35 |
| Redis (Basic C0) | $16 |
| Static Web Apps | $0 (free tier) |
| SignalR (Free) | $0 |
| AD B2C (<50K MAU) | $0 |
| Storage (10GB) | $2 |
| **Total** | **~$66/month** |

*Production costs will be higher with scaled tiers.*

---

## Consequences

### Positive

- Native .NET support accelerates development
- Comprehensive managed services reduce operations
- South Africa regions enable low latency and compliance
- Startup program provides significant credits
- Single vendor simplifies billing and support

### Negative

- Vendor lock-in to Microsoft ecosystem
- Some services more expensive than competitors
- Complexity of Azure portal and service catalog
- Potential for unexpected costs without monitoring

### Neutral

- Team builds Azure expertise (valuable skill)
- Architecture remains portable with abstractions
- Can adopt multi-cloud if requirements change

---

## Related Documents

- [ADR-002: Database Selection (PostgreSQL)](002-database-postgresql.md)
- [ADR-003: Real-Time Communication (SignalR)](003-realtime-signalr.md)
- [ADR-007: Authentication (Azure AD B2C)](007-authentication-azure-ad-b2c.md)
- [ADR-010: Infrastructure as Code (Bicep)](010-infrastructure-bicep.md)

---

## References

- [Azure for Startups](https://azure.microsoft.com/free/startups/)
- [Azure Regions](https://azure.microsoft.com/global-infrastructure/geographies/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [Azure Well-Architected Framework](https://docs.microsoft.com/azure/architecture/framework/)
