# ChaufHER CODER Evaluations

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben

---

## Overview

This document applies the **CODER** evaluation framework to all architectural decisions in the ChaufHER platform. CODER provides a consistent lens for assessing technology choices beyond the weighted evaluation matrices in individual ADRs.

### CODER Framework

| Dimension | Description | Key Questions |
|-----------|-------------|---------------|
| **C**ost | Total cost of ownership | What are upfront, operational, and scaling costs? |
| **O**perational | Day-to-day operations | How hard is it to deploy, monitor, and maintain? |
| **D**eveloper | Developer experience | How productive can developers be? Learning curve? |
| **E**xtensibility | Future evolution | How easy to extend, modify, or replace? |
| **R**isk | Technical and business risk | What can go wrong? Vendor lock-in? Maturity? |

### Scoring Scale

| Score | Meaning |
|-------|---------|
| 5 | Excellent - Best possible choice |
| 4 | Good - Minor concerns only |
| 3 | Acceptable - Manageable trade-offs |
| 2 | Concerning - Significant drawbacks |
| 1 | Poor - Major issues |

---

## Executive Summary

### Overall Platform CODER Score

| Dimension | Average Score | Assessment |
|-----------|---------------|------------|
| **Cost** | 4.1 | Strong free tiers, Azure optimization |
| **Operational** | 3.9 | Mostly managed services, some complexity |
| **Developer** | 4.2 | Modern stack, good tooling |
| **Extensibility** | 4.0 | Modular architecture, standard patterns |
| **Risk** | 3.7 | Azure dependency, some vendor lock-in |
| **Overall** | **4.0** | **Well-balanced for MVP** |

### Risk Summary

| Risk Level | Count | ADRs |
|------------|-------|------|
| 🟢 Low | 21 | Most infrastructure, backend, and process decisions |
| 🟡 Medium | 9 | Client technology, external integrations, algorithms |
| 🔴 High | 2 | Payment gateway, security architecture |

---

## Client Decisions

### ADR-001: Client Technology (PWA)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | No app store fees. Single codebase. Web hosting only. |
| **Operational** | 5 | Web deployment. No app store approval process. Instant updates. |
| **Developer** | 4 | Modern web stack. TypeScript, React. Smaller team needed than native. |
| **Extensibility** | 4 | PWA evolving rapidly. Can add native features via Capacitor if needed. |
| **Risk** | 3 | iOS PWA limitations (no push via Safari until iOS 16.4+). Browser dependency. |
| **CODER Score** | **4.2** | |

**Key Risks:**
- 🟡 iOS PWA feature limitations (improving but not parity)
- 🟡 Browser-dependent user experience
- 🟢 No app store gatekeeping risk

**Mitigations:**
- Target iOS 16.4+ for push notifications
- Capacitor wrapper available for native features if needed
- Progressive enhancement for offline support

---

## Infrastructure Decisions

### ADR-008: Cloud Provider (Azure)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 4 | Competitive pricing, good free tiers, R200 credits. Egress costs can add up. |
| **Operational** | 4 | Managed services reduce ops burden. Azure Portal learning curve. |
| **Developer** | 4 | Excellent .NET integration. Azure CLI and SDKs mature. |
| **Extensibility** | 4 | Comprehensive service catalog. Can grow with platform. |
| **Risk** | 3 | Vendor lock-in. Single-cloud dependency. Azure outages affect all. |
| **CODER Score** | **3.8** | |

**Key Risks:**
- 🔴 Single cloud dependency
- 🟡 Vendor lock-in for Azure-specific services
- 🟢 Microsoft financial stability

**Mitigations:**
- Use Kubernetes-compatible services where possible
- Abstract cloud-specific code behind interfaces
- Document multi-cloud migration path

---

### ADR-023: Networking & API Gateway (Azure Front Door)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 3 | ~R1,850/month. More expensive than basic LB but includes WAF, CDN. |
| **Operational** | 4 | Managed service. Rules engine has learning curve. |
| **Developer** | 4 | Transparent to developers. Good debugging tools. |
| **Extensibility** | 4 | Can add regions, backends easily. Rules engine flexible. |
| **Risk** | 4 | Mature service. Some complexity in WAF rules. |
| **CODER Score** | **3.8** | |

**Key Risks:**
- 🟡 Cost at scale
- 🟢 Mature, well-documented service

---

### ADR-025: Disaster Recovery & HA (Zone Redundancy)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 4 | Zone redundancy minimal cost. Multi-region would be expensive. |
| **Operational** | 4 | Automatic failover. DR drills needed quarterly. |
| **Developer** | 5 | Transparent to developers. No code changes needed. |
| **Extensibility** | 4 | Clear path to multi-region when needed. |
| **Risk** | 3 | No automatic regional failover. 2-6 hour RTO for regional disaster. |
| **CODER Score** | **4.0** | |

**Key Risks:**
- 🟡 Regional disaster requires manual intervention
- 🟢 Zone failures handled automatically

---

### ADR-019: File Storage (Azure Blob)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | ~R25/month for MVP. Tiered storage optimizes costs. |
| **Operational** | 5 | Fully managed. Lifecycle policies automated. |
| **Developer** | 4 | Good SDK. SAS token management has learning curve. |
| **Extensibility** | 4 | Can add CDN, scale storage easily. |
| **Risk** | 4 | Mature service. Standard S3-like patterns. |
| **CODER Score** | **4.4** | |

---

## Backend Decisions

### ADR-009: Backend Framework (.NET 9)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | Open source, no licensing. Efficient resource usage. |
| **Operational** | 4 | Container-friendly. Good Azure integration. |
| **Developer** | 4 | Modern C#, great tooling. Smaller talent pool than Node.js. |
| **Extensibility** | 5 | Mature ecosystem. NuGet packages for everything. |
| **Risk** | 5 | Microsoft long-term commitment. LTS releases. |
| **CODER Score** | **4.6** | |

**Key Risks:**
- 🟢 Very low risk choice
- 🟡 Hiring .NET developers in SA may be competitive

---

### ADR-002: Database (PostgreSQL)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 4 | Azure Flexible Server reasonable. Can optimize with reserved capacity. |
| **Operational** | 4 | Managed service handles backups, HA. Need to manage indexes, queries. |
| **Developer** | 5 | Industry standard. Excellent tooling, ORMs. |
| **Extensibility** | 5 | PostGIS for geo. JSON support. Scales vertically and with read replicas. |
| **Risk** | 5 | Most popular open-source DB. Zero vendor lock-in. |
| **CODER Score** | **4.6** | |

---

### ADR-003: Real-Time Communication (SignalR)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 4 | Azure SignalR Service has free tier. Scales cost-effectively. |
| **Operational** | 5 | Managed service. Auto-scaling. |
| **Developer** | 5 | Native .NET integration. Simple API. |
| **Extensibility** | 4 | Can add more hubs. Supports various transports. |
| **Risk** | 4 | Azure-specific managed service. Could use self-hosted if needed. |
| **CODER Score** | **4.4** | |

---

### ADR-004: Caching (Redis)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 3 | Azure Redis Cache is pricey. Premium needed for geo-redundancy. |
| **Operational** | 5 | Fully managed. Auto-failover. |
| **Developer** | 5 | Industry standard. StackExchange.Redis excellent. |
| **Extensibility** | 4 | Geo commands for location. Pub/sub available. |
| **Risk** | 5 | Ubiquitous technology. Can migrate to any Redis provider. |
| **CODER Score** | **4.4** | |

---

### ADR-017: Background Jobs (Hangfire)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | Open source. Uses existing PostgreSQL. |
| **Operational** | 4 | Dashboard included. Need to monitor queue depths. |
| **Developer** | 5 | Simple API. .NET native. Easy testing. |
| **Extensibility** | 4 | Supports distributed processing. Pro version available. |
| **Risk** | 4 | Mature library. Active development. |
| **CODER Score** | **4.4** | |

---

### ADR-026: Driver Matching Algorithm

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | Custom code, no licensing. Redis geo queries efficient. |
| **Operational** | 3 | Need to tune weights. Monitor fairness metrics. |
| **Developer** | 4 | Well-documented algorithm. Testable components. |
| **Extensibility** | 5 | Configurable weights. Can add factors easily. |
| **Risk** | 3 | Custom algorithm needs iteration. May affect driver satisfaction. |
| **CODER Score** | **4.0** | |

**Key Risks:**
- 🟡 Algorithm tuning required based on real-world data
- 🟡 Driver fairness perception
- 🟢 Modular design allows iteration

---

### ADR-027: Driver Scheduling Algorithm

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | Custom code, no licensing. |
| **Operational** | 3 | Coverage monitoring needed. Conflict resolution requires attention. |
| **Developer** | 4 | Clear separation from matching. Well-defined interfaces. |
| **Extensibility** | 4 | Can add optimization later. ML path documented. |
| **Risk** | 3 | School run reliability is business-critical. |
| **CODER Score** | **3.8** | |

**Key Risks:**
- 🟡 School run consistency is high-stakes
- 🟡 Scheduling conflicts need robust handling
- 🟢 Hybrid approach balances complexity

---

## Security Decisions

### ADR-007: Authentication (Azure AD B2C)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 4 | First 50K MAU free. Cost-effective for MVP. |
| **Operational** | 4 | Managed service. Custom policies have learning curve. |
| **Developer** | 3 | MSAL integration good. Custom flows complex. |
| **Extensibility** | 4 | Supports social logins, MFA. Custom policies flexible. |
| **Risk** | 4 | Microsoft-backed. Some Azure lock-in. |
| **CODER Score** | **3.8** | |

---

### ADR-024: Security Architecture (Defense in Depth)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 3 | Security tools add cost. Key Vault, WAF, monitoring. |
| **Operational** | 3 | Security monitoring requires attention. Incident response needed. |
| **Developer** | 3 | Security adds friction. Need training on secure coding. |
| **Extensibility** | 4 | Layered approach allows incremental improvement. |
| **Risk** | 2 | Security is never "done". Breaches have severe consequences. |
| **CODER Score** | **3.0** | |

**Key Risks:**
- 🔴 Security breaches could destroy brand trust
- 🔴 POPIA non-compliance has legal consequences
- 🟡 Ongoing security investment required

**Mitigations:**
- Regular penetration testing
- Security training for developers
- Incident response plan and drills
- Bug bounty program (future)

---

## Integration Decisions

### ADR-014: Payment Gateway (PayFast)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 4 | 3.5% + R2 per transaction. Competitive for SA market. |
| **Operational** | 3 | Webhook reliability monitoring needed. Reconciliation required. |
| **Developer** | 3 | API documentation adequate. Testing in sandbox. |
| **Extensibility** | 3 | Limited to SA market. Would need different provider for expansion. |
| **Risk** | 2 | Payment is mission-critical. PayFast outages affect revenue. |
| **CODER Score** | **3.0** | |

**Key Risks:**
- 🔴 Payment failures directly impact business
- 🔴 Fraud and chargebacks
- 🟡 PayFast is regional (SA only)

**Mitigations:**
- Payment retry logic
- Fraud detection rules
- Transaction monitoring and alerts
- Cash payment fallback (future)

---

### ADR-016: Maps & Geolocation (Google Maps)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 3 | $200/month credit. Costs can grow with usage. |
| **Operational** | 5 | Fully managed. Excellent uptime. |
| **Developer** | 5 | Best-in-class SDK and documentation. |
| **Extensibility** | 4 | Rich feature set. Places, Routes, Traffic. |
| **Risk** | 3 | Pricing changes (Google has history). API key security. |
| **CODER Score** | **4.0** | |

**Key Risks:**
- 🟡 Google Maps pricing can change
- 🟡 Township/informal settlement coverage gaps
- 🟢 Best SA coverage available

---

### ADR-015: SMS & Notifications (Africa's Talking)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | ~R0.25/SMS. Much cheaper than Twilio. |
| **Operational** | 4 | Good delivery rates in SA. Monitoring dashboard. |
| **Developer** | 3 | API functional but less polished than Twilio. |
| **Extensibility** | 4 | USSD, voice available. African expansion supported. |
| **Risk** | 3 | Smaller company than Twilio. SMS delivery is critical for OTP. |
| **CODER Score** | **3.8** | |

**Key Risks:**
- 🟡 SMS delivery failures affect authentication
- 🟡 Smaller vendor than Twilio
- 🟢 Excellent Africa coverage and pricing

---

### ADR-018: Email Provider (SendGrid)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | 100 emails/day free. Excellent for MVP. |
| **Operational** | 5 | Industry-leading deliverability. Good dashboard. |
| **Developer** | 5 | Excellent SDK. Dynamic templates. |
| **Extensibility** | 4 | Marketing features available. Good scaling. |
| **Risk** | 4 | Twilio-owned. Mature platform. |
| **CODER Score** | **4.6** | |

---

## Operations Decisions

### ADR-013: Monitoring & Observability (Azure Monitor)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 3 | Log Analytics costs grow with data. Need to manage retention. |
| **Operational** | 4 | Native Azure integration. Alerting built-in. |
| **Developer** | 4 | Application Insights excellent for .NET. |
| **Extensibility** | 4 | Can add Grafana, export to other tools. |
| **Risk** | 4 | Azure-native but data exportable. |
| **CODER Score** | **3.8** | |

---

### ADR-020: Error Tracking (Sentry)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | 5,000 errors/month free. Sufficient for MVP. |
| **Operational** | 5 | Automatic error grouping. Release tracking. |
| **Developer** | 5 | Excellent UX for debugging. Source maps. |
| **Extensibility** | 4 | Session replay, performance monitoring available. |
| **Risk** | 4 | Industry standard. Can self-host if needed. |
| **CODER Score** | **4.6** | |

---

### ADR-021: Feature Flags (Azure App Configuration)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | 1,000 requests/day free. Sufficient for MVP. |
| **Operational** | 4 | Azure-native. Real-time updates. |
| **Developer** | 4 | Good .NET SDK. Percentage targeting. |
| **Extensibility** | 3 | Less sophisticated than LaunchDarkly. |
| **Risk** | 4 | Azure-specific but simple to migrate. |
| **CODER Score** | **4.0** | |

---

### ADR-022: Analytics & BI (Power BI)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 4 | Desktop free. Pro $10/user. Embedded more expensive. |
| **Operational** | 4 | Scheduled refresh. Gateway for on-prem data. |
| **Developer** | 3 | DAX learning curve. More analyst-focused. |
| **Extensibility** | 4 | Extensive visualization options. R/Python integration. |
| **Risk** | 4 | Microsoft investment. Large user base. |
| **CODER Score** | **3.8** | |

---

## Process Decisions

### ADR-011: CI/CD (GitHub Actions)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | 2,000 minutes/month free. Sufficient for MVP. |
| **Operational** | 5 | Managed by GitHub. No infrastructure. |
| **Developer** | 5 | Excellent DX. YAML workflows. Marketplace actions. |
| **Extensibility** | 5 | Highly customizable. Matrix builds. Reusable workflows. |
| **Risk** | 5 | GitHub/Microsoft stability. Industry standard. |
| **CODER Score** | **5.0** | |

---

### ADR-010: Infrastructure as Code (Bicep)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 5 | Free. Part of Azure CLI. |
| **Operational** | 4 | Azure-native. Good validation. |
| **Developer** | 4 | Cleaner than ARM. VS Code extension. |
| **Extensibility** | 4 | Modules, parameters. Can generate from existing. |
| **Risk** | 3 | Azure-only. Would need Terraform for multi-cloud. |
| **CODER Score** | **4.0** | |

---

### ADR-012: Project Management (Linear)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Cost** | 4 | Free for small teams. $8/user for more features. |
| **Operational** | 5 | SaaS, no maintenance. Fast and responsive. |
| **Developer** | 5 | Keyboard-driven. GitHub integration. |
| **Extensibility** | 4 | API available. Cycles, roadmaps. |
| **Risk** | 4 | Growing company. Easy to export data. |
| **CODER Score** | **4.4** | |

---

## CODER Summary by Category

### Client

| ADR | Decision | CODER | Risk Level |
|-----|----------|-------|------------|
| ADR-001 | PWA | 4.2 | 🟡 Medium |
| ADR-029 | Zustand | 4.4 | 🟢 Low |

### Infrastructure

| ADR | Decision | CODER | Risk Level |
|-----|----------|-------|------------|
| ADR-008 | Azure | 3.8 | 🟡 Medium |
| ADR-023 | Azure Front Door | 3.8 | 🟢 Low |
| ADR-025 | Zone Redundancy | 4.0 | 🟡 Medium |
| ADR-019 | Azure Blob | 4.4 | 🟢 Low |
| ADR-010 | Bicep | 4.0 | 🟢 Low |
| ADR-028 | Azure Container Apps | 4.4 | 🟢 Low |

### Backend

| ADR | Decision | CODER | Risk Level |
|-----|----------|-------|------------|
| ADR-009 | .NET 9 | 4.6 | 🟢 Low |
| ADR-002 | PostgreSQL | 4.6 | 🟢 Low |
| ADR-003 | SignalR | 4.4 | 🟢 Low |
| ADR-004 | Redis | 4.4 | 🟢 Low |
| ADR-017 | Hangfire | 4.4 | 🟢 Low |
| ADR-026 | Matching Algorithm | 4.0 | 🟡 Medium |
| ADR-027 | Scheduling Algorithm | 3.8 | 🟡 Medium |
| ADR-030 | URL Path Versioning | 4.6 | 🟢 Low |

### Security

| ADR | Decision | CODER | Risk Level |
|-----|----------|-------|------------|
| ADR-007 | Azure AD B2C | 3.8 | 🟡 Medium |
| ADR-024 | Defense in Depth | 3.0 | 🔴 High |

### Integrations

| ADR | Decision | CODER | Risk Level |
|-----|----------|-------|------------|
| ADR-014 | PayFast | 3.0 | 🔴 High |
| ADR-016 | Google Maps | 4.0 | 🟡 Medium |
| ADR-015 | Africa's Talking | 3.8 | 🟡 Medium |
| ADR-018 | SendGrid | 4.6 | 🟢 Low |

### Operations

| ADR | Decision | CODER | Risk Level |
|-----|----------|-------|------------|
| ADR-013 | Azure Monitor | 3.8 | 🟢 Low |
| ADR-020 | Sentry | 4.6 | 🟢 Low |
| ADR-021 | Azure App Config | 4.0 | 🟢 Low |
| ADR-022 | Power BI | 3.8 | 🟢 Low |

### Process

| ADR | Decision | CODER | Risk Level |
|-----|----------|-------|------------|
| ADR-011 | GitHub Actions | 5.0 | 🟢 Low |
| ADR-012 | Linear | 4.4 | 🟢 Low |
| ADR-005 | Notion | 4.2 | 🟢 Low |
| ADR-006 | Slack | 4.4 | 🟢 Low |

---

## Top Risks & Mitigations

### 🔴 High Risk Items

#### 1. Security Architecture (ADR-024)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Data breach | Catastrophic | Low | Defense in depth, encryption, monitoring |
| POPIA violation | High | Medium | Privacy by design, data minimization |
| Authentication bypass | High | Low | Azure AD B2C, MFA, token validation |

**Investment Required:** Ongoing security reviews, penetration testing, training

#### 2. Payment Processing (ADR-014)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| PayFast outage | High | Low | Retry logic, payment queuing, alerts |
| Fraud/chargebacks | High | Medium | Fraud rules, verification, monitoring |
| Failed payouts | High | Low | Reconciliation, manual fallback |

**Investment Required:** Payment monitoring dashboard, fraud detection, reconciliation tools

### 🟡 Medium Risk Items

| Risk | Mitigation |
|------|------------|
| Azure regional outage | Zone redundancy now, multi-region path documented |
| Driver matching unfairness | Fairness scoring, monitoring, tunable weights |
| School run reliability | Trial periods, backup drivers, parent communication |
| SMS delivery failures | Fallback to email, retry logic, delivery monitoring |
| Google Maps pricing | Azure Maps fallback documented, caching |
| Algorithm performance | Load testing, caching, monitoring |

---

## Cost Summary

### Monthly Estimated Costs (MVP)

| Category | Services | Est. Monthly (ZAR) |
|----------|----------|-------------------|
| **Compute** | Container Apps (4 services) | R2,500 |
| **Database** | PostgreSQL Flexible | R2,000 |
| **Cache** | Redis Cache | R1,500 |
| **Networking** | Front Door + Bandwidth | R2,000 |
| **Storage** | Blob Storage | R50 |
| **Monitoring** | Log Analytics + App Insights | R500 |
| **Real-time** | SignalR Service | R400 |
| **Security** | Key Vault | R100 |
| **External** | Google Maps ($200 credit) | R0 |
| **External** | SendGrid (free tier) | R0 |
| **External** | Sentry (free tier) | R0 |
| **Total** | | **~R9,000/month** |

### Cost Scaling Factors

| Trigger | Impact | Action |
|---------|--------|--------|
| 10K+ rides/month | Compute scaling | Add Container App replicas |
| 100K+ users | Database growth | Scale PostgreSQL, add read replica |
| 1M+ SMS/month | Africa's Talking | Volume discounts available |
| High map usage | Google Maps | Implement caching, consider Azure Maps |

---

## Recommendations

### Immediate Actions

1. **Security Review**: Conduct security review before launch
2. **Payment Testing**: Extensive PayFast testing in sandbox
3. **Load Testing**: Verify matching algorithm performance
4. **DR Drill**: Test backup restoration process

### 30-Day Actions

1. **Monitoring Setup**: Configure all alerts and dashboards
2. **Runbook Creation**: Document operational procedures
3. **Security Training**: Developer secure coding training
4. **Algorithm Baseline**: Establish matching/scheduling metrics

### 90-Day Actions

1. **Penetration Test**: External security assessment
2. **Cost Optimization**: Review Azure spending, reserved instances
3. **Algorithm Tuning**: Adjust weights based on real data
4. **Coverage Analysis**: Identify service area gaps

---

## Related Documents

- [Architecture Overview](architecture.md)
- [C4 Diagrams](c4-diagrams.md)
- [ADR Index](../README.md#architecture-decision-records-adrs)
- [Security Architecture](../adr/024-security-architecture.md)

---

## References

- [ATAM - Architecture Tradeoff Analysis Method](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=5177)
- [Software Architecture Review](https://martinfowler.com/articles/architect-elevator.html)
- [Risk-Driven Architecture](https://www.georgefairbanks.com/book/)
