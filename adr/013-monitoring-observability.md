# ADR-013: Monitoring & Observability – Azure Monitor + Application Insights

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps, Operations
**Technical Story:** Monitoring, logging, and observability platform selection

---

## Context

ChaufHER requires comprehensive monitoring and observability for:
- Application performance monitoring (APM)
- Infrastructure health monitoring
- Real-time alerting and incident response
- Log aggregation and analysis
- Distributed tracing across services
- Custom business metrics (rides, payments, driver activity)
- Dashboard visualization for operations team
- Compliance and audit logging

The platform must:
- Integrate with Azure services (App Service, PostgreSQL, Redis, SignalR)
- Support .NET application instrumentation
- Provide actionable insights with minimal configuration
- Scale with application growth
- Enable proactive issue detection
- Support mobile/PWA client telemetry

---

## Decision Drivers

1. **Azure Integration** – Native support for Azure services
2. **APM Capabilities** – Performance monitoring, dependency tracking
3. **Alerting** – Real-time alerts, escalation policies
4. **Log Management** – Centralized logging, search, retention
5. **Distributed Tracing** – End-to-end request tracking
6. **Dashboards** – Customizable visualizations
7. **Cost** – Pricing model, data ingestion costs
8. **Ease of Setup** – Time to value, auto-instrumentation
9. **Querying** – Log query language, flexibility
10. **Ecosystem** – Integrations, extensions, community

---

## Options Considered

### Option A: Azure Monitor + Application Insights

Microsoft's native monitoring stack for Azure workloads.

**Pros:**
- Native Azure integration (zero-config for many services)
- Application Insights auto-instrumentation for .NET
- Kusto Query Language (KQL) powerful and flexible
- Smart detection (ML-based anomaly detection)
- Live metrics stream for real-time debugging
- Application Map shows dependencies
- Distributed tracing built-in
- Workbooks for custom dashboards
- Azure Alerts with action groups
- Log Analytics workspace for centralized logs
- Integrated with Azure AD for RBAC

**Cons:**
- KQL learning curve
- Data ingestion costs can grow
- Some features require Log Analytics workspace
- Less portable than cloud-agnostic solutions
- Alert configuration can be complex

### Option B: Datadog

Leading cloud-agnostic observability platform.

**Pros:**
- Excellent multi-cloud support
- Unified APM, logs, metrics, synthetics
- Beautiful, intuitive dashboards
- Strong .NET support
- AI-powered anomaly detection
- Extensive integrations (600+)
- Real User Monitoring (RUM)

**Cons:**
- Expensive (per-host pricing)
- Another vendor to manage
- Data egress from Azure adds cost
- Requires Datadog agent deployment
- Can be overkill for small team

### Option C: New Relic

Full-stack observability platform.

**Pros:**
- Comprehensive APM
- Generous free tier (100GB/month)
- Good .NET instrumentation
- Distributed tracing
- Error tracking
- Browser monitoring

**Cons:**
- Complex pricing model
- Query language (NRQL) learning curve
- Azure integration not as native
- UI can be overwhelming
- Performance overhead with full instrumentation

### Option D: Grafana Cloud + Prometheus

Open-source monitoring stack as managed service.

**Pros:**
- Industry-standard for metrics (Prometheus)
- Beautiful dashboards (Grafana)
- Open-source ecosystem
- No vendor lock-in
- Strong community
- Good for infrastructure metrics

**Cons:**
- Requires more setup/configuration
- APM less mature than competitors
- Log management requires Loki (separate)
- Azure integration requires exporters
- Multiple components to manage

### Option E: Elastic Stack (ELK)

Elasticsearch-based observability platform.

**Pros:**
- Powerful log search (Elasticsearch)
- APM capabilities
- Self-hosted option
- Kibana visualizations
- Open-source core

**Cons:**
- Complex to operate (especially self-hosted)
- Resource-intensive
- Azure integration requires Beats agents
- Elastic Cloud pricing can be high
- Learning curve for Elasticsearch

---

## Weighted Evaluation Matrix

| Criterion | Weight | Azure Monitor | Datadog | New Relic | Grafana Cloud | Elastic |
|-----------|--------|---------------|---------|-----------|---------------|---------|
| **Azure Integration** | 20% | 5 | 4 | 3 | 3 | 3 |
| **APM Capabilities** | 15% | 5 | 5 | 5 | 3 | 4 |
| **Alerting** | 12% | 5 | 5 | 4 | 4 | 4 |
| **Log Management** | 12% | 5 | 5 | 4 | 4 | 5 |
| **Distributed Tracing** | 10% | 5 | 5 | 5 | 3 | 4 |
| **Dashboards** | 10% | 4 | 5 | 4 | 5 | 4 |
| **Cost** | 8% | 4 | 2 | 4 | 4 | 3 |
| **Ease of Setup** | 5% | 5 | 4 | 4 | 3 | 2 |
| **Querying** | 5% | 4 | 5 | 4 | 4 | 5 |
| **Ecosystem** | 3% | 4 | 5 | 4 | 5 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure Monitor** | (5×.20)+(5×.15)+(5×.12)+(5×.12)+(5×.10)+(4×.10)+(4×.08)+(5×.05)+(4×.05)+(4×.03) | **4.73** |
| **Datadog** | (4×.20)+(5×.15)+(5×.12)+(5×.12)+(5×.10)+(5×.10)+(2×.08)+(4×.05)+(5×.05)+(5×.03) | **4.46** |
| **New Relic** | (3×.20)+(5×.15)+(4×.12)+(4×.12)+(5×.10)+(4×.10)+(4×.08)+(4×.05)+(4×.05)+(4×.03) | **4.03** |
| **Grafana Cloud** | (3×.20)+(3×.15)+(4×.12)+(4×.12)+(3×.10)+(5×.10)+(4×.08)+(3×.05)+(4×.05)+(5×.03) | **3.60** |
| **Elastic** | (3×.20)+(4×.15)+(4×.12)+(5×.12)+(4×.10)+(4×.10)+(3×.08)+(2×.05)+(5×.05)+(4×.03) | **3.79** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Azure Monitor + Application Insights** | 4.73 |
| 2 | Datadog | 4.46 |
| 3 | New Relic | 4.03 |
| 4 | Elastic Stack | 3.79 |
| 5 | Grafana Cloud | 3.60 |

---

## Analysis

### Why Azure Monitor Wins for ChaufHER

1. **Zero-Config Azure Integration**: Native telemetry for all Azure services:
   - App Service metrics automatic
   - PostgreSQL performance insights built-in
   - Redis cache metrics included
   - SignalR connection monitoring native

2. **Application Insights for .NET**:
   ```csharp
   // Program.cs - minimal setup
   builder.Services.AddApplicationInsightsTelemetry();

   // Automatic instrumentation includes:
   // - HTTP requests (incoming/outgoing)
   // - SQL queries (duration, success/failure)
   // - Redis commands
   // - SignalR hub metrics
   // - Exception tracking
   // - Custom events and metrics
   ```

3. **Smart Detection**: ML-powered anomaly detection:
   - Failure anomalies (spike in exceptions)
   - Performance degradation (response time increase)
   - Dependency issues (external service problems)
   - Memory leaks (trend detection)

4. **Kusto Query Language (KQL)**: Powerful log analysis:
   ```kql
   // Find slow ride requests
   requests
   | where name contains "rides"
   | where duration > 2000
   | summarize count(), avg(duration) by bin(timestamp, 1h)
   | render timechart

   // Error rate by endpoint
   requests
   | summarize total=count(), failed=countif(success == false) by name
   | extend failureRate = (failed * 100.0) / total
   | order by failureRate desc
   ```

5. **Cost-Effective**: Pay-as-you-go with:
   - First 5GB/month free
   - 90-day retention included
   - Sampling for high-volume scenarios
   - Daily cap to control costs

### Datadog Consideration

Datadog scored well (4.46) and is excellent for:
- Multi-cloud environments
- Teams already using Datadog
- Need for advanced RUM capabilities

For Azure-first with .NET, Azure Monitor's native integration wins.

### When to Reconsider

Consider alternatives if:
- Multi-cloud monitoring becomes necessary
- Advanced synthetic monitoring required
- Team prefers Grafana dashboards
- Compliance requires on-premise logging

---

## Decision

**Selected: Azure Monitor + Application Insights**

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Azure Monitor Ecosystem                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │ Application      │    │ Log Analytics    │                   │
│  │ Insights         │───▶│ Workspace        │                   │
│  │ (APM, Traces)    │    │ (Central Logs)   │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │ Azure Workbooks  │    │ Azure Alerts     │                   │
│  │ (Dashboards)     │    │ (Notifications)  │                   │
│  └──────────────────┘    └────────┬─────────┘                   │
│                                   │                              │
│                                   ▼                              │
│                          ┌──────────────────┐                   │
│                          │ Action Groups    │                   │
│                          │ (Slack, Email,   │                   │
│                          │  PagerDuty, SMS) │                   │
│                          └──────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Data Sources:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ App Service │  │ PostgreSQL  │  │   Redis     │  │  SignalR    │
│ (.NET API)  │  │ (Database)  │  │  (Cache)    │  │  (Realtime) │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │                │
       └────────────────┴────────────────┴────────────────┘
                                │
                                ▼
                    Azure Monitor (Metrics + Logs)
```

### Dashboard Structure

```
ChaufHER Operations Dashboard
├── Overview
│   ├── Service Health (all services status)
│   ├── Active Rides (real-time count)
│   ├── Error Rate (last hour)
│   └── P95 Response Time
├── Application Performance
│   ├── Request Rate (by endpoint)
│   ├── Dependency Performance (DB, Redis, SignalR)
│   ├── Exception Breakdown
│   └── User Sessions
├── Infrastructure
│   ├── App Service CPU/Memory
│   ├── PostgreSQL Connections/DTU
│   ├── Redis Cache Hit Rate
│   └── SignalR Connections
├── Business Metrics
│   ├── Rides Created/Completed
│   ├── Driver Online Count
│   ├── Payment Success Rate
│   └── Average Match Time
└── Alerts
    ├── Active Incidents
    ├── Recent Alerts
    └── Escalation Status
```

### Alert Configuration

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| High Error Rate | >5% failures in 5 min | Critical | Slack + SMS |
| Slow Response | P95 >3s for 10 min | Warning | Slack |
| Database Connection | >80% pool used | Warning | Slack |
| Redis Memory | >80% memory | Warning | Slack |
| SignalR Connections | Spike >200% | Info | Slack |
| Service Down | No requests 5 min | Critical | Slack + SMS + Phone |
| Payment Failures | >10% in 15 min | Critical | Slack + SMS |

### Custom Metrics

```csharp
// Track business metrics in Application Insights
public class RideMetricsService
{
    private readonly TelemetryClient _telemetry;

    public void TrackRideCreated(Ride ride)
    {
        _telemetry.TrackEvent("RideCreated", new Dictionary<string, string>
        {
            ["RideType"] = ride.Type.ToString(),
            ["Region"] = ride.PickupRegion
        });

        _telemetry.GetMetric("ActiveRides").TrackValue(1);
    }

    public void TrackRideCompleted(Ride ride, TimeSpan duration)
    {
        _telemetry.TrackMetric("RideDuration", duration.TotalMinutes);
        _telemetry.TrackMetric("RideFare", (double)ride.FinalFare);
    }

    public void TrackDriverMatch(TimeSpan matchTime)
    {
        _telemetry.TrackMetric("DriverMatchTime", matchTime.TotalSeconds);
    }
}
```

### Log Retention Policy

| Log Type | Retention | Purpose |
|----------|-----------|---------|
| Application Logs | 90 days | Debugging, support |
| Security Logs | 1 year | Audit, compliance |
| Business Metrics | 2 years | Analytics, reporting |
| Infrastructure Metrics | 30 days | Operations |

### Integration with Slack

```yaml
# Alert -> Action Group -> Logic App -> Slack
Action Group: chaufher-ops-alerts
├── Slack Webhook (all alerts)
├── Email (critical only)
└── SMS (critical + on-call)

Slack Channel: #chaufher-alerts
Format:
🔴 CRITICAL: High Error Rate
Service: chaufher-prod-api
Error Rate: 8.5% (threshold: 5%)
Time: 2025-01-15 14:32 UTC
Link: [View in Azure Portal]
```

---

## Consequences

### Positive

- Zero-config monitoring for Azure services
- Application Insights auto-instrumentation reduces code
- Unified platform for metrics, logs, traces
- Native alerting with Azure AD integration
- Cost-effective for startup scale
- KQL enables powerful ad-hoc analysis

### Negative

- Vendor lock-in to Azure ecosystem
- KQL learning curve for team
- Data ingestion costs can grow unexpectedly
- Some advanced features require premium tiers

### Neutral

- Team learns KQL (transferable Azure skill)
- Dashboard customization requires Workbooks knowledge
- May need Grafana integration for specific visualizations

---

## Related Documents

- [ADR-008: Cloud Provider Selection (Azure)](008-cloud-provider-azure.md)
- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)
- [ADR-011: CI/CD Platform (GitHub Actions)](011-cicd-github-actions.md)
- [ADR-006: Team Communication (Slack)](006-team-communication.md)

---

## References

- [Azure Monitor Documentation](https://docs.microsoft.com/azure/azure-monitor/)
- [Application Insights for ASP.NET Core](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core)
- [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/data-explorer/kusto/query/)
- [Azure Workbooks](https://docs.microsoft.com/azure/azure-monitor/visualize/workbooks-overview)
- [Smart Detection in Application Insights](https://docs.microsoft.com/azure/azure-monitor/alerts/proactive-diagnostics)
