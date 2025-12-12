# ChaufHER C4 Architecture Diagrams

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben

---

## Overview

This document presents the ChaufHER platform architecture using the [C4 model](https://c4model.com/) - a hierarchical approach to software architecture documentation with four levels of abstraction:

1. **Context** - System context showing users and external systems
2. **Container** - High-level technology choices and deployable units
3. **Component** - Internal structure of each container
4. **Code** - Implementation details (class/sequence diagrams)

---

## Level 1: System Context Diagram

The system context diagram shows ChaufHER as a single system, identifying the users and external systems it interacts with.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SYSTEM CONTEXT                                         │
│                                                                                          │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐       │
│   │             │      │             │      │             │      │             │       │
│   │    Rider    │      │   Driver    │      │   Admin     │      │  Support    │       │
│   │   (Woman/   │      │   (Woman)   │      │   Staff     │      │   Agent     │       │
│   │   Family)   │      │             │      │             │      │             │       │
│   │             │      │             │      │             │      │             │       │
│   └──────┬──────┘      └──────┬──────┘      └──────┬──────┘      └──────┬──────┘       │
│          │                    │                    │                    │              │
│          │ Books rides        │ Accepts rides      │ Manages            │ Handles      │
│          │ Tracks driver      │ Earns money        │ operations         │ disputes     │
│          │ Makes payments     │ Views earnings     │ Views analytics    │              │
│          │                    │                    │                    │              │
│          └────────────────────┼────────────────────┼────────────────────┘              │
│                               │                    │                                    │
│                               ▼                    ▼                                    │
│                    ┌─────────────────────────────────────────┐                         │
│                    │                                         │                         │
│                    │           CHAUFHER PLATFORM             │                         │
│                    │                                         │                         │
│                    │   Women-focused ride-hailing platform   │                         │
│                    │   connecting riders with vetted women   │                         │
│                    │   drivers in South Africa               │                         │
│                    │                                         │                         │
│                    └───────────────────┬─────────────────────┘                         │
│                                        │                                               │
│          ┌─────────────────────────────┼─────────────────────────────┐                │
│          │                             │                             │                │
│          ▼                             ▼                             ▼                │
│   ┌─────────────┐             ┌─────────────┐             ┌─────────────┐            │
│   │             │             │             │             │             │            │
│   │  Payment    │             │    Maps     │             │   Identity  │            │
│   │  Gateway    │             │  Provider   │             │  Provider   │            │
│   │  (PayFast)  │             │  (Google)   │             │ (Azure B2C) │            │
│   │             │             │             │             │             │            │
│   └─────────────┘             └─────────────┘             └─────────────┘            │
│                                                                                       │
│   ┌─────────────┐             ┌─────────────┐             ┌─────────────┐            │
│   │             │             │             │             │             │            │
│   │     SMS     │             │    Email    │             │    Push     │            │
│   │  (Africa's  │             │ (SendGrid)  │             │ (Firebase)  │            │
│   │  Talking)   │             │             │             │             │            │
│   │             │             │             │             │             │            │
│   └─────────────┘             └─────────────┘             └─────────────┘            │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Context Elements

| Element | Type | Description |
|---------|------|-------------|
| **Rider** | Person | Women and families booking rides |
| **Driver** | Person | Vetted women drivers earning income |
| **Admin** | Person | ChaufHER staff managing operations |
| **Support** | Person | Customer support handling issues |
| **ChaufHER Platform** | System | Core ride-hailing platform |
| **PayFast** | External | South African payment gateway |
| **Google Maps** | External | Geocoding, routing, ETA |
| **Azure AD B2C** | External | Identity and authentication |
| **Africa's Talking** | External | SMS notifications |
| **SendGrid** | External | Email delivery |
| **Firebase** | External | Push notifications |

---

## Level 2: Container Diagram

The container diagram shows the high-level technical building blocks - deployable units that make up the system.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         CONTAINER DIAGRAM                                               │
│                                                                                                         │
│  USERS                                                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                                                              │
│  │  Rider   │  │  Driver  │  │  Admin   │                                                              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                                                              │
│       │             │             │                                                                     │
│       │ HTTPS       │ HTTPS       │ HTTPS                                                               │
│       │             │             │                                                                     │
│  ─────┼─────────────┼─────────────┼─────────────────────────────────────────────────────────────────   │
│       │             │             │                                                                     │
│       ▼             ▼             │                                                                     │
│  ┌────────────────────────┐      │      ┌────────────────────────┐                                     │
│  │                        │      │      │                        │                                     │
│  │      RIDER/DRIVER      │      │      │      ADMIN WEB APP     │                                     │
│  │         PWA            │      │      │        (React)         │                                     │
│  │                        │      └─────▶│                        │                                     │
│  │  [Vite + TypeScript]   │             │  [React + TypeScript]  │                                     │
│  │                        │             │                        │                                     │
│  │  - Book/accept rides   │             │  - Operations mgmt     │                                     │
│  │  - Real-time tracking  │             │  - Driver management   │                                     │
│  │  - Payments            │             │  - Analytics           │                                     │
│  │  - Offline support     │             │  - Support tools       │                                     │
│  │                        │             │                        │                                     │
│  └───────────┬────────────┘             └───────────┬────────────┘                                     │
│              │                                      │                                                   │
│              │ REST API / WebSocket                 │ REST API                                          │
│              │                                      │                                                   │
│  ────────────┼──────────────────────────────────────┼───────────────────────────────────────────────   │
│              │                                      │                                                   │
│              │         ┌────────────────────────────┘                                                   │
│              │         │                                                                                │
│              ▼         ▼                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                    AZURE FRONT DOOR                                              │   │
│  │                        (Load Balancer, WAF, SSL Termination, CDN)                               │   │
│  └───────────────────────────────────────────────┬─────────────────────────────────────────────────┘   │
│                                                  │                                                      │
│              ┌───────────────────────────────────┼───────────────────────────────────┐                 │
│              │                                   │                                   │                 │
│              ▼                                   ▼                                   ▼                 │
│  ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐           │
│  │                        │      │                        │      │                        │           │
│  │      RIDES API         │      │      USERS API         │      │    PAYMENTS API        │           │
│  │    (.NET 9 / C#)       │      │    (.NET 9 / C#)       │      │    (.NET 9 / C#)       │           │
│  │                        │      │                        │      │                        │           │
│  │  [Azure Container App] │      │  [Azure Container App] │      │  [Azure Container App] │           │
│  │                        │      │                        │      │                        │           │
│  │  - Ride lifecycle      │      │  - Authentication      │      │  - Payment processing  │           │
│  │  - Driver matching     │      │  - User profiles       │      │  - PayFast integration │           │
│  │  - Scheduling          │      │  - Driver management   │      │  - Payout management   │           │
│  │  - ETA calculation     │      │  - Document storage    │      │  - Transaction history │           │
│  │                        │      │                        │      │                        │           │
│  └───────────┬────────────┘      └───────────┬────────────┘      └───────────┬────────────┘           │
│              │                               │                               │                         │
│              │                               │                               │                         │
│              └───────────────────────────────┼───────────────────────────────┘                         │
│                                              │                                                          │
│              ┌───────────────────────────────┼───────────────────────────────┐                         │
│              │                               │                               │                         │
│              ▼                               ▼                               ▼                         │
│  ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐           │
│  │                        │      │                        │      │                        │           │
│  │   COMMUNICATIONS API   │      │   AZURE SIGNALR        │      │   BACKGROUND JOBS      │           │
│  │    (.NET 9 / C#)       │      │      SERVICE           │      │    (Hangfire)          │           │
│  │                        │      │                        │      │                        │           │
│  │  [Azure Container App] │      │  [Managed Service]     │      │  [Azure Container App] │           │
│  │                        │      │                        │      │                        │           │
│  │  - SMS via Africa's    │      │  - Real-time updates   │      │  - Scheduled tasks     │           │
│  │    Talking             │      │  - Driver location     │      │  - Payout processing   │           │
│  │  - Email via SendGrid  │      │  - Ride status         │      │  - Report generation   │           │
│  │  - Push via Firebase   │      │  - Notifications       │      │  - Cleanup jobs        │           │
│  │                        │      │                        │      │                        │           │
│  └────────────────────────┘      └────────────────────────┘      └────────────────────────┘           │
│                                                                                                         │
│  ────────────────────────────────────────────────────────────────────────────────────────────────────  │
│                                              DATA STORES                                                │
│                                                                                                         │
│  ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐           │
│  │                        │      │                        │      │                        │           │
│  │      POSTGRESQL        │      │      AZURE REDIS       │      │    AZURE BLOB          │           │
│  │   (Flexible Server)    │      │        CACHE           │      │     STORAGE            │           │
│  │                        │      │                        │      │                        │           │
│  │  - Users               │      │  - Session data        │      │  - Profile photos      │           │
│  │  - Rides               │      │  - Driver locations    │      │  - Driver documents    │           │
│  │  - Payments            │      │  - Rate limiting       │      │  - Ride receipts       │           │
│  │  - Vehicles            │      │  - Cache               │      │  - Vehicle photos      │           │
│  │  - Audit logs          │      │  - Job queues          │      │                        │           │
│  │                        │      │                        │      │                        │           │
│  └────────────────────────┘      └────────────────────────┘      └────────────────────────┘           │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Container Summary

| Container | Technology | Purpose |
|-----------|------------|---------|
| **Rider/Driver PWA** | Vite, TypeScript, Workbox | Progressive Web App for riders and drivers |
| **Admin Web App** | React, TypeScript | Operations and management portal |
| **Rides API** | .NET 9, C# | Ride lifecycle, matching, scheduling |
| **Users API** | .NET 9, C# | Authentication, profiles, driver management |
| **Payments API** | .NET 9, C# | Transactions, PayFast integration, payouts |
| **Communications API** | .NET 9, C# | SMS, email, push notifications |
| **Azure SignalR** | Managed Service | Real-time bidirectional communication |
| **Background Jobs** | Hangfire, .NET 9 | Scheduled and background processing |
| **PostgreSQL** | Azure Flexible Server | Primary relational database |
| **Redis Cache** | Azure Cache for Redis | Caching, sessions, geolocation |
| **Blob Storage** | Azure Storage | File and document storage |
| **Azure Front Door** | Managed Service | Load balancing, WAF, CDN |

---

## Level 3: Component Diagram - Rides API

The component diagram shows the internal structure of a container. Here we detail the Rides API service.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    RIDES API - COMPONENT DIAGRAM                                        │
│                                       [Azure Container App]                                             │
│                                                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                        API LAYER                                                  │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   │  RidesController│  │EstimateController│ │ScheduleController│ │ AdminController │            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   │  POST /rides    │  │  POST /estimate │  │  POST /schedule │  │  GET /admin/*   │            │  │
│  │   │  GET /rides/{id}│  │                 │  │  GET /schedule  │  │                 │            │  │
│  │   │  PUT /rides/*   │  │                 │  │  PUT /schedule  │  │                 │            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘            │  │
│  │            │                    │                    │                    │                      │  │
│  └────────────┼────────────────────┼────────────────────┼────────────────────┼──────────────────────┘  │
│               │                    │                    │                    │                         │
│               ▼                    ▼                    ▼                    ▼                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                      SERVICE LAYER                                                │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │    RideService      │     │   MatchingService   │     │  SchedulingService  │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - CreateRide()     │     │  - FindBestDriver() │     │  - CreateSchedule() │               │  │
│  │   │  - GetRide()        │     │  - ScoreDrivers()   │     │  - GetAvailability()│               │  │
│  │   │  - UpdateStatus()   │     │  - OfferRide()      │     │  - AssignRecurring()│               │  │
│  │   │  - CancelRide()     │     │                     │     │                     │               │  │
│  │   │  - CompleteRide()   │────▶│                     │     │                     │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └──────────┬──────────┘     └──────────┬──────────┘     └──────────┬──────────┘               │  │
│  │              │                           │                           │                          │  │
│  │              │     ┌─────────────────────┼───────────────────────────┘                          │  │
│  │              │     │                     │                                                      │  │
│  │              ▼     ▼                     ▼                                                      │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │   PricingService    │     │   ETAService        │     │  NotificationService│               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - CalculateFare()  │     │  - CalculateETA()   │     │  - NotifyRider()    │               │  │
│  │   │  - ApplySurge()     │     │  - GetRoute()       │     │  - NotifyDriver()   │               │  │
│  │   │  - GetEstimate()    │     │  - GetDistance()    │     │  - SendReminder()   │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └──────────┬──────────┘     └──────────┬──────────┘               │  │
│  │                                          │                           │                          │  │
│  └──────────────────────────────────────────┼───────────────────────────┼──────────────────────────┘  │
│                                             │                           │                             │
│               ┌─────────────────────────────┘                           │                             │
│               │                                                         │                             │
│               ▼                                                         ▼                             │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                    INFRASTRUCTURE LAYER                                           │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │   RideRepository    │     │ DriverLocationRepo  │     │   GoogleMapsClient  │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - PostgreSQL       │     │  - Redis GeoSet     │     │  - Directions API   │               │  │
│  │   │  - Entity Framework │     │  - Real-time locs   │     │  - Distance Matrix  │               │  │
│  │   │                     │     │                     │     │  - Geocoding        │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  SignalRHubContext  │     │   EventPublisher    │     │   CacheService      │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - RideHub          │     │  - Ride events      │     │  - Redis cache      │               │  │
│  │   │  - Real-time push   │     │  - Integration      │     │  - ETA cache        │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Component Summary - Rides API

| Component | Layer | Responsibility |
|-----------|-------|----------------|
| **RidesController** | API | REST endpoints for ride operations |
| **EstimateController** | API | Fare estimation endpoint |
| **ScheduleController** | API | Advance booking and recurring rides |
| **RideService** | Service | Ride lifecycle business logic |
| **MatchingService** | Service | Driver matching algorithm (ADR-026) |
| **SchedulingService** | Service | Scheduling algorithm (ADR-027) |
| **PricingService** | Service | Fare calculation, surge pricing |
| **ETAService** | Service | ETA calculation, routing |
| **NotificationService** | Service | Push notifications for ride events |
| **RideRepository** | Infrastructure | PostgreSQL data access |
| **DriverLocationRepo** | Infrastructure | Redis geolocation queries |
| **GoogleMapsClient** | Infrastructure | External maps API integration |
| **SignalRHubContext** | Infrastructure | Real-time event broadcasting |

---

## Level 3: Component Diagram - Users API

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    USERS API - COMPONENT DIAGRAM                                        │
│                                       [Azure Container App]                                             │
│                                                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                        API LAYER                                                  │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   │  AuthController │  │ UsersController │  │DriversController│  │VehiclesController│           │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   │  POST /auth/*   │  │  GET /users/me  │  │  POST /drivers  │  │  POST /vehicles │            │  │
│  │   │                 │  │  PUT /users/me  │  │  GET /drivers/* │  │  GET /vehicles  │            │  │
│  │   │                 │  │                 │  │  PUT /drivers/* │  │                 │            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘            │  │
│  │            │                    │                    │                    │                      │  │
│  └────────────┼────────────────────┼────────────────────┼────────────────────┼──────────────────────┘  │
│               │                    │                    │                    │                         │
│               ▼                    ▼                    ▼                    ▼                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                      SERVICE LAYER                                                │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │ AuthenticationService│    │    UserService      │     │   DriverService     │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - Login()          │     │  - GetProfile()     │     │  - Apply()          │               │  │
│  │   │  - VerifyOTP()      │     │  - UpdateProfile()  │     │  - Verify()         │               │  │
│  │   │  - RefreshToken()   │     │  - DeleteAccount()  │     │  - UpdateStatus()   │               │  │
│  │   │  - Logout()         │     │                     │     │  - GetEarnings()    │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └──────────┬──────────┘     └──────────┬──────────┘     └──────────┬──────────┘               │  │
│  │              │                           │                           │                          │  │
│  │              │                           │                           │                          │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  VehicleService     │     │ DocumentService     │     │ BackgroundCheckSvc  │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - AddVehicle()     │     │  - UploadDoc()      │     │  - InitiateCheck()  │               │  │
│  │   │  - UpdateVehicle()  │     │  - GetDocuments()   │     │  - GetStatus()      │               │  │
│  │   │  - VerifyVehicle()  │     │  - VerifyDoc()      │     │  - ProcessResult()  │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                    INFRASTRUCTURE LAYER                                           │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │   UserRepository    │     │ DriverRepository    │     │  AzureB2CClient     │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - PostgreSQL       │     │  - PostgreSQL       │     │  - Token validation │               │  │
│  │   │  - User CRUD        │     │  - Driver CRUD      │     │  - OTP flow         │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  BlobStorageClient  │     │   SMSClient         │     │   EventPublisher    │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - Upload docs      │     │  - Africa's Talking │     │  - User events      │               │  │
│  │   │  - Generate SAS     │     │  - OTP delivery     │     │  - Integration      │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Level 4: Code Diagram - Ride Lifecycle

This sequence diagram shows the code-level interaction for creating and completing a ride.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               SEQUENCE DIAGRAM: RIDE LIFECYCLE                                          │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌───────┐
│ Rider │   │  PWA    │   │Front    │   │ Rides   │   │Matching │   │ SignalR │   │  Redis  │   │Driver │
│       │   │  App    │   │Door     │   │  API    │   │ Service │   │  Hub    │   │  Cache  │   │  App  │
└───┬───┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └───┬───┘
    │            │             │             │             │             │             │            │
    │ 1. Request │             │             │             │             │             │            │
    │    Ride    │             │             │             │             │             │            │
    │───────────▶│             │             │             │             │             │            │
    │            │             │             │             │             │             │            │
    │            │ 2. POST     │             │             │             │             │            │
    │            │    /rides   │             │             │             │             │            │
    │            │────────────▶│             │             │             │             │            │
    │            │             │             │             │             │             │            │
    │            │             │ 3. Route    │             │             │             │            │
    │            │             │    request  │             │             │             │            │
    │            │             │────────────▶│             │             │             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │ 4. Find     │             │             │            │
    │            │             │             │    drivers  │             │             │            │
    │            │             │             │────────────▶│             │             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │             │ 5. Get      │             │            │
    │            │             │             │             │    nearby   │             │            │
    │            │             │             │             │    drivers  │             │            │
    │            │             │             │             │─────────────────────────▶│            │
    │            │             │             │             │             │             │            │
    │            │             │             │             │ 6. Driver   │             │            │
    │            │             │             │             │    list     │             │            │
    │            │             │             │             │◀─────────────────────────│            │
    │            │             │             │             │             │             │            │
    │            │             │             │             │ 7. Score &  │             │            │
    │            │             │             │             │    rank     │             │            │
    │            │             │             │             │────┐        │             │            │
    │            │             │             │             │    │        │             │            │
    │            │             │             │             │◀───┘        │             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │ 8. Best     │             │             │            │
    │            │             │             │    driver   │             │             │            │
    │            │             │             │◀────────────│             │             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │ 9. Create   │             │             │            │
    │            │             │             │    ride     │             │             │            │
    │            │             │             │────┐        │             │             │            │
    │            │             │             │    │ Save   │             │             │            │
    │            │             │             │◀───┘ to DB  │             │             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │ 10. Notify  │             │             │            │
    │            │             │             │     driver  │             │             │            │
    │            │             │             │─────────────────────────▶│             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │             │             │ 11. Push    │            │
    │            │             │             │             │             │     ride    │            │
    │            │             │             │             │             │     offer   │            │
    │            │             │             │             │             │────────────────────────▶│
    │            │             │             │             │             │             │            │
    │            │ 12. Ride    │             │             │             │             │            │
    │            │     created │             │             │             │             │            │
    │            │◀────────────│             │             │             │             │            │
    │            │             │             │             │             │             │            │
    │ 13. "Finding             │             │             │             │             │            │
    │     driver"│             │             │             │             │             │            │
    │◀───────────│             │             │             │             │             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │             │             │             │ 14. Driver │
    │            │             │             │             │             │             │     accepts│
    │            │             │             │             │             │◀────────────────────────│
    │            │             │             │             │             │             │            │
    │            │             │             │ 15. Accept  │             │             │            │
    │            │             │             │     ride    │             │             │            │
    │            │             │             │◀────────────────────────│             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │ 16. Update  │             │             │            │
    │            │             │             │     status  │             │             │            │
    │            │             │             │────┐        │             │             │            │
    │            │             │             │    │        │             │             │            │
    │            │             │             │◀───┘        │             │             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │ 17. Notify  │             │             │            │
    │            │             │             │     rider   │             │             │            │
    │            │             │             │─────────────────────────▶│             │            │
    │            │             │             │             │             │             │            │
    │            │ 18. Driver  │             │             │             │             │            │
    │            │     assigned│             │             │             │             │            │
    │◀───────────│◀────────────────────────────────────────────────────│             │            │
    │            │             │             │             │             │             │            │
    │            │             │             │             │             │             │            │
    │  ══════════════════════════ RIDE IN PROGRESS ══════════════════════════════════              │
    │            │             │             │             │             │             │            │
    │            │             │             │             │             │ 19. Driver  │            │
    │            │             │             │             │             │     location│            │
    │            │             │             │             │             │     updates │            │
    │            │             │             │             │             │◀────────────────────────│
    │            │             │             │             │             │             │            │
    │ 20. Real-  │             │             │             │             │             │            │
    │     time   │             │             │             │             │             │            │
    │     tracking             │             │             │             │             │            │
    │◀───────────│◀────────────────────────────────────────────────────│             │            │
    │            │             │             │             │             │             │            │
```

---

## Level 4: Class Diagram - Ride Domain Model

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLASS DIAGRAM: RIDE DOMAIN                                           │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────┐
│              <<Entity>>               │
│                 Ride                  │
├───────────────────────────────────────┤
│ + Id: Guid                            │
│ + RiderId: Guid                       │
│ + DriverId: Guid?                     │
│ + VehicleId: Guid?                    │
│ + Status: RideStatus                  │
│ + Type: RideType                      │
│ + PickupLocation: Location            │
│ + DropoffLocation: Location           │
│ + ScheduledTime: DateTime?            │
│ + RequestedAt: DateTime               │
│ + AcceptedAt: DateTime?               │
│ + StartedAt: DateTime?                │
│ + CompletedAt: DateTime?              │
│ + CancelledAt: DateTime?              │
│ + EstimatedFare: Money                │
│ + FinalFare: Money?                   │
│ + Rating: RideRating?                 │
├───────────────────────────────────────┤
│ + Accept(driver): void                │
│ + Start(): void                       │
│ + Complete(fare): void                │
│ + Cancel(reason): void                │
│ + Rate(rating): void                  │
└───────────────────┬───────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  <<ValueObject>>│     │  <<ValueObject>>│
│    Location     │     │     Money       │
├─────────────────┤     ├─────────────────┤
│ + Latitude      │     │ + Amount: decimal│
│ + Longitude     │     │ + Currency: string│
│ + Address       │     ├─────────────────┤
│ + PlaceId       │     │ + Add(Money)    │
├─────────────────┤     │ + Multiply(rate)│
│ + DistanceTo()  │     └─────────────────┘
└─────────────────┘

┌───────────────────────────────────────┐     ┌───────────────────────────────────────┐
│             <<Enumeration>>           │     │             <<Enumeration>>           │
│              RideStatus               │     │               RideType                │
├───────────────────────────────────────┤     ├───────────────────────────────────────┤
│ Requested                             │     │ Standard                              │
│ DriverAssigned                        │     │ Premium                               │
│ DriverEnRoute                         │     │ SchoolRun                             │
│ DriverArrived                         │     │ Corporate                             │
│ InProgress                            │     │ Scheduled                             │
│ Completed                             │     │ Emergency                             │
│ Cancelled                             │     └───────────────────────────────────────┘
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│              <<Entity>>               │
│                Driver                 │
├───────────────────────────────────────┤
│ + Id: Guid                            │
│ + UserId: Guid                        │
│ + Status: DriverStatus                │
│ + Rating: double                      │
│ + TotalRides: int                     │
│ + AcceptanceRate: double              │
│ + CurrentLocation: Location?          │
│ + Vehicles: List<Vehicle>             │
│ + Availability: DriverAvailability    │
├───────────────────────────────────────┤
│ + GoOnline(): void                    │
│ + GoOffline(): void                   │
│ + UpdateLocation(loc): void           │
│ + AcceptRide(ride): void              │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│            <<Interface>>              │
│           IRideRepository             │
├───────────────────────────────────────┤
│ + GetByIdAsync(id): Task<Ride>        │
│ + GetActiveForRider(id): Task<Ride?>  │
│ + GetActiveForDriver(id): Task<Ride?> │
│ + SaveAsync(ride): Task               │
│ + GetHistoryAsync(id, page): Task<..> │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│            <<Interface>>              │
│         IMatchingService              │
├───────────────────────────────────────┤
│ + FindBestDriver(req): Task<Match>    │
│ + ScoreDrivers(drivers): List<Score>  │
│ + OfferRide(driver, ride): Task<bool> │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│            <<Interface>>              │
│        ISchedulingService             │
├───────────────────────────────────────┤
│ + CreateSchedule(req): Task<Schedule> │
│ + GetAvailability(date): Task<...>    │
│ + AssignRecurring(ride): Task<...>    │
│ + ResolveConflict(c): Task<Resolution>│
└───────────────────────────────────────┘
```

---

## Deployment Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DEPLOYMENT DIAGRAM                                                   │
│                                   South Africa North (Johannesburg)                                     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────────┐
                                    │      Internet       │
                                    └──────────┬──────────┘
                                               │
                                               ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      Azure Front Door (Global)                                        │
│                                                                                                       │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│   │      WAF        │  │  SSL/TLS        │  │  Load Balancer  │  │      CDN        │               │
│   │   (Premium)     │  │  Termination    │  │                 │  │  (Static)       │               │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
│                                                                                                       │
└───────────────────────────────────────────────────┬───────────────────────────────────────────────────┘
                                                    │
                                                    ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Virtual Network (10.0.0.0/16)                                       │
│                                                                                                        │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│   │                          Subnet: snet-aca (10.0.1.0/24)                                          │ │
│   │                                                                                                   │ │
│   │   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │ │
│   │   │                     Azure Container Apps Environment                                     │   │ │
│   │   │                                                                                          │   │ │
│   │   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │ │
│   │   │  │              │  │              │  │              │  │              │               │   │ │
│   │   │  │  rides-api   │  │  users-api   │  │ payments-api │  │  comms-api   │               │   │ │
│   │   │  │              │  │              │  │              │  │              │               │   │ │
│   │   │  │ Replicas:2-10│  │ Replicas:1-5 │  │ Replicas:1-5 │  │ Replicas:1-5 │               │   │ │
│   │   │  │ CPU: 0.5-2   │  │ CPU: 0.5-1   │  │ CPU: 0.5-1   │  │ CPU: 0.5-1   │               │   │ │
│   │   │  │ Mem: 1-4Gi   │  │ Mem: 1-2Gi   │  │ Mem: 1-2Gi   │  │ Mem: 1-2Gi   │               │   │ │
│   │   │  │              │  │              │  │              │  │              │               │   │ │
│   │   │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘               │   │ │
│   │   │                                                                                          │   │ │
│   │   │  ┌──────────────┐                                                                       │   │ │
│   │   │  │              │                                                                       │   │ │
│   │   │  │  jobs-worker │  (Hangfire background worker)                                         │   │ │
│   │   │  │              │                                                                       │   │ │
│   │   │  │ Replicas: 1  │                                                                       │   │ │
│   │   │  │              │                                                                       │   │ │
│   │   │  └──────────────┘                                                                       │   │ │
│   │   │                                                                                          │   │ │
│   │   └──────────────────────────────────────────────────────────────────────────────────────────┘   │ │
│   │                                                                                                   │ │
│   └───────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                        │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│   │                         Subnet: snet-data (10.0.2.0/24)                                          │ │
│   │                                                                                                   │ │
│   │   ┌──────────────────────────┐           ┌──────────────────────────┐                           │ │
│   │   │                          │           │                          │                           │ │
│   │   │  PostgreSQL Flexible     │           │    Azure Cache for       │                           │ │
│   │   │  Server                  │           │    Redis                 │                           │ │
│   │   │                          │           │                          │                           │ │
│   │   │  SKU: Standard_D2ds_v4   │           │  SKU: Premium P1         │                           │ │
│   │   │  Storage: 128 GB         │           │  Capacity: 6 GB          │                           │ │
│   │   │  HA: Zone Redundant      │           │  Clustering: Enabled     │                           │ │
│   │   │  Backup: Geo-redundant   │           │                          │                           │ │
│   │   │                          │           │                          │                           │ │
│   │   │  [Private Endpoint]      │           │  [Private Endpoint]      │                           │ │
│   │   │                          │           │                          │                           │ │
│   │   └──────────────────────────┘           └──────────────────────────┘                           │ │
│   │                                                                                                   │ │
│   └───────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      Shared Azure Services                                              │
│                                                                                                         │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐              │
│   │                  │  │                  │  │                  │  │                  │              │
│   │  Azure SignalR   │  │  Azure Storage   │  │  Azure Key Vault │  │  Azure App       │              │
│   │  Service         │  │  Account         │  │                  │  │  Configuration   │              │
│   │                  │  │                  │  │                  │  │                  │              │
│   │  Units: 1        │  │  Blob containers │  │  Secrets, Keys   │  │  Feature flags   │              │
│   │  (scales to 100) │  │  ZRS redundancy  │  │  Certificates    │  │  Config values   │              │
│   │                  │  │                  │  │                  │  │                  │              │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘              │
│                                                                                                         │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                                    │
│   │                  │  │                  │  │                  │                                    │
│   │  Azure Monitor   │  │  Log Analytics   │  │  Application     │                                    │
│   │                  │  │  Workspace       │  │  Insights        │                                    │
│   │                  │  │                  │  │                  │                                    │
│   │  Alerts, metrics │  │  90-day retention│  │  APM, traces     │                                    │
│   │                  │  │                  │  │                  │                                    │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘                                    │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Level 3: Component Diagram - Payments API

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PAYMENTS API - COMPONENT DIAGRAM                                      │
│                                       [Azure Container App]                                             │
│                                                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                        API LAYER                                                  │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   │PaymentsController│ │MethodsController│  │ WebhookController│ │ PayoutsController│           │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   │  POST /pay      │  │  GET /methods   │  │  POST /webhook  │  │  GET /payouts   │            │  │
│  │   │  GET /history   │  │  POST /methods  │  │  (PayFast ITN)  │  │  POST /payout   │            │  │
│  │   │                 │  │  DELETE /methods│  │                 │  │                 │            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘            │  │
│  │            │                    │                    │                    │                      │  │
│  └────────────┼────────────────────┼────────────────────┼────────────────────┼──────────────────────┘  │
│               │                    │                    │                    │                         │
│               ▼                    ▼                    ▼                    ▼                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                      SERVICE LAYER                                                │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │   PaymentService    │     │ PaymentMethodService│     │   PayoutService     │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - ProcessPayment() │     │  - AddMethod()      │     │  - CalculatePayout()│               │  │
│  │   │  - RefundPayment()  │     │  - RemoveMethod()   │     │  - ProcessPayout()  │               │  │
│  │   │  - GetHistory()     │     │  - SetDefault()     │     │  - GetPayoutHistory()│              │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └──────────┬──────────┘     └──────────┬──────────┘     └──────────┬──────────┘               │  │
│  │              │                           │                           │                          │  │
│  │              │     ┌─────────────────────┼───────────────────────────┘                          │  │
│  │              │     │                     │                                                      │  │
│  │              ▼     ▼                     ▼                                                      │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │   FareCalculator    │     │  CommissionService  │     │  WebhookProcessor   │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - CalculateFare()  │     │  - CalculateComm()  │     │  - ValidateITN()    │               │  │
│  │   │  - ApplySurge()     │     │  - GetDriverShare() │     │  - ProcessITN()     │               │  │
│  │   │  - ApplyDiscount()  │     │                     │     │  - HandleFailure()  │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                    INFRASTRUCTURE LAYER                                           │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  PaymentRepository  │     │   PayFastClient     │     │   BankingClient     │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - PostgreSQL       │     │  - Initiate payment │     │  - Process EFT      │               │  │
│  │   │  - Transaction logs │     │  - Verify ITN       │     │  - Batch payouts    │               │  │
│  │   │                     │     │  - Query status     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │   EventPublisher    │     │   ReceiptGenerator  │     │   AuditLogger       │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - Payment events   │     │  - Generate PDF     │     │  - Log transactions │               │  │
│  │   │  - Payout events    │     │  - Email receipt    │     │  - Compliance audit │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Component Summary - Payments API

| Component | Layer | Responsibility |
|-----------|-------|----------------|
| **PaymentsController** | API | Process payments, get history |
| **MethodsController** | API | Manage payment methods |
| **WebhookController** | API | Handle PayFast ITN callbacks |
| **PayoutsController** | API | Driver payout management |
| **PaymentService** | Service | Payment processing logic |
| **PayoutService** | Service | Weekly driver payouts |
| **FareCalculator** | Service | Fare calculation, surge, discounts |
| **CommissionService** | Service | Platform commission calculation |
| **WebhookProcessor** | Service | ITN validation and processing |
| **PayFastClient** | Infrastructure | PayFast API integration |
| **BankingClient** | Infrastructure | EFT payout processing |
| **ReceiptGenerator** | Infrastructure | PDF receipt generation |

---

## Level 3: Component Diagram - Communications API

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                COMMUNICATIONS API - COMPONENT DIAGRAM                                   │
│                                       [Azure Container App]                                             │
│                                                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                        API LAYER                                                  │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   │  SMSController  │  │ EmailController │  │  PushController │  │NotifyController │            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   │  POST /sms      │  │  POST /email    │  │  POST /push     │  │  POST /notify   │            │  │
│  │   │  (internal)     │  │  (internal)     │  │  POST /register │  │  (multi-channel)│            │  │
│  │   │                 │  │                 │  │                 │  │                 │            │  │
│  │   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘            │  │
│  │            │                    │                    │                    │                      │  │
│  └────────────┼────────────────────┼────────────────────┼────────────────────┼──────────────────────┘  │
│               │                    │                    │                    │                         │
│               ▼                    ▼                    ▼                    ▼                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                      SERVICE LAYER                                                │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │     SMSService      │     │    EmailService     │     │     PushService     │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - SendOTP()        │     │  - SendWelcome()    │     │  - SendPush()       │               │  │
│  │   │  - SendRideAlert()  │     │  - SendReceipt()    │     │  - RegisterDevice() │               │  │
│  │   │  - SendPromo()      │     │  - SendPayout()     │     │  - SendBatch()      │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └──────────┬──────────┘     └──────────┬──────────┘     └──────────┬──────────┘               │  │
│  │              │                           │                           │                          │  │
│  │              └───────────────────────────┼───────────────────────────┘                          │  │
│  │                                          │                                                      │  │
│  │                                          ▼                                                      │  │
│  │                          ┌─────────────────────────────────┐                                    │  │
│  │                          │                                 │                                    │  │
│  │                          │    NotificationOrchestrator     │                                    │  │
│  │                          │                                 │                                    │  │
│  │                          │  - RouteNotification()          │                                    │  │
│  │                          │  - ApplyPreferences()           │                                    │  │
│  │                          │  - HandleFailover()             │                                    │  │
│  │                          │                                 │                                    │  │
│  │                          └─────────────────────────────────┘                                    │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │   TemplateEngine    │     │   RateLimiter       │     │   DeliveryTracker   │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - RenderSMS()      │     │  - CheckLimit()     │     │  - TrackDelivery()  │               │  │
│  │   │  - RenderEmail()    │     │  - RecordSend()     │     │  - HandleBounce()   │               │  │
│  │   │  - RenderPush()     │     │                     │     │  - UpdateStatus()   │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                    INFRASTRUCTURE LAYER                                           │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │ AfricasTalkingClient│     │   SendGridClient    │     │   FirebaseClient    │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   │  - Send SMS         │     │  - Send email       │     │  - Send FCM         │               │  │
│  │   │  - Check balance    │     │  - Dynamic template │     │  - Manage tokens    │               │  │
│  │   │  - Delivery report  │     │  - Track opens      │     │  - Topic subscribe  │               │  │
│  │   │                     │     │                     │     │                     │               │  │
│  │   └─────────────────────┘     └─────────────────────┘     └─────────────────────┘               │  │
│  │                                                                                                   │  │
│  │   ┌─────────────────────┐     ┌─────────────────────┐                                           │  │
│  │   │                     │     │                     │                                           │  │
│  │   │NotificationRepository│    │   PreferenceStore   │                                           │  │
│  │   │                     │     │                     │                                           │  │
│  │   │  - Log sent         │     │  - User prefs       │                                           │  │
│  │   │  - Query history    │     │  - Channel opts     │                                           │  │
│  │   │                     │     │                     │                                           │  │
│  │   └─────────────────────┘     └─────────────────────┘                                           │  │
│  │                                                                                                   │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Level 4: Sequence Diagram - Payment Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SEQUENCE DIAGRAM: PAYMENT FLOW                                          │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Rider │  │  PWA    │  │ Rides   │  │Payments │  │ PayFast │  │  Email  │  │  Driver │
│       │  │  App    │  │  API    │  │   API   │  │         │  │ Service │  │   App   │
└───┬───┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
    │           │            │            │            │            │            │
    │           │            │            │            │            │            │
    │  ════════════════════════════ RIDE COMPLETED ═══════════════════════════  │
    │           │            │            │            │            │            │
    │           │ 1. Ride    │            │            │            │            │
    │           │    complete│            │            │            │            │
    │           │◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
    │ 2. Confirm│            │            │            │            │            │
    │    fare   │            │            │            │            │            │
    │◀──────────│            │            │            │            │            │
    │           │            │            │            │            │            │
    │ 3. Tap    │            │            │            │            │            │
    │    "Pay"  │            │            │            │            │            │
    │──────────▶│            │            │            │            │            │
    │           │            │            │            │            │            │
    │           │ 4. POST    │            │            │            │            │
    │           │ /payments  │            │            │            │            │
    │           │────────────────────────▶│            │            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 5. Create  │            │            │
    │           │            │            │    payment │            │            │
    │           │            │            │    record  │            │            │
    │           │            │            │────┐       │            │            │
    │           │            │            │    │       │            │            │
    │           │            │            │◀───┘       │            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 6. Initiate│            │            │
    │           │            │            │    PayFast │            │            │
    │           │            │            │───────────▶│            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 7. Payment │            │            │
    │           │            │            │    URL     │            │            │
    │           │            │            │◀───────────│            │            │
    │           │            │            │            │            │            │
    │           │ 8. Redirect│            │            │            │            │
    │           │    URL     │            │            │            │            │
    │           │◀────────────────────────│            │            │            │
    │           │            │            │            │            │            │
    │ 9. Redirect            │            │            │            │            │
    │    to PayFast          │            │            │            │            │
    │◀──────────│            │            │            │            │            │
    │           │            │            │            │            │            │
    │ 10. Complete           │            │            │            │            │
    │     payment            │            │            │            │            │
    │─────────────────────────────────────────────────▶│            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 11. ITN    │            │            │
    │           │            │            │     webhook│            │            │
    │           │            │            │◀───────────│            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 12. Verify │            │            │
    │           │            │            │     signature           │            │
    │           │            │            │────┐       │            │            │
    │           │            │            │    │       │            │            │
    │           │            │            │◀───┘       │            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 13. Update │            │            │
    │           │            │            │     status │            │            │
    │           │            │            │     to PAID│            │            │
    │           │            │            │────┐       │            │            │
    │           │            │            │    │       │            │            │
    │           │            │            │◀───┘       │            │            │
    │           │            │            │            │            │            │
    │           │            │ 14. Update │            │            │            │
    │           │            │     ride   │            │            │            │
    │           │            │◀───────────│            │            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 15. Send   │            │            │
    │           │            │            │     receipt│            │            │
    │           │            │            │────────────────────────▶│            │
    │           │            │            │            │            │            │
    │ 16. Email │            │            │            │            │            │
    │    receipt│            │            │            │            │            │
    │◀───────────────────────────────────────────────────────────────│            │
    │           │            │            │            │            │            │
    │           │            │            │ 17. Notify │            │            │
    │           │            │            │     driver │            │            │
    │           │            │            │     earnings            │            │
    │           │            │            │──────────────────────────────────────▶│
    │           │            │            │            │            │            │
    │           │ 18. Payment│            │            │            │            │
    │           │     success│            │            │            │            │
    │◀──────────│◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
```

---

## Level 4: Sequence Diagram - Authentication Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              SEQUENCE DIAGRAM: AUTHENTICATION FLOW                                      │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ User  │  │  PWA    │  │  Users  │  │Azure AD │  │ Africa's│  │  Redis  │  │   DB    │
│       │  │  App    │  │   API   │  │   B2C   │  │ Talking │  │  Cache  │  │         │
└───┬───┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
    │           │            │            │            │            │            │
    │ 1. Enter  │            │            │            │            │            │
    │    phone  │            │            │            │            │            │
    │──────────▶│            │            │            │            │            │
    │           │            │            │            │            │            │
    │           │ 2. POST    │            │            │            │            │
    │           │ /auth/login│            │            │            │            │
    │           │───────────▶│            │            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 3. Check   │            │            │            │
    │           │            │    rate    │            │            │            │
    │           │            │    limit   │            │            │            │
    │           │            │──────────────────────────────────────▶│            │
    │           │            │            │            │            │            │
    │           │            │ 4. Rate OK │            │            │            │
    │           │            │◀──────────────────────────────────────│            │
    │           │            │            │            │            │            │
    │           │            │ 5. Initiate│            │            │            │
    │           │            │    OTP flow│            │            │            │
    │           │            │───────────▶│            │            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 6. Generate│            │            │
    │           │            │            │    OTP     │            │            │
    │           │            │            │────┐       │            │            │
    │           │            │            │    │       │            │            │
    │           │            │            │◀───┘       │            │            │
    │           │            │            │            │            │            │
    │           │            │            │ 7. Send    │            │            │
    │           │            │            │    SMS     │            │            │
    │           │            │            │───────────▶│            │            │
    │           │            │            │            │            │            │
    │           │            │            │            │ 8. Deliver │            │
    │ SMS with  │            │            │            │    SMS     │            │
    │ OTP code  │◀────────────────────────────────────│            │            │
    │           │            │            │            │            │            │
    │           │ 9. Success │            │            │            │            │
    │           │◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
    │ 10. Enter │            │            │            │            │            │
    │     OTP   │            │            │            │            │            │
    │──────────▶│            │            │            │            │            │
    │           │            │            │            │            │            │
    │           │ 11. POST   │            │            │            │            │
    │           │ /auth/verify            │            │            │            │
    │           │───────────▶│            │            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 12. Verify │            │            │            │
    │           │            │     OTP    │            │            │            │
    │           │            │───────────▶│            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 13. OTP    │            │            │            │
    │           │            │     valid  │            │            │            │
    │           │            │◀───────────│            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 14. Issue  │            │            │            │
    │           │            │     tokens │            │            │            │
    │           │            │◀───────────│            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 15. Get/   │            │            │            │
    │           │            │     Create │            │            │            │
    │           │            │     user   │            │            │            │
    │           │            │────────────────────────────────────────────────────▶│
    │           │            │            │            │            │            │
    │           │            │ 16. User   │            │            │            │
    │           │            │     data   │            │            │            │
    │           │            │◀────────────────────────────────────────────────────│
    │           │            │            │            │            │            │
    │           │            │ 17. Store  │            │            │            │
    │           │            │     session│            │            │            │
    │           │            │──────────────────────────────────────▶│            │
    │           │            │            │            │            │            │
    │           │ 18. Tokens │            │            │            │            │
    │           │     + User │            │            │            │            │
    │           │◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
    │ 19. Logged│            │            │            │            │            │
    │     in!   │            │            │            │            │            │
    │◀──────────│            │            │            │            │            │
    │           │            │            │            │            │            │
    │           │            │            │            │            │            │
    │  ══════════════════════ TOKEN REFRESH (15 min) ════════════════════════   │
    │           │            │            │            │            │            │
    │           │ 20. POST   │            │            │            │            │
    │           │ /auth/refresh           │            │            │            │
    │           │───────────▶│            │            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 21. Validate            │            │            │
    │           │            │     refresh│            │            │            │
    │           │            │     token  │            │            │            │
    │           │            │───────────▶│            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 22. New    │            │            │            │
    │           │            │     access │            │            │            │
    │           │            │     token  │            │            │            │
    │           │            │◀───────────│            │            │            │
    │           │            │            │            │            │            │
    │           │ 23. New    │            │            │            │            │
    │           │     token  │            │            │            │            │
    │           │◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
```

---

## Level 4: Sequence Diagram - Driver Onboarding

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             SEQUENCE DIAGRAM: DRIVER ONBOARDING                                         │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│Driver │  │  PWA    │  │  Users  │  │  Blob   │  │ Backgrnd│  │  Email  │  │  Admin  │
│       │  │  App    │  │   API   │  │ Storage │  │  Check  │  │ Service │  │  Portal │
└───┬───┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
    │           │            │            │            │            │            │
    │ 1. Start  │            │            │            │            │            │
    │   driver  │            │            │            │            │            │
    │   signup  │            │            │            │            │            │
    │──────────▶│            │            │            │            │            │
    │           │            │            │            │            │            │
    │           │ 2. POST    │            │            │            │            │
    │           │ /drivers/apply          │            │            │            │
    │           │───────────▶│            │            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 3. Create  │            │            │            │
    │           │            │    driver  │            │            │            │
    │           │            │    record  │            │            │            │
    │           │            │    (pending)            │            │            │
    │           │            │────┐       │            │            │            │
    │           │            │    │       │            │            │            │
    │           │            │◀───┘       │            │            │            │
    │           │            │            │            │            │            │
    │           │ 4. Upload  │            │            │            │            │
    │           │    steps   │            │            │            │            │
    │           │◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
    │ 5. Upload │            │            │            │            │            │
    │    license│            │            │            │            │            │
    │──────────▶│            │            │            │            │            │
    │           │            │            │            │            │            │
    │           │ 6. Get SAS │            │            │            │            │
    │           │    URL     │            │            │            │            │
    │           │───────────▶│            │            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 7. Generate│            │            │            │
    │           │            │    SAS     │            │            │            │
    │           │            │───────────▶│            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 8. Upload  │            │            │            │
    │           │            │    URL     │            │            │            │
    │           │            │◀───────────│            │            │            │
    │           │            │            │            │            │            │
    │           │ 9. Upload  │            │            │            │            │
    │           │    URL     │            │            │            │            │
    │           │◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
    │           │ 10. Upload │            │            │            │            │
    │           │     file   │            │            │            │            │
    │           │─────────────────────────▶│            │            │            │
    │           │            │            │            │            │            │
    │           │ 11. Confirm│            │            │            │            │
    │           │───────────▶│            │            │            │            │
    │           │            │            │            │            │            │
    │  [Repeat steps 5-11 for: ID, PDP, Vehicle Registration, Vehicle Photos]   │
    │           │            │            │            │            │            │
    │           │            │ 12. All    │            │            │            │
    │           │            │     docs   │            │            │            │
    │           │            │     uploaded            │            │            │
    │           │            │────┐       │            │            │            │
    │           │            │    │       │            │            │            │
    │           │            │◀───┘       │            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 13. Initiate            │            │            │
    │           │            │     background          │            │            │
    │           │            │     check  │            │            │            │
    │           │            │───────────────────────▶│            │            │
    │           │            │            │            │            │            │
    │           │            │ 14. Send   │            │            │            │
    │           │            │     application         │            │            │
    │           │            │     received│            │            │            │
    │           │            │───────────────────────────────────────▶│            │
    │           │            │            │            │            │            │
    │ 15. Email │            │            │            │            │            │
    │ "Application           │            │            │            │            │
    │  received"│            │            │            │            │            │
    │◀──────────────────────────────────────────────────────────────│            │
    │           │            │            │            │            │            │
    │           │ 16. Status │            │            │            │            │
    │           │    pending │            │            │            │            │
    │◀──────────│◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
    │           │            │            │            │            │            │
    │  ═══════════════════════════ ADMIN REVIEW ═══════════════════════════════ │
    │           │            │            │            │            │            │
    │           │            │            │            │            │ 17. Review │
    │           │            │            │            │            │     apps   │
    │           │            │            │            │            │◀───────────│
    │           │            │            │            │            │            │
    │           │            │            │            │ 18. Check  │            │
    │           │            │            │            │     result │            │
    │           │            │            │            │────────────────────────▶│
    │           │            │            │            │            │            │
    │           │            │ 19. Verify │            │            │            │
    │           │            │     documents           │            │            │
    │           │            │◀────────────────────────────────────────────────│
    │           │            │            │            │            │            │
    │           │            │ 20. Approve│            │            │            │
    │           │            │     driver │            │            │            │
    │           │            │◀────────────────────────────────────────────────│
    │           │            │            │            │            │            │
    │           │            │ 21. Update │            │            │            │
    │           │            │     status │            │            │            │
    │           │            │     to     │            │            │            │
    │           │            │     VERIFIED            │            │            │
    │           │            │────┐       │            │            │            │
    │           │            │    │       │            │            │            │
    │           │            │◀───┘       │            │            │            │
    │           │            │            │            │            │            │
    │           │            │ 22. Send   │            │            │            │
    │           │            │     welcome│            │            │            │
    │           │            │───────────────────────────────────────▶│            │
    │           │            │            │            │            │            │
    │ 23. Email │            │            │            │            │            │
    │ "Welcome  │            │            │            │            │            │
    │  Driver!" │            │            │            │            │            │
    │◀──────────────────────────────────────────────────────────────│            │
    │           │            │            │            │            │            │
    │           │ 24. Push   │            │            │            │            │
    │           │    "Approved"           │            │            │            │
    │◀──────────│◀───────────│            │            │            │            │
    │           │            │            │            │            │            │
```

---

## Related Documents

- [Architecture Overview](architecture.md) — High-level architecture description
- [ADR-008: Cloud Provider (Azure)](../adr/008-cloud-provider-azure.md)
- [ADR-009: Backend Framework (.NET 9)](../adr/009-backend-framework-dotnet.md)
- [ADR-023: Networking & API Gateway](../adr/023-networking-api-gateway.md)
- [ADR-026: Driver Matching Algorithm](../adr/026-driver-matching-algorithm.md)
- [ADR-027: Driver Scheduling Algorithm](../adr/027-driver-scheduling-algorithm.md)

---

## References

- [C4 Model](https://c4model.com/)
- [C4 Model for Visualising Software Architecture](https://www.infoq.com/articles/C4-architecture-model/)
- [Structurizr](https://structurizr.com/) — C4 tooling
- [PlantUML C4 Extension](https://github.com/plantuml-stdlib/C4-PlantUML)
