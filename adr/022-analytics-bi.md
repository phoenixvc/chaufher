# ADR-022: Analytics & BI – Power BI vs Alternatives

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Product, Leadership
**Technical Story:** Business intelligence and analytics platform for operational insights

---

## Context

ChaufHER requires analytics and BI capabilities for:
- Operational dashboards (rides, drivers, revenue)
- Business KPIs tracking
- Executive reporting
- Driver performance analytics
- Geographic demand patterns
- Financial reporting
- Customer behavior analysis

The platform must:
- Connect to PostgreSQL database
- Provide interactive dashboards
- Support scheduled reports
- Enable self-service exploration
- Be accessible to non-technical users
- Be cost-effective for startup

---

## Decision Drivers

1. **Azure Integration** – Native Azure ecosystem fit
2. **PostgreSQL Support** – Direct database connection
3. **Ease of Use** – Non-technical user friendly
4. **Cost** – Licensing and infrastructure
5. **Visualizations** – Dashboard quality
6. **Sharing** – Report distribution
7. **Real-Time** – Near real-time data refresh
8. **Mobile** – Mobile dashboard access
9. **Self-Service** – User exploration capability
10. **Embedded** – Dashboard embedding options

---

## Options Considered

### Option A: Power BI

Microsoft's business intelligence platform.

**Pros:**
- Native Azure integration
- Excellent PostgreSQL connector
- Industry-leading visualizations
- Natural language Q&A
- Free desktop version
- Mobile apps (iOS/Android)
- Embedded analytics option
- Active community
- AI-powered insights
- Scheduled refresh

**Cons:**
- Pro license $10/user/month
- Premium for embedding
- Learning curve for DAX
- Heavy desktop app
- Can be complex

### Option B: Metabase

Open-source business intelligence.

**Pros:**
- Open-source (free)
- Simple, clean UI
- Easy PostgreSQL setup
- Self-hosted control
- Question-based queries
- Good for non-technical
- Embedded analytics
- Active community

**Cons:**
- Self-hosting overhead
- Less powerful than Power BI
- Limited visualizations
- Manual refresh management
- No mobile app
- Fewer enterprise features

### Option C: Looker (Google)

Google's BI and analytics platform.

**Pros:**
- Powerful modeling (LookML)
- Git-based definitions
- Good data governance
- Modern interface
- Embedded analytics

**Cons:**
- Very expensive
- Complex setup
- Google Cloud focused
- Steep learning curve
- Overkill for startup

### Option D: Apache Superset

Open-source BI platform.

**Pros:**
- Open-source (free)
- SQL-based
- Good visualizations
- PostgreSQL support
- Active development

**Cons:**
- Requires infrastructure
- Setup complexity
- Less polished UX
- Limited self-service
- Steeper learning curve

### Option E: Tableau

Leading BI platform.

**Pros:**
- Best-in-class visualizations
- Powerful analytics
- Large community
- Good PostgreSQL support

**Cons:**
- Very expensive ($70+/user)
- Complex licensing
- Heavy application
- Overkill for MVP

---

## Weighted Evaluation Matrix

| Criterion | Weight | Power BI | Metabase | Looker | Superset | Tableau |
|-----------|--------|----------|----------|--------|----------|---------|
| **Azure Integration** | 15% | 5 | 3 | 2 | 3 | 3 |
| **PostgreSQL Support** | 15% | 5 | 5 | 4 | 5 | 5 |
| **Ease of Use** | 15% | 4 | 5 | 3 | 3 | 4 |
| **Cost** | 15% | 4 | 5 | 1 | 5 | 1 |
| **Visualizations** | 10% | 5 | 3 | 4 | 4 | 5 |
| **Sharing** | 8% | 5 | 4 | 4 | 3 | 5 |
| **Real-Time** | 7% | 5 | 3 | 4 | 3 | 4 |
| **Mobile** | 6% | 5 | 2 | 3 | 2 | 4 |
| **Self-Service** | 5% | 5 | 4 | 3 | 3 | 5 |
| **Embedded** | 4% | 4 | 5 | 5 | 4 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Power BI** | (5×.15)+(5×.15)+(4×.15)+(4×.15)+(5×.10)+(5×.08)+(5×.07)+(5×.06)+(5×.05)+(4×.04) | **4.56** |
| **Metabase** | (3×.15)+(5×.15)+(5×.15)+(5×.15)+(3×.10)+(4×.08)+(3×.07)+(2×.06)+(4×.05)+(5×.04) | **4.00** |
| **Superset** | (3×.15)+(5×.15)+(3×.15)+(5×.15)+(4×.10)+(3×.08)+(3×.07)+(2×.06)+(3×.05)+(4×.04) | **3.67** |
| **Tableau** | (3×.15)+(5×.15)+(4×.15)+(1×.15)+(5×.10)+(5×.08)+(4×.07)+(4×.06)+(5×.05)+(4×.04) | **3.60** |
| **Looker** | (2×.15)+(4×.15)+(3×.15)+(1×.15)+(4×.10)+(4×.08)+(4×.07)+(3×.06)+(3×.05)+(5×.04) | **2.97** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Power BI** | 4.56 |
| 2 | Metabase | 4.00 |
| 3 | Apache Superset | 3.67 |
| 4 | Tableau | 3.60 |
| 5 | Looker | 2.97 |

---

## Analysis

### Why Power BI Wins for ChaufHER

1. **Azure Native**: Seamless integration:
   - Same Azure AD authentication
   - Azure PostgreSQL direct connect
   - Azure integration for data sources
   - Single vendor billing

2. **Free to Start**: Power BI Desktop is free:
   - Create reports locally
   - Connect to PostgreSQL
   - Design dashboards
   - Only pay when sharing (Pro)

3. **Non-Technical Friendly**: Business users can explore:
   - Drag-and-drop interface
   - Natural language Q&A
   - Pre-built visualizations
   - Excel-like experience

4. **Mobile First**: Native mobile apps:
   - iOS and Android
   - Touch-optimized dashboards
   - Push notifications for alerts
   - Offline capable

5. **Enterprise Ready**: Scales with growth:
   - Row-level security
   - Data governance
   - Certified datasets
   - Deployment pipelines

### Metabase Consideration

Metabase scored well (4.00) and is excellent for:
- Cost-sensitive scenarios
- Self-hosting preference
- Simpler requirements
- Developer-focused teams

For Azure-integrated, mobile-accessible BI, Power BI wins.

### Phased Approach

**Phase 1 (MVP)**: Power BI Desktop (free)
- Connect to PostgreSQL
- Build initial dashboards
- Export/share as PDF/screenshots

**Phase 2 (Growth)**: Power BI Pro ($10/user)
- Online sharing
- Scheduled refresh
- Mobile apps
- Collaboration

**Phase 3 (Scale)**: Power BI Premium
- Embedded analytics
- Large datasets
- Paginated reports

### When to Reconsider

Consider Metabase if:
- Cost is primary driver
- Team prefers self-hosted
- Simpler needs sufficient
- No mobile requirement

---

## Decision

**Selected: Power BI** for business intelligence

### Dashboard Strategy

| Dashboard | Audience | Update Frequency |
|-----------|----------|------------------|
| **Operations** | Ops team | Real-time |
| **Executive** | Leadership | Daily |
| **Driver Performance** | Ops, Drivers | Weekly |
| **Financial** | Finance | Monthly |
| **Product** | Product team | Weekly |

### Key Metrics

**Operations Dashboard:**
- Active rides (real-time)
- Driver online count
- Average wait time
- Completion rate
- Geographic heatmap

**Executive Dashboard:**
- Total rides (MTD, YTD)
- Revenue (MTD, YTD)
- Active riders/drivers
- CSAT score
- Growth trends

**Driver Performance:**
- Rides completed
- Rating average
- Acceptance rate
- Cancellation rate
- Earnings

**Financial:**
- Gross bookings
- Net revenue
- Average fare
- Payment success rate
- Payout totals

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Analytics Architecture                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                                           │
│  │ Azure PostgreSQL │                                           │
│  │ (Operational DB) │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
│           │ Direct Query                                        │
│           │ or Import                                           │
│           ▼                                                      │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │  Power BI        │────▶│ Power BI         │                  │
│  │  Desktop         │     │ Service          │                  │
│  │  (Authoring)     │     │ (Sharing)        │                  │
│  └──────────────────┘     └────────┬─────────┘                  │
│                                    │                             │
│                    ┌───────────────┼───────────────┐            │
│                    ▼               ▼               ▼            │
│           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│           │  Web Portal  │ │  Mobile App  │ │  Embedded    │   │
│           │  (Browser)   │ │  (iOS/And)   │ │  (Admin Web) │   │
│           └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### PostgreSQL Connection

```
Server: chaufher-prod.postgres.database.azure.com
Database: chaufher
Port: 5432
Authentication: Azure AD (Managed Identity)
SSL: Required
```

### Data Model (Star Schema)

```sql
-- Fact table
rides_fact
├── ride_id
├── date_key → dim_date
├── rider_key → dim_rider
├── driver_key → dim_driver
├── pickup_location_key → dim_location
├── dropoff_location_key → dim_location
├── fare_amount
├── tip_amount
├── wait_time_minutes
├── trip_duration_minutes
└── distance_km

-- Dimensions
dim_date (date_key, date, day, week, month, year)
dim_rider (rider_key, name, region, signup_date)
dim_driver (driver_key, name, rating, vehicle_type)
dim_location (location_key, suburb, city, region)
```

### Cost Estimate

| Phase | Users | Monthly Cost |
|-------|-------|--------------|
| MVP (Desktop) | 1 | $0 |
| Growth (Pro) | 5 | $50 |
| Scale (Pro) | 10 | $100 |

### Sample DAX Measures

```dax
// Total Rides MTD
Total Rides MTD =
CALCULATE(
    COUNTROWS(rides_fact),
    DATESMTD(dim_date[date])
)

// Revenue MTD
Revenue MTD =
CALCULATE(
    SUM(rides_fact[fare_amount]),
    DATESMTD(dim_date[date])
)

// Average Rating
Avg Driver Rating =
AVERAGE(rides_fact[driver_rating])

// Completion Rate
Completion Rate =
DIVIDE(
    CALCULATE(COUNTROWS(rides_fact), rides_fact[status] = "Completed"),
    COUNTROWS(rides_fact)
)
```

---

## Consequences

### Positive

- Native Azure integration
- Free to start (Desktop)
- Excellent mobile apps
- Industry-leading visualizations
- Self-service for business users

### Negative

- Pro license costs per user
- DAX learning curve
- Desktop app is Windows-only
- Can become complex

### Neutral

- Team learns Power BI
- Reports created in Desktop
- Can embed in admin portal later

---

## Related Documents

- [ADR-002: Database (PostgreSQL)](002-database-postgresql.md)
- [ADR-008: Cloud Provider (Azure)](008-cloud-provider-azure.md)
- [ADR-013: Monitoring & Observability](013-monitoring-observability.md)

---

## References

- [Power BI Documentation](https://docs.microsoft.com/power-bi/)
- [Power BI PostgreSQL Connector](https://docs.microsoft.com/power-bi/connect-data/desktop-connect-postgresql)
- [Power BI Pricing](https://powerbi.microsoft.com/pricing/)
- [DAX Reference](https://docs.microsoft.com/dax/)
