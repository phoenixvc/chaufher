# ChaufHER API — Backend Service

> **.NET 9 Web API** powering the ChaufHER ride-hail platform for women.

---

## Multi-Repo Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ChaufHER Platform                            │
├─────────────────────────────────────────────────────────────────┤
│  chaufher-workspace   │  Docs, ADRs, cross-repo coordination    │
│  chaufher-app         │  PWA client for riders/drivers          │
│  chaufher-api ←       │  .NET 9 backend (this repo)             │
│  chaufher-web         │  Marketing site / admin portal          │
│  chaufher-infra       │  Bicep / Terraform IaC                  │
└─────────────────────────────────────────────────────────────────┘
```

| Repository | Stack | Purpose |
|------------|-------|---------|
| `chaufher-workspace` | Markdown | Product docs, ADRs, design specs |
| `chaufher-app` | Progressive Web App | Rider & driver mobile experience |
| **`chaufher-api`** | **.NET 9 / C#** | **REST API, business logic, data** |
| `chaufher-web` | React | Public website, admin dashboard |
| `chaufher-infra` | Bicep / Terraform | Azure infrastructure as code |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | .NET 9 |
| **Framework** | ASP.NET Core Minimal APIs |
| **Database** | PostgreSQL (via Entity Framework Core) |
| **Caching** | Redis |
| **Authentication** | JWT Bearer tokens |
| **API Documentation** | OpenAPI / Swagger |
| **Messaging** | Azure Service Bus |
| **Notifications** | SMS (Twilio), Email (SendGrid), Push (Firebase) |
| **Payments** | Payment gateway integration (TBD) |
| **Hosting** | Azure App Service / Container Apps |

---

## Project Structure

```
src/
├── ChaufHER.Api/              # API host, endpoints, middleware
│   ├── Endpoints/             # Minimal API endpoint groups
│   ├── Middleware/            # Auth, logging, error handling
│   └── Program.cs             # Application entry point
├── ChaufHER.Application/      # Business logic, CQRS handlers
│   ├── Commands/              # Write operations
│   ├── Queries/               # Read operations
│   └── Services/              # Domain services
├── ChaufHER.Domain/           # Entities, value objects, interfaces
│   ├── Entities/              # Rider, Driver, Ride, etc.
│   ├── Enums/                 # RideStatus, UserRole, etc.
│   └── Interfaces/            # Repository contracts
├── ChaufHER.Infrastructure/   # Data access, external services
│   ├── Persistence/           # EF Core DbContext, migrations
│   ├── Services/              # Notification, payment integrations
│   └── Repositories/          # Repository implementations
tests/
├── ChaufHER.Api.Tests/        # Integration tests
├── ChaufHER.Application.Tests/# Unit tests for handlers
└── ChaufHER.Domain.Tests/     # Domain logic tests
```

---

## Core Domain Entities

### Ride Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────────┐
│ PENDING  │ -> │ ASSIGNED │ -> │ EN_ROUTE │ -> │ PICKED_UP │
└──────────┘    └──────────┘    └──────────┘    └───────────┘
                                                      │
                                                      v
                                               ┌───────────┐
                                               │ COMPLETED │
                                               └───────────┘
```

| Entity | Description |
|--------|-------------|
| **User** | Base user with authentication credentials |
| **Rider** | Women booking rides (extends User) |
| **Driver** | Vetted female drivers (extends User) |
| **Ride** | Scheduled ride with pickup, dropoff, timing |
| **Vehicle** | Driver's registered vehicle |
| **Payment** | Transaction records |
| **Rating** | Post-ride feedback |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/auth/forgot-password` | Initiate password reset |

### Riders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/riders/profile` | Get rider profile |
| PUT | `/api/riders/profile` | Update rider profile |
| GET | `/api/riders/rides` | Get rider's ride history |
| POST | `/api/riders/payment-methods` | Add payment method |

### Rides

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rides` | Schedule a new ride |
| GET | `/api/rides/{id}` | Get ride details |
| PUT | `/api/rides/{id}` | Update ride (before assignment) |
| DELETE | `/api/rides/{id}` | Cancel ride |
| GET | `/api/rides/{id}/status` | Get current ride status |
| POST | `/api/rides/{id}/rate` | Rate completed ride |

### Drivers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/drivers/profile` | Get driver profile |
| PUT | `/api/drivers/profile` | Update driver profile |
| GET | `/api/drivers/rides` | Get assigned rides |
| PUT | `/api/drivers/availability` | Set availability |
| POST | `/api/drivers/rides/{id}/accept` | Accept ride request |
| POST | `/api/drivers/rides/{id}/decline` | Decline ride request |
| POST | `/api/drivers/rides/{id}/start` | Start ride |
| POST | `/api/drivers/rides/{id}/complete` | Complete ride |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/rides` | List all rides (filtered) |
| GET | `/api/admin/drivers` | List all drivers |
| PUT | `/api/admin/drivers/{id}/verify` | Verify driver |
| GET | `/api/admin/disputes` | List disputes |
| PUT | `/api/admin/disputes/{id}` | Resolve dispute |

---

## Authentication & Authorization

### JWT Token Structure

```json
{
  "sub": "user-guid",
  "email": "user@example.com",
  "role": "Rider|Driver|Admin",
  "exp": 1234567890
}
```

### Role-Based Access

| Role | Access |
|------|--------|
| **Rider** | Own profile, schedule/manage rides, payments |
| **Driver** | Own profile, availability, assigned rides |
| **Admin** | All resources, verification, disputes |

---

## Expected Client Behavior

The PWA client should implement the following patterns:

### Ride Status Polling

For MVP (before WebSocket implementation):
```
Poll GET /api/rides/{id}/status every 30 seconds while ride is active
```

### Offline Support

PWA should handle offline scenarios:
- Queue ride requests when offline
- Sync when connection restored
- Display cached ride history
- Show clear offline indicators

### Service Worker Integration

- Cache API responses for offline viewing
- Background sync for queued actions
- Push notification subscription management

### Error Handling

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "errors": {
    "pickupTime": ["Pickup time must be at least 30 minutes in the future"]
  }
}
```

---

## Development Setup

### Prerequisites

- .NET 9 SDK
- PostgreSQL 15+
- Redis (optional, for caching)
- Docker (optional, for containerized development)

### Local Development

```bash
# Clone repository
git clone https://github.com/phoenixvc/chaufher-api.git
cd chaufher-api

# Restore dependencies
dotnet restore

# Update database
dotnet ef database update --project src/ChaufHER.Infrastructure

# Run API
dotnet run --project src/ChaufHER.Api

# Run tests
dotnet test
```

### Environment Variables

```env
# Database
ConnectionStrings__DefaultConnection=Host=localhost;Database=chaufher;Username=postgres;Password=secret

# JWT
Jwt__Secret=your-256-bit-secret-key
Jwt__Issuer=chaufher-api
Jwt__Audience=chaufher-app
Jwt__ExpiryMinutes=60

# External Services
Twilio__AccountSid=your-account-sid
Twilio__AuthToken=your-auth-token
SendGrid__ApiKey=your-api-key
```

### Docker Development

```bash
# Start dependencies
docker-compose up -d postgres redis

# Run API
dotnet run --project src/ChaufHER.Api
```

---

## Testing

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test project
dotnet test tests/ChaufHER.Application.Tests
```

### Test Categories

| Category | Focus |
|----------|-------|
| **Unit** | Domain logic, handlers |
| **Integration** | API endpoints, database |
| **E2E** | Full user journeys |

---

## Deployment

### Azure Deployment

```bash
# Build container
docker build -t chaufher-api .

# Push to ACR
az acr login --name chaufheracr
docker tag chaufher-api chaufheracr.azurecr.io/chaufher-api:latest
docker push chaufheracr.azurecr.io/chaufher-api:latest
```

### Health Checks

| Endpoint | Purpose |
|----------|---------|
| `/health` | Basic liveness check |
| `/health/ready` | Readiness (DB, Redis) |

---

## Related Documents

- [ADR-001: Client Technology Selection](../../adr/001-client-technology-flutter-vs-pwa.md)
- [Product Requirements Document](../PRD.md)
- [Design Guardrails](../design_guardrails.md)
- [PWA App Technical Design](../app/README.md)

---

## Support

For API questions or issues:
- **Primary**: jurie@phoenixvc.tech
- **CC**: eben@phoenixvc.tech
