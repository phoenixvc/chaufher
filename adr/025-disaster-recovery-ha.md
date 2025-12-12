# ADR-025: Disaster Recovery & High Availability

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps, Business
**Technical Story:** Business continuity, disaster recovery, and high availability strategy

---

## Context

ChaufHER is a safety-critical platform where downtime directly impacts:
- User safety (stranded riders, unable to request emergency rides)
- Driver income (lost earnings during outages)
- Business reputation (trust is core to the ChaufHER brand)
- Revenue (every minute of downtime = lost bookings)

The platform must:
- Maintain high availability during normal operations
- Recover quickly from component failures
- Survive regional disasters (data center outages)
- Protect data integrity in all failure scenarios
- Balance cost with availability requirements

---

## Decision Drivers

1. **Recovery Time Objective (RTO)** – Maximum acceptable downtime
2. **Recovery Point Objective (RPO)** – Maximum acceptable data loss
3. **Cost** – Infrastructure and operational costs
4. **Complexity** – Operational overhead
5. **Data Integrity** – Zero data loss requirements
6. **Geographic Risk** – Regional disaster protection
7. **Testing** – DR drill feasibility
8. **Automation** – Manual vs. automatic failover
9. **MVP Appropriateness** – Right-sized for current scale
10. **Growth Path** – Ability to enhance as business grows

---

## Business Requirements

### Availability Targets

| Component | Target | Justification |
|-----------|--------|---------------|
| **Ride Booking** | 99.9% (8.76h/year) | Core business function |
| **Driver App** | 99.9% (8.76h/year) | Driver earnings depend on it |
| **Payments** | 99.5% (43.8h/year) | Can retry; not real-time critical |
| **Admin Portal** | 99.0% (87.6h/year) | Internal tool; lower priority |
| **Analytics** | 95.0% (438h/year) | Non-critical; can be delayed |

### Recovery Objectives

| Tier | Services | RTO | RPO |
|------|----------|-----|-----|
| **Tier 1 (Critical)** | Rides, Auth, Real-time | 15 min | 0 (no data loss) |
| **Tier 2 (High)** | Payments, Notifications | 1 hour | 5 min |
| **Tier 3 (Medium)** | Admin, Reports | 4 hours | 1 hour |
| **Tier 4 (Low)** | Analytics, Archives | 24 hours | 24 hours |

---

## Options Considered

### Option A: Single Region with Zone Redundancy

High availability within one Azure region.

**Pros:**
- Lower cost (~30% less than multi-region)
- Simpler architecture
- Automatic zone failover
- Sufficient for most scenarios
- Faster development velocity

**Cons:**
- No protection against regional disasters
- Single point of failure at region level
- Limited by region capacity

### Option B: Active-Passive Multi-Region

Primary region with warm standby in secondary.

**Pros:**
- Regional disaster protection
- Controlled failover process
- Lower cost than active-active
- Clear primary/secondary roles
- Database replication built-in

**Cons:**
- Manual failover (typically)
- Standby resources partially wasted
- Higher cost than single region
- Replication lag for RPO

### Option C: Active-Active Multi-Region

Both regions serve traffic simultaneously.

**Pros:**
- Near-zero RTO for regional failures
- Better latency for distributed users
- No wasted standby resources
- Automatic failover

**Cons:**
- Highest cost
- Most complex architecture
- Data consistency challenges
- Overkill for SA-only market

### Option D: Pilot Light

Minimal standby with data replication only.

**Pros:**
- Lowest multi-region cost
- Data protected
- Can scale up when needed

**Cons:**
- Longer RTO (hours)
- Manual intervention required
- Cold start delays
- Not suitable for critical services

---

## Weighted Evaluation Matrix

| Criterion | Weight | Zone Redundant | Active-Passive | Active-Active | Pilot Light |
|-----------|--------|----------------|----------------|---------------|-------------|
| **RTO** | 20% | 4 | 4 | 5 | 2 |
| **RPO** | 18% | 4 | 4 | 5 | 4 |
| **Cost** | 18% | 5 | 3 | 1 | 4 |
| **Complexity** | 12% | 5 | 3 | 2 | 4 |
| **Data Integrity** | 10% | 4 | 5 | 4 | 5 |
| **Geographic Risk** | 8% | 2 | 5 | 5 | 4 |
| **Testing** | 6% | 5 | 3 | 2 | 4 |
| **Automation** | 4% | 5 | 3 | 5 | 2 |
| **MVP Appropriate** | 2% | 5 | 3 | 1 | 4 |
| **Growth Path** | 2% | 3 | 5 | 5 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Zone Redundant** | (4×.20)+(4×.18)+(5×.18)+(5×.12)+(4×.10)+(2×.08)+(5×.06)+(5×.04)+(5×.02)+(3×.02) | **4.22** |
| **Active-Passive** | (4×.20)+(4×.18)+(3×.18)+(3×.12)+(5×.10)+(5×.08)+(3×.06)+(3×.04)+(3×.02)+(5×.02) | **3.82** |
| **Pilot Light** | (2×.20)+(4×.18)+(4×.18)+(4×.12)+(5×.10)+(4×.08)+(4×.06)+(2×.04)+(4×.02)+(4×.02) | **3.60** |
| **Active-Active** | (5×.20)+(5×.18)+(1×.18)+(2×.12)+(4×.10)+(5×.08)+(2×.06)+(5×.04)+(1×.02)+(5×.02) | **3.50** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Single Region + Zone Redundancy** | 4.22 |
| 2 | Active-Passive Multi-Region | 3.82 |
| 3 | Pilot Light | 3.60 |
| 4 | Active-Active Multi-Region | 3.50 |

---

## Decision

**Selected: Single Region with Zone Redundancy (MVP)** with documented path to Active-Passive

### Rationale

1. **Right-sized for MVP**: Zone redundancy handles 99%+ of failure scenarios
2. **Cost-effective**: Multi-region adds ~R15,000+/month for standby infrastructure
3. **Sufficient for SA market**: Single region (Johannesburg) covers entire user base
4. **Built-in protection**: Azure zones are independent data centers
5. **Clear upgrade path**: Can add second region when business justifies cost

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUTH AFRICA NORTH (Johannesburg)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Availability Zone 1                              │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                      │   │
│  │  │ Container  │  │ PostgreSQL │  │   Redis    │                      │   │
│  │  │ Apps (1)   │  │  Primary   │  │  Primary   │                      │   │
│  │  └────────────┘  └────────────┘  └────────────┘                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Availability Zone 2                              │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                      │   │
│  │  │ Container  │  │ PostgreSQL │  │   Redis    │                      │   │
│  │  │ Apps (2)   │  │  Standby   │  │  Replica   │                      │   │
│  │  └────────────┘  └────────────┘  └────────────┘                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Availability Zone 3                              │   │
│  │  ┌────────────┐  ┌────────────┐                                      │   │
│  │  │ Container  │  │   Blob     │                                      │   │
│  │  │ Apps (3)   │  │  Storage   │  (ZRS - Zone Redundant)              │   │
│  │  └────────────┘  └────────────┘                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Cross-Zone Services                                │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │   Azure    │  │   Azure    │  │  SignalR   │  │    Key     │     │   │
│  │  │ Front Door │  │    CDN     │  │  Service   │  │   Vault    │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    │ Geo-Redundant Backups
                                    ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUTH AFRICA WEST (Cape Town) - Backup Only              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐                                             │
│  │ PostgreSQL │  │   Blob     │  (Geo-redundant copies)                     │
│  │   Backup   │  │   Backup   │                                             │
│  └────────────┘  └────────────┘                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component HA Configuration

| Component | HA Strategy | Failover |
|-----------|-------------|----------|
| **Container Apps** | Multi-replica across zones | Automatic (load balancer) |
| **PostgreSQL** | Zone-redundant HA | Automatic (< 30s) |
| **Redis** | Zone redundancy | Automatic |
| **Blob Storage** | ZRS (Zone Redundant Storage) | Automatic |
| **Front Door** | Global anycast | Automatic |
| **SignalR** | Multiple units | Automatic |
| **Key Vault** | Zone redundant | Automatic |

### Backup Strategy

| Data | Backup Type | Frequency | Retention | Location |
|------|-------------|-----------|-----------|----------|
| **PostgreSQL** | Automated | Continuous | 35 days PITR | Geo-redundant |
| **PostgreSQL** | Full backup | Daily | 90 days | Geo-redundant |
| **Blob Storage** | Soft delete | Continuous | 30 days | Same region |
| **Blob Storage** | Geo-replication | Continuous | - | Cape Town |
| **Key Vault** | Soft delete | Continuous | 90 days | - |
| **Config** | Git | On change | Indefinite | GitHub |

### Database HA Configuration

```bicep
// PostgreSQL Flexible Server with Zone Redundancy
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: 'psql-chaufher-${environmentName}'
  location: location
  sku: {
    name: 'Standard_D2ds_v4'
    tier: 'GeneralPurpose'
  }
  properties: {
    version: '16'
    availabilityZone: '1'
    highAvailability: {
      mode: 'ZoneRedundant'
      standbyAvailabilityZone: '2'
    }
    backup: {
      backupRetentionDays: 35
      geoRedundantBackup: 'Enabled'
    }
    storage: {
      storageSizeGB: 128
    }
  }
}
```

### Recovery Procedures

#### Scenario 1: Single Zone Failure

| Step | Action | Time | Owner |
|------|--------|------|-------|
| 1 | Azure automatically routes traffic to healthy zones | 0-30s | Azure |
| 2 | PostgreSQL fails over to standby | 30-60s | Azure |
| 3 | Monitor confirms recovery | 2 min | Ops |
| 4 | Investigate root cause | Post-recovery | DevOps |

**RTO**: < 1 minute (automatic)
**RPO**: 0 (synchronous replication)

#### Scenario 2: Database Corruption

| Step | Action | Time | Owner |
|------|--------|------|-------|
| 1 | Detect via monitoring/alerts | 0-5 min | Auto |
| 2 | Stop application writes | 5 min | DevOps |
| 3 | Identify corruption timestamp | 10 min | DevOps |
| 4 | Restore from PITR | 20-60 min | DevOps |
| 5 | Validate data integrity | 30 min | DevOps |
| 6 | Resume operations | 5 min | DevOps |

**RTO**: 1-2 hours
**RPO**: Based on corruption detection time

#### Scenario 3: Regional Disaster (Future Enhancement)

| Step | Action | Time | Owner |
|------|--------|------|-------|
| 1 | Declare disaster | 15 min | Management |
| 2 | Activate DR site (Cape Town) | 30-60 min | DevOps |
| 3 | Restore database from geo-backup | 1-4 hours | DevOps |
| 4 | Update DNS | 5 min | DevOps |
| 5 | Validate and resume | 30 min | DevOps |

**RTO**: 2-6 hours (manual process)
**RPO**: Up to 1 hour (async geo-replication)

---

## Monitoring & Alerting

### Health Checks

```csharp
// Health check endpoint
public class HealthCheckService : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken)
    {
        var checks = new Dictionary<string, object>();

        // Database connectivity
        checks["database"] = await CheckDatabaseAsync();

        // Redis connectivity
        checks["redis"] = await CheckRedisAsync();

        // External services
        checks["payfast"] = await CheckExternalServiceAsync("payfast");
        checks["signalr"] = await CheckSignalRAsync();

        var unhealthy = checks.Values.Any(v => v.ToString() == "Unhealthy");

        return unhealthy
            ? HealthCheckResult.Unhealthy("One or more checks failed", data: checks)
            : HealthCheckResult.Healthy("All checks passed", data: checks);
    }
}
```

### Alert Configuration

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| **API Availability** | < 99.5% | < 99% | Page on-call |
| **API Latency (p95)** | > 500ms | > 1000ms | Alert Slack |
| **Database CPU** | > 70% | > 90% | Scale up |
| **Database Connections** | > 80% | > 95% | Alert + scale |
| **Error Rate** | > 1% | > 5% | Page on-call |
| **Failed Health Check** | 1 failure | 3 failures | Page on-call |

---

## DR Testing

### Test Schedule

| Test Type | Frequency | Duration | Scope |
|-----------|-----------|----------|-------|
| **Failover drill** | Quarterly | 2 hours | Zone failover |
| **Backup restore** | Monthly | 4 hours | Database PITR |
| **Chaos engineering** | Monthly | 1 hour | Random component failure |
| **Full DR drill** | Annually | 8 hours | Regional failover |

### Chaos Engineering

```yaml
# Chaos Mesh experiment (future)
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-failure-test
spec:
  action: pod-failure
  mode: one
  selector:
    namespaces:
      - chaufher-prod
    labelSelectors:
      app: rides-api
  duration: "5m"
  scheduler:
    cron: "@monthly"
```

---

## Future: Multi-Region Enhancement

When business justifies (~6-12 months post-launch):

```
┌────────────────────────────────────┐    ┌────────────────────────────────────┐
│     SOUTH AFRICA NORTH (Primary)   │    │     SOUTH AFRICA WEST (Secondary)  │
│                                    │    │                                    │
│  ┌────────────┐  ┌────────────┐   │    │   ┌────────────┐  ┌────────────┐  │
│  │ Container  │  │ PostgreSQL │   │    │   │ Container  │  │ PostgreSQL │  │
│  │   Apps     │  │  Primary   │───┼────┼──▶│   Apps     │  │  Replica   │  │
│  └────────────┘  └────────────┘   │    │   └────────────┘  └────────────┘  │
│                                    │    │                                    │
└────────────────────────────────────┘    └────────────────────────────────────┘
                │                                          │
                └─────────────┬────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Azure Traffic   │
                    │     Manager       │
                    │  (Geo-routing)    │
                    └───────────────────┘
```

### Enhancement Triggers

| Trigger | Threshold | Action |
|---------|-----------|--------|
| **Revenue** | R500K+ MRR | Budget for multi-region |
| **User base** | 100K+ users | Justify infrastructure |
| **SLA requirement** | 99.99% demanded | Technical necessity |
| **Regulatory** | Data sovereignty | May require sooner |

---

## Consequences

### Positive

- Zone redundancy handles most failure scenarios
- Cost-effective for MVP stage
- Automatic failover for all components
- Geo-redundant backups protect against regional disaster
- Clear upgrade path documented

### Negative

- No automatic regional failover
- Manual DR for regional disaster (2-6 hour RTO)
- Single region limits geographic expansion

### Neutral

- DR procedures must be documented and tested
- Team needs DR training
- Quarterly drills required

---

## Related Documents

- [ADR-008: Cloud Provider (Azure)](008-cloud-provider-azure.md)
- [ADR-002: Database (PostgreSQL)](002-database-postgresql.md)
- [ADR-023: Networking & API Gateway](023-networking-api-gateway.md)
- [ADR-013: Monitoring & Observability](013-monitoring-observability.md)

---

## References

- [Azure Well-Architected Framework: Reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/)
- [Azure PostgreSQL HA](https://docs.microsoft.com/azure/postgresql/flexible-server/concepts-high-availability)
- [Azure Availability Zones](https://docs.microsoft.com/azure/availability-zones/)
- [Disaster Recovery Best Practices](https://docs.microsoft.com/azure/architecture/framework/resiliency/backup-and-recovery)
