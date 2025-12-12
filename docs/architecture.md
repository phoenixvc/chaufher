# ChaufHER Platform Architecture

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben

---

## Overview

ChaufHER is a women-focused ride-hailing platform built on Azure with a distributed microservices-ready architecture. The platform prioritizes safety, reliability, and scalability while maintaining cost-effectiveness for MVP launch.

---

## Architecture Principles

| Principle | Description |
|-----------|-------------|
| **Safety-First** | All architectural decisions prioritize user safety features |
| **Azure-Native** | Leverage Azure PaaS services to minimize operational overhead |
| **API-First** | All functionality exposed via well-documented REST APIs |
| **Event-Driven** | Real-time updates via SignalR and background job processing |
| **Security by Design** | Zero-trust networking, encryption everywhere, least privilege |
| **Cost-Conscious** | Right-size for MVP, scale when needed |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CHAUFHER PLATFORM                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           CLIENT LAYER                                   │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                          │    │
│  │   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │    │
│  │   │   Rider PWA  │    │  Driver PWA  │    │  Admin Web   │             │    │
│  │   │   (Vite/TS)  │    │  (Vite/TS)   │    │   (React)    │             │    │
│  │   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘             │    │
│  │          │                   │                   │                      │    │
│  └──────────┼───────────────────┼───────────────────┼──────────────────────┘    │
│             │                   │                   │                           │
│             └───────────────────┼───────────────────┘                           │
│                                 │                                               │
│  ┌──────────────────────────────▼──────────────────────────────────────────┐   │
│  │                          EDGE LAYER                                      │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                          │   │
│  │   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │   │
│  │   │  Azure CDN   │    │  Azure WAF   │    │   Azure      │             │   │
│  │   │  (Static)    │    │  (Security)  │    │   Front Door │             │   │
│  │   └──────────────┘    └──────────────┘    └──────┬───────┘             │   │
│  │                                                  │                      │   │
│  └──────────────────────────────────────────────────┼──────────────────────┘   │
│                                                     │                          │
│  ┌──────────────────────────────────────────────────▼──────────────────────┐   │
│  │                        APPLICATION LAYER                                 │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                          │   │
│  │   ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │   │                    Azure Container Apps                          │   │   │
│  │   ├─────────────────────────────────────────────────────────────────┤   │   │
│  │   │                                                                  │   │   │
│  │   │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │   │   │
│  │   │  │   Rides    │ │   Users    │ │  Payments  │ │   Comms    │   │   │   │
│  │   │  │  Service   │ │  Service   │ │  Service   │ │  Service   │   │   │   │
│  │   │  │  (.NET 9)  │ │  (.NET 9)  │ │  (.NET 9)  │ │  (.NET 9)  │   │   │   │
│  │   │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘   │   │   │
│  │   │        │              │              │              │          │   │   │
│  │   └────────┼──────────────┼──────────────┼──────────────┼──────────┘   │   │
│  │            │              │              │              │              │   │
│  │   ┌────────▼──────────────▼──────────────▼──────────────▼──────────┐   │   │
│  │   │                    Azure SignalR Service                        │   │   │
│  │   │                    (Real-Time Updates)                          │   │   │
│  │   └─────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                          │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                          DATA LAYER                                       │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                          │   │
│  │   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │   │
│  │   │  PostgreSQL  │    │ Azure Redis  │    │  Azure Blob  │             │   │
│  │   │  (Flexible)  │    │   Cache      │    │   Storage    │             │   │
│  │   │              │    │              │    │              │             │   │
│  │   │  - Users     │    │  - Sessions  │    │  - Documents │             │   │
│  │   │  - Rides     │    │  - Geo cache │    │  - Photos    │             │   │
│  │   │  - Payments  │    │  - Rate lim  │    │  - Receipts  │             │   │
│  │   │  - Vehicles  │    │              │    │              │             │   │
│  │   └──────────────┘    └──────────────┘    └──────────────┘             │   │
│  │                                                                          │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                      INTEGRATION LAYER                                    │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                          │   │
│  │   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │   │
│  │   │  PayFast   │ │  Google    │ │  Africa's  │ │  SendGrid  │          │   │
│  │   │ (Payments) │ │   Maps     │ │  Talking   │ │  (Email)   │          │   │
│  │   └────────────┘ └────────────┘ └────────────┘ └────────────┘          │   │
│  │                                                                          │   │
│  │   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │   │
│  │   │  Firebase  │ │  Sentry    │ │  Azure AD  │ │  Power BI  │          │   │
│  │   │   (Push)   │ │  (Errors)  │ │    B2C     │ │ (Analytics)│          │   │
│  │   └────────────┘ └────────────┘ └────────────┘ └────────────┘          │   │
│  │                                                                          │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                      OPERATIONS LAYER                                     │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                          │   │
│  │   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │   │
│  │   │   Azure    │ │   Azure    │ │  GitHub    │ │   Azure    │          │   │
│  │   │  Monitor   │ │  Key Vault │ │  Actions   │ │ App Config │          │   │
│  │   └────────────┘ └────────────┘ └────────────┘ └────────────┘          │   │
│  │                                                                          │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Client Layer

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Rider PWA** | Vite, TypeScript, Workbox | Book rides, track drivers, payments |
| **Driver PWA** | Vite, TypeScript, Workbox | Accept rides, navigate, earnings |
| **Admin Web** | React, TypeScript | Operations, support, analytics |

**Key Patterns:**
- Offline-first with service workers
- Real-time updates via SignalR
- Push notifications via Firebase
- Responsive design for all devices

### Edge Layer

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Azure Front Door** | Azure PaaS | Global load balancing, SSL termination |
| **Azure WAF** | Azure PaaS | Web application firewall, OWASP protection |
| **Azure CDN** | Azure PaaS | Static asset delivery, caching |

**Security Features:**
- DDoS protection (Azure DDoS Standard)
- TLS 1.3 everywhere
- Geographic restrictions
- Rate limiting

### Application Layer

| Service | Responsibility | Key Endpoints |
|---------|---------------|---------------|
| **Rides Service** | Ride lifecycle, matching | `/api/rides/*` |
| **Users Service** | Authentication, profiles | `/api/users/*`, `/api/drivers/*` |
| **Payments Service** | Transactions, payouts | `/api/payments/*` |
| **Communications Service** | SMS, email, push | `/api/notifications/*` |

**Deployment:**
- Azure Container Apps (managed Kubernetes)
- Auto-scaling (0-N replicas)
- Blue-green deployments
- Health checks and liveness probes

### Data Layer

| Store | Technology | Data Types |
|-------|------------|------------|
| **PostgreSQL** | Azure Flexible Server | Users, rides, payments, vehicles |
| **Redis** | Azure Cache | Sessions, geolocation cache, rate limits |
| **Blob Storage** | Azure Storage | Documents, photos, receipts |

**Data Patterns:**
- Read replicas for reporting
- Geo-redundant backups
- Point-in-time recovery (35 days)
- Encryption at rest (AES-256)

---

## Data Flow Diagrams

### Ride Booking Flow

```
┌────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐     ┌────────┐
│ Rider  │     │   API   │     │  Redis   │     │  Rides  │     │ Driver │
│  PWA   │     │ Gateway │     │  Cache   │     │ Service │     │  PWA   │
└───┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘     └───┬────┘
    │               │               │                │              │
    │ 1. Request    │               │                │              │
    │    Ride       │               │                │              │
    │──────────────▶│               │                │              │
    │               │               │                │              │
    │               │ 2. Get nearby │                │              │
    │               │    drivers    │                │              │
    │               │──────────────▶│                │              │
    │               │               │                │              │
    │               │◀──────────────│                │              │
    │               │               │                │              │
    │               │ 3. Create     │                │              │
    │               │    ride       │                │              │
    │               │───────────────────────────────▶│              │
    │               │               │                │              │
    │               │               │                │ 4. Notify    │
    │               │               │                │    drivers   │
    │               │               │                │─────────────▶│
    │               │               │                │              │
    │               │               │                │ 5. Driver    │
    │               │               │                │    accepts   │
    │               │               │                │◀─────────────│
    │               │               │                │              │
    │ 6. Ride       │               │                │              │
    │    confirmed  │               │                │              │
    │◀──────────────│◀──────────────────────────────│              │
    │               │               │                │              │
    │ 7. Real-time tracking via SignalR             │              │
    │◀──────────────────────────────────────────────────────────────│
```

### Payment Flow

```
┌────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐     ┌────────┐
│ Rider  │     │ Payment │     │ PayFast  │     │   DB    │     │ Driver │
│  PWA   │     │ Service │     │          │     │         │     │  PWA   │
└───┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘     └───┬────┘
    │               │               │                │              │
    │ 1. Ride       │               │                │              │
    │    complete   │               │                │              │
    │──────────────▶│               │                │              │
    │               │               │                │              │
    │               │ 2. Initiate   │                │              │
    │               │    payment    │                │              │
    │               │──────────────▶│                │              │
    │               │               │                │              │
    │ 3. Payment    │               │                │              │
    │    redirect   │               │                │              │
    │◀──────────────│               │                │              │
    │               │               │                │              │
    │ 4. Complete   │               │                │              │
    │    payment    │               │                │              │
    │──────────────────────────────▶│                │              │
    │               │               │                │              │
    │               │ 5. Webhook    │                │              │
    │               │    callback   │                │              │
    │               │◀──────────────│                │              │
    │               │               │                │              │
    │               │ 6. Update     │                │              │
    │               │    records    │                │              │
    │               │───────────────────────────────▶│              │
    │               │               │                │              │
    │ 7. Receipt    │               │                │              │
    │◀──────────────│               │                │              │
    │               │               │ 8. Driver      │              │
    │               │               │    payout      │              │
    │               │               │    (weekly)    │              │
    │               │               │────────────────────────────────▶
```

---

## Service Architecture

### API Design

```
/api/v1/
├── auth/
│   ├── POST /login              # Phone + OTP login
│   ├── POST /verify             # OTP verification
│   ├── POST /refresh            # Token refresh
│   └── POST /logout             # Session termination
│
├── users/
│   ├── GET    /me               # Current user profile
│   ├── PUT    /me               # Update profile
│   ├── POST   /me/photo         # Upload photo
│   └── DELETE /me               # Account deletion
│
├── riders/
│   ├── GET    /saved-places     # Saved locations
│   ├── POST   /saved-places     # Add location
│   └── GET    /ride-history     # Past rides
│
├── drivers/
│   ├── POST   /apply            # Driver application
│   ├── GET    /status           # Online/offline status
│   ├── PUT    /status           # Toggle availability
│   ├── GET    /earnings         # Earnings summary
│   └── GET    /documents        # Uploaded documents
│
├── rides/
│   ├── POST   /estimate         # Fare estimate
│   ├── POST   /                 # Create ride request
│   ├── GET    /{id}             # Ride details
│   ├── PUT    /{id}/accept      # Driver accepts
│   ├── PUT    /{id}/start       # Start ride
│   ├── PUT    /{id}/complete    # Complete ride
│   ├── PUT    /{id}/cancel      # Cancel ride
│   └── POST   /{id}/rate        # Rate ride
│
├── payments/
│   ├── GET    /methods          # Payment methods
│   ├── POST   /methods          # Add payment method
│   ├── POST   /{rideId}/pay     # Process payment
│   └── GET    /history          # Payment history
│
├── vehicles/
│   ├── GET    /                 # Driver's vehicles
│   ├── POST   /                 # Add vehicle
│   ├── PUT    /{id}             # Update vehicle
│   └── POST   /{id}/photos      # Upload photos
│
└── admin/
    ├── GET    /dashboard        # Admin metrics
    ├── GET    /users            # User management
    ├── GET    /drivers          # Driver management
    ├── GET    /rides            # Ride oversight
    └── GET    /reports          # Generate reports
```

### Real-Time Events (SignalR)

| Hub | Event | Direction | Payload |
|-----|-------|-----------|---------|
| **RideHub** | `RideRequested` | Server → Driver | Ride details, pickup location |
| **RideHub** | `RideAccepted` | Server → Rider | Driver details, ETA |
| **RideHub** | `DriverLocation` | Server → Rider | GPS coordinates |
| **RideHub** | `RideStarted` | Server → Both | Timestamp |
| **RideHub** | `RideCompleted` | Server → Both | Fare, receipt |
| **RideHub** | `RideCancelled` | Server → Both | Reason, cancellation fee |
| **NotificationHub** | `Alert` | Server → User | Safety alert, system message |

---

## Security Architecture

### Authentication Flow

```
┌────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│  PWA   │     │   API   │     │ Azure AD │     │  Redis  │
│        │     │         │     │   B2C    │     │         │
└───┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘
    │               │               │                │
    │ 1. Login      │               │                │
    │    (phone)    │               │                │
    │──────────────▶│               │                │
    │               │               │                │
    │               │ 2. Initiate   │                │
    │               │    OTP flow   │                │
    │               │──────────────▶│                │
    │               │               │                │
    │               │               │──┐             │
    │               │               │  │ 3. Send OTP │
    │               │               │◀─┘    via SMS  │
    │               │               │                │
    │ 4. Enter OTP  │               │                │
    │──────────────▶│──────────────▶│                │
    │               │               │                │
    │               │ 5. JWT tokens │                │
    │               │◀──────────────│                │
    │               │               │                │
    │               │ 6. Cache      │                │
    │               │    session    │                │
    │               │───────────────────────────────▶│
    │               │               │                │
    │ 7. Auth       │               │                │
    │    complete   │               │                │
    │◀──────────────│               │                │
```

### Security Layers

| Layer | Protection | Implementation |
|-------|------------|----------------|
| **Network** | DDoS, WAF | Azure Front Door, WAF |
| **Transport** | Encryption | TLS 1.3, certificate pinning |
| **Application** | Auth, authz | Azure AD B2C, role-based access |
| **Data** | Encryption | AES-256 at rest, TLS in transit |
| **Secrets** | Management | Azure Key Vault, managed identity |

---

## Infrastructure Architecture

### Azure Resources

```
Resource Group: rg-chaufher-{env}
│
├── Networking
│   ├── Virtual Network (vnet-chaufher-{env})
│   │   ├── Subnet: snet-aca (Container Apps)
│   │   ├── Subnet: snet-db (PostgreSQL)
│   │   └── Subnet: snet-cache (Redis)
│   ├── Front Door (afd-chaufher-{env})
│   ├── WAF Policy (waf-chaufher-{env})
│   └── Private DNS Zones
│
├── Compute
│   ├── Container Apps Environment (cae-chaufher-{env})
│   │   ├── ca-rides-api
│   │   ├── ca-users-api
│   │   ├── ca-payments-api
│   │   └── ca-comms-api
│   └── Container Registry (crchaufher{env})
│
├── Data
│   ├── PostgreSQL Flexible Server (psql-chaufher-{env})
│   ├── Redis Cache (redis-chaufher-{env})
│   └── Storage Account (stchaufher{env})
│       ├── Container: profile-photos
│       ├── Container: vehicle-photos
│       ├── Container: driver-documents
│       └── Container: ride-receipts
│
├── Identity & Security
│   ├── Azure AD B2C Tenant
│   ├── Key Vault (kv-chaufher-{env})
│   └── Managed Identities
│
├── Monitoring
│   ├── Log Analytics Workspace
│   ├── Application Insights
│   └── Azure Monitor Alerts
│
└── Integration
    ├── SignalR Service (sigr-chaufher-{env})
    └── App Configuration (appcs-chaufher-{env})
```

### Environment Strategy

| Environment | Purpose | Scale | Data |
|-------------|---------|-------|------|
| **dev** | Development | Minimal | Synthetic |
| **staging** | Pre-production | Production-like | Anonymized |
| **prod** | Production | Auto-scaling | Real |

---

## Scalability Architecture

### Auto-Scaling Rules

| Component | Metric | Scale Out | Scale In |
|-----------|--------|-----------|----------|
| **API Services** | CPU > 70% | +1 replica | CPU < 30% |
| **API Services** | Requests/sec > 100 | +1 replica | Requests < 50 |
| **Redis** | Memory > 80% | Upgrade tier | Manual |
| **PostgreSQL** | CPU > 80% | Add read replica | Manual |

### Peak Load Handling

```
Normal Load (off-peak):
├── Rides API: 2 replicas
├── Users API: 1 replica
├── Payments API: 1 replica
└── Comms API: 1 replica

Peak Load (rush hour):
├── Rides API: 10 replicas
├── Users API: 3 replicas
├── Payments API: 3 replicas
└── Comms API: 5 replicas
```

### Geographic Distribution (Future)

```
Phase 1 (MVP):
└── South Africa North (Johannesburg)

Phase 2 (Expansion):
├── South Africa North (Primary)
└── South Africa West (Cape Town - DR)

Phase 3 (Continental):
├── South Africa (Primary)
├── West Africa (Nigeria)
└── East Africa (Kenya)
```

---

## Observability Architecture

### Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     OBSERVABILITY                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Metrics    │    │    Logs      │    │   Traces     │      │
│  │              │    │              │    │              │      │
│  │  - CPU/Mem   │    │  - App logs  │    │  - Request   │      │
│  │  - Requests  │    │  - API logs  │    │    traces    │      │
│  │  - Latency   │    │  - Errors    │    │  - Deps      │      │
│  │  - Custom    │    │  - Audit     │    │  - E2E flow  │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                    │
│                    ┌────────▼────────┐                          │
│                    │  Azure Monitor  │                          │
│                    │  + App Insights │                          │
│                    └────────┬────────┘                          │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│  ┌──────▼───────┐   ┌──────▼───────┐   ┌──────▼───────┐       │
│  │  Dashboards  │   │    Alerts    │   │   Power BI   │       │
│  │   (Grafana)  │   │              │   │  (Analytics) │       │
│  └──────────────┘   └──────────────┘   └──────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      Sentry (PWA Errors)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Metrics

| Category | Metric | Target | Alert Threshold |
|----------|--------|--------|-----------------|
| **Availability** | Uptime | 99.9% | < 99.5% |
| **Performance** | API Latency (p95) | < 200ms | > 500ms |
| **Performance** | Page Load | < 3s | > 5s |
| **Reliability** | Error Rate | < 0.1% | > 1% |
| **Business** | Ride Completion Rate | > 95% | < 90% |
| **Business** | Driver Response Time | < 30s | > 60s |

---

## Deployment Architecture

### CI/CD Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │     │   GitHub    │     │   Azure     │     │   Azure     │
│    Push     │────▶│   Actions   │────▶│  Container  │────▶│  Container  │
│             │     │             │     │  Registry   │     │    Apps     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              ┌─────▼─────┐ ┌─────▼─────┐
              │   Build   │ │   Test    │
              │  Docker   │ │   Unit    │
              │  Image    │ │   Int     │
              └───────────┘ └───────────┘
```

### Deployment Strategy

| Environment | Strategy | Rollback |
|-------------|----------|----------|
| **dev** | Direct deploy | Immediate |
| **staging** | Blue-green | Previous revision |
| **prod** | Blue-green + canary | Previous revision |

---

## Related Documents

- [ADR Index](../README.md#architecture-decision-records-adrs) — All architectural decisions
- [PRD](PRD.md) — Product requirements
- [API Documentation](api/README.md) — API technical details
- [Infrastructure](infra/README.md) — IaC and deployment

---

## References

- [Azure Well-Architected Framework](https://docs.microsoft.com/azure/architecture/framework/)
- [Azure Container Apps](https://docs.microsoft.com/azure/container-apps/)
- [SignalR Service](https://docs.microsoft.com/azure/azure-signalr/)
- [Azure Front Door](https://docs.microsoft.com/azure/frontdoor/)
