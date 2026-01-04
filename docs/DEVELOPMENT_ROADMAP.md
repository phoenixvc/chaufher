# ChaufHER Development Roadmap

**Version:** 2.0  
**Last Updated:** 2026-01-04  
**Owner:** Engineering Team  
**Target MVP Launch:** 8-10 weeks from start  
**⚠️ IMPORTANT:** Updated with critical business rules from stakeholder feedback. See `docs/PRD_ALIGNMENT_ISSUES.md` for details.

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 0: Foundation & Fixes](#phase-0-foundation--fixes-week-0)
3. [Sprint 1: Authentication & Core Booking](#sprint-1-authentication--core-booking-weeks-1-2)
4. [Sprint 2: Driver Features & Admin](#sprint-2-driver-features--admin-weeks-3-4)
5. [Sprint 3: Payments & Notifications](#sprint-3-payments--notifications-weeks-5-6)
6. [Sprint 4: Polish & Testing](#sprint-4-polish--testing-weeks-7-8)
7. [Sprint 5: Production Launch](#sprint-5-production-launch-weeks-9-10)
8. [Post-MVP: Phase 2 Features](#post-mvp-phase-2-features)

---

## Overview

### ⚠️ CRITICAL Business Rules (Updated 2026-01-04)

Based on stakeholder feedback from Stacey Wright and Greg Wakelin, these requirements have changed:

1. **🔴 90-Minute Minimum Booking** - Riders must book at least 90 minutes in advance
2. **🔴 SMS-First Driver Matching** - Drivers don't keep app open due to data costs. SMS is PRIMARY notification channel.
3. **🔴 Driver Payout Display Only** - Drivers see ONLY their payout, NOT rider fare
4. **🔴 Payment on Driver Acceptance** - Payment authorized at booking, charged when driver accepts (10-minute window)
5. **🔴 Driver Receipt via Platform** - Receipt from "[Driver Name] via ChaufHER" not "ChaufHER"
6. **24-Hour Clock Format** - Default to 24hr to prevent AM/PM confusion
7. **Fare Estimate Before Payment** - Users see fare before adding payment details

See [PRD.md Critical Business Rules](PRD.md#critical-business-rules-updated-2026-01-04) for full details.

### MVP Scope (Must-Have)

Per [PRD.md](PRD.md), the MVP focuses on **scheduled rides only** with these core features:

**Rider:**
- Schedule rides in advance
- View driver profiles and ratings
- Receive ride status notifications
- Pay securely with saved cards

**Driver:**
- Set availability schedule
- Accept/decline scheduled rides
- View ride details and navigation
- Track earnings and payouts

**Admin:**
- View all rides (upcoming, ongoing, completed)
- Onboard and verify drivers
- Handle exceptions and disputes

**Out of Scope for MVP:**
- On-demand (immediate) rides
- Live map tracking (status notifications only)
- In-app chat
- Recurring rides
- Organization accounts
- Multilingual support

### Success Criteria

| Metric | Target |
|--------|--------|
| Completed Rides (Month 3) | 1,000+ |
| Active Drivers (Q1) | 100+ |
| CSAT Score | ≥4.8/5 |
| Platform Uptime | 99.5% |
| Break-even | Month 6 |

---

## Phase 0: Foundation & Fixes (Week 0)

**Duration:** 3-5 days  
**Goal:** Fix critical technical debt and set up local development

### Tasks

#### 1. Database Provider Fix 🔴 CRITICAL

**Issue:** API configured for SQL Server, but architecture specifies PostgreSQL.

```powershell
# Update package
cd apps/api
dotnet remove src/ChaufHER.API package Microsoft.EntityFrameworkCore.SqlServer
dotnet add src/ChaufHER.API package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.1
```

**Files to change:**
- `apps/api/src/ChaufHER.API/Program.cs` (Line 26)
- `apps/api/src/ChaufHER.API/ChaufHER.API.csproj`

**Code change:**
```csharp
// FROM:
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))

// TO:
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
```

**Acceptance Criteria:**
- [ ] PostgreSQL NuGet package installed
- [ ] DbContext configured for PostgreSQL
- [ ] Connection string updated
- [ ] Database migrations created successfully
- [ ] Health check passes for PostgreSQL

#### 2. Update to .NET 9 🟡

**Issue:** Project targets .NET 8, ADR-009 specifies .NET 9.

```xml
<!-- apps/api/src/ChaufHER.API/ChaufHER.API.csproj -->
<TargetFramework>net9.0</TargetFramework>
```

**Acceptance Criteria:**
- [ ] All .csproj files target net9.0
- [ ] Solution builds successfully
- [ ] All packages compatible with .NET 9

#### 3. Initial Database Migration

```powershell
cd apps/api
dotnet ef migrations add InitialCreate --project src/ChaufHER.API --output-dir Migrations
dotnet ef database update --project src/ChaufHER.API
```

**Acceptance Criteria:**
- [ ] Migration created for all entities (User, Driver, Ride, Vehicle, Payment)
- [ ] Database created locally
- [ ] Seed data added (optional test data)

#### 4. Local Development Verification

```powershell
# Start services
docker compose up -d

# Verify PostgreSQL
docker compose ps
docker compose logs postgres

# Start API
cd apps/api
dotnet run --project src/ChaufHER.API

# Verify health endpoint
curl https://localhost:5001/health

# Start PWA
cd ../../
pnpm dev
```

**Acceptance Criteria:**
- [ ] Docker services running (PostgreSQL, Redis)
- [ ] API starts without errors
- [ ] Swagger UI accessible at https://localhost:5001/swagger
- [ ] PWA loads at http://localhost:3000
- [ ] Admin loads at http://localhost:3001

#### 5. Update Documentation

**Files to update:**
- [ ] README.md - Remove multi-repo references
- [ ] QUICKSTART.md - Verify all commands work
- [ ] MIGRATION_STATUS.md - Mark Phase 0 complete

**Deliverables:**
- PostgreSQL configured and working
- .NET 9 upgrade complete
- Local development environment functional
- Initial database schema created

---

## Sprint 1: Authentication & Core Booking (Weeks 1-2)

**Duration:** 10 business days  
**Goal:** Users can register and riders can book rides

### Epic 1.1: User Authentication

#### Backend: Azure AD B2C Integration

**Tasks:**
1. Set up Azure AD B2C tenant
   - Create tenant: `chaufher.onmicrosoft.com`
   - Configure user flows (sign-up/sign-in)
   - Set up phone/email verification
   - Configure JWT tokens

2. Update API authentication
   ```csharp
   // apps/api/src/ChaufHER.API/Program.cs
   builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
       .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAdB2C"));
   ```

3. Implement User Service
   - Create user on first login
   - Store additional profile data
   - Handle rider/driver role assignment

**API Endpoints:**
- `POST /api/auth/register` - Create user profile
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `POST /api/auth/logout` - Invalidate session

#### Frontend: Authentication Flow

**PWA Pages:**
1. `/login` - Login with phone/email
2. `/register/rider` - Rider registration
3. `/register/driver` - Driver registration (basic)
4. `/profile` - User profile management

**Components:**
- `<AuthProvider>` - Handle auth state with Zustand
- `<LoginForm>` - Phone/email input + OTP
- `<ProtectedRoute>` - Require authentication
- `<UserMenu>` - Profile dropdown

**Acceptance Criteria:**
- [ ] Users can register with phone number
- [ ] OTP verification working
- [ ] JWT tokens stored securely (httpOnly cookies or secure storage)
- [ ] Protected routes redirect to login
- [ ] User profile displays correctly
- [ ] Logout functionality works

### Epic 1.2: Ride Booking Flow (Rider)

#### Backend: Rides API

**Entities Enhanced:**
```csharp
public class Ride
{
    public Guid Id { get; set; }
    public Guid RiderId { get; set; }
    public Guid? DriverId { get; set; }
    public DateTime ScheduledTime { get; set; }  // 🔴 Must be >= 90 minutes from now
    public string PickupAddress { get; set; }
    public Location PickupLocation { get; set; }
    public string DropoffAddress { get; set; }
    public Location DropoffLocation { get; set; }
    public RideStatus Status { get; set; }
    
    // 🔴 CRITICAL: Separate rider fare from driver payout
    public decimal RiderFare { get; set; }          // What rider pays
    public decimal DriverPayout { get; set; }       // What driver gets
    public decimal PlatformCommission { get; set; }  // Difference
    public decimal CommissionRate { get; set; }     // % rate
    
    public string PaymentMethodId { get; set; }     // Saved at booking
    public DateTime? PaymentAuthorizedAt { get; set; }  // When authorized
    public DateTime? PaymentChargedAt { get; set; }     // When charged (driver accepts)
    // ... additional fields
}
```

**API Endpoints:**
- `POST /api/rides/estimate` - Calculate fare
- `POST /api/rides` - Create ride request
- `GET /api/rides/{id}` - Get ride details
- `GET /api/rides` - List user's rides
- `PUT /api/rides/{id}/cancel` - Cancel ride

**Services to Implement:**
1. `FareCalculationService` - Calculate rider fare AND driver payout separately
2. `DriverMatchingService` - 🔴 SMS-based notification (NOT real-time app matching)
3. `RideService` - CRUD operations for rides
4. `BookingValidator` - Enforce 90-minute minimum booking window

#### Frontend: Booking Interface

**PWA Pages:**
1. `/book` - Main booking form
2. `/rides` - Ride history
3. `/rides/{id}` - Ride details & tracking

**Components:**
- `<LocationAutocomplete>` - Google Maps Places API
- `<DateTimePicker>` - Schedule ride date/time (🔴 24-hour format, 90-min minimum)
- `<FareEstimate>` - Display rider fare breakdown (BEFORE requiring payment)
- `<PaymentMethodSelector>` - Choose/add payment method
- `<RideCard>` - Show ride details
- `<RideStatus>` - Current status display

**User Flow (REVISED per PRD v2.0):**
1. Enter pickup address (autocomplete)
2. Enter dropoff address (autocomplete)
3. Select date and time (🔴 minimum 90 minutes from now, 24-hour format)
4. 🔴 View fare estimate BEFORE payment details
5. Add/select payment method (authorized, NOT charged yet)
6. Confirm booking with message: "You'll be charged when a driver accepts"
7. System begins notifying drivers via SMS
8. View "Finding driver..." status screen

**Acceptance Criteria:**
- [ ] Riders can enter pickup/dropoff locations
- [ ] Google Maps autocomplete working
- [ ] 🔴 Date/time picker enforces 90-minute minimum (validation on client + server)
- [ ] 🔴 Time picker uses 24-hour format by default
- [ ] 🔴 Fare estimate shown BEFORE payment method required
- [ ] 🔴 Payment authorized (not charged) at booking
- [ ] 🔴 Clear message: "You'll be charged when driver accepts"
- [ ] Ride request creates in database with correct RiderFare and DriverPayout
- [ ] Confirmation displayed with ride ID
- [ ] Ride appears in ride history with status "Finding Driver"

### Sprint 1 Deliverables

- ✅ User registration and login functional
- ✅ Riders can schedule rides
- ✅ Basic driver matching algorithm
- ✅ Ride history displays

**Testing:**
- Unit tests for services
- Integration tests for API endpoints
- E2E test for complete booking flow

---

## Sprint 2: Driver Features & Admin (Weeks 3-4)

**Duration:** 10 business days  
**Goal:** Drivers can accept rides, admins can manage platform

### Epic 2.1: Driver Portal

#### Backend: Driver Management

**API Endpoints:**
- `POST /api/drivers` - Driver application
- `GET /api/drivers/me` - Current driver profile
- `PUT /api/drivers/me/availability` - Set availability
- `GET /api/drivers/available-rides` - View ride requests
- `PUT /api/rides/{id}/accept` - Accept ride
- `PUT /api/rides/{id}/start` - Start ride
- `PUT /api/rides/{id}/complete` - Complete ride

**Services:**
- `DriverService` - Driver profile management
- `AvailabilityService` - Manage driver schedules
- `RideMatchingService` - 🔴 **SMS-based** driver notification (NOT push-only)
  - Query available drivers based on schedule
  - Send SMS with driver payout amount (NOT rider fare)
  - 10-minute response window
  - Sequential notification (try up to 5 drivers)
  - Fallback to admin alert after 30 minutes

#### Frontend: Driver PWA Pages

**New Routes:**
1. `/driver/dashboard` - Driver home (available rides)
2. `/driver/schedule` - Set availability
3. `/driver/rides` - Accepted/upcoming rides
4. `/driver/earnings` - Earnings summary
5. `/driver/profile` - Driver profile & documents

**Components:**
- `<AvailabilityCalendar>` - Set available times
- `<RideRequest>` - Incoming ride notification
- `<ActiveRide>` - Current ride in progress
- `<EarningsSummary>` - Weekly/monthly totals

**Driver Flow (REVISED per PRD v2.0):**
1. Set availability (days/times)
2. 🔴 Receive SMS: "New ride request - R[DriverPayout] payout. Tap to view."
3. Open app/link from SMS to view full details
4. See pickup, dropoff, time, and 🔴 **DRIVER PAYOUT ONLY** (NOT rider fare)
5. Accept within 10-minute window
6. 🔴 Rider payment charged immediately upon acceptance
7. Navigate to pickup (external maps)
8. Mark ride as started
9. Mark ride as completed
10. View earnings (driver payout amounts)

**Acceptance Criteria:**
- [ ] Drivers can register with basic info
- [ ] Drivers can set availability schedule
- [ ] 🔴 SMS sent to drivers with payout amount when ride matches their availability
- [ ] 🔴 Driver sees ONLY their payout amount, NOT rider fare (in all views)
- [ ] 🔴 10-minute countdown timer shown after notification
- [ ] Drivers can accept/decline rides
- [ ] 🔴 Payment charged to rider immediately when driver accepts
- [ ] If driver doesn't respond in 10 mins, next driver notified
- [ ] If no driver in 30 mins, admin alerted
- [ ] Ride status updates correctly
- [ ] Basic earnings tracking works (shows driver payout only)

### Epic 2.2: Admin Dashboard

#### Backend: Admin API

**API Endpoints:**
- `GET /api/admin/rides` - All rides with filters
- `GET /api/admin/drivers` - All drivers
- `PUT /api/admin/drivers/{id}/approve` - Approve driver
- `PUT /api/admin/drivers/{id}/suspend` - Suspend driver
- `GET /api/admin/stats` - Platform metrics
- `GET /api/admin/alerts` - Exception alerts

#### Frontend: Admin Portal

**Admin Pages:**
1. `/admin/dashboard` - Overview & metrics
2. `/admin/rides` - Ride management table
3. `/admin/drivers` - Driver management
4. `/admin/drivers/{id}` - Driver details
5. `/admin/alerts` - Exception handling

**Components:**
- `<RideTable>` - Filterable ride list (React Table)
- `<DriverTable>` - Driver management table
- `<StatsWidget>` - Metric cards
- `<AlertList>` - Exception notifications
- `<DriverApproval>` - Review driver applications

**Admin Workflows:**
1. View all rides in real-time
2. Filter rides by status/date
3. Review driver applications
4. Approve/reject drivers
5. View driver documents
6. Handle exceptions (no driver, cancellations)
7. View platform metrics

**Acceptance Criteria:**
- [ ] Admin can view all rides
- [ ] Ride table has filters (status, date, rider/driver)
- [ ] Admin can view pending driver applications
- [ ] Admin can approve/reject drivers
- [ ] Platform metrics display correctly
- [ ] Exception alerts visible

### Sprint 2 Deliverables

- ✅ Driver availability management
- ✅ Driver can accept rides
- ✅ Ride status tracking end-to-end
- ✅ Admin ride management
- ✅ Admin driver approval workflow

**Testing:**
- Driver acceptance flow E2E test
- Admin approval workflow test
- Ride lifecycle integration test

---

## Sprint 3: Payments & Notifications (Weeks 5-6)

**Duration:** 10 business days  
**Goal:** Payment processing and multi-channel notifications

### Epic 3.1: Payment Integration

#### Decision Point: Payment Provider

**Options:** Peach / Paystack / Yoco / Ozow (per PRD notes)

**Spike Task (2 days):**
- Evaluate each provider's API
- Test 3DS support
- Check fees and limits
- Verify South African support

**Recommendation:** [TO BE DECIDED]

#### Backend: Payment Service

**Requirements (per PRD v2.0):**
- 🔴 **Authorize** payment at booking (hold funds)
- 🔴 **Charge** payment when driver accepts trip (within 10-minute window)
- 3DS required for charge (not authorization)
- CVV required each transaction (no CVV-less recurring)
- Manual refunds by admin only
- If payment fails after driver acceptance: cancel ride, compensate driver, notify next driver

**API Endpoints:**
- `POST /api/payments/methods` - Add payment method
- `GET /api/payments/methods` - List saved cards
- `DELETE /api/payments/methods/{id}` - Remove card
- `POST /api/payments/{rideId}/authorize` - 🔴 Authorize payment at booking (hold)
- `POST /api/payments/{rideId}/charge` - 🔴 Charge payment when driver accepts
- `POST /api/payments/{rideId}/refund` - Refund (admin only)
- `GET /api/payments/history` - Payment history
- `POST /api/payments/{rideId}/receipt` - 🔴 Generate driver receipt via platform

**Implementation (REVISED per PRD v2.0):**
```csharp
public class PaymentService : IPaymentService
{
    // 🔴 Called at booking - authorize/hold funds
    public async Task<PaymentResult> AuthorizeRidePaymentAsync(Guid rideId)
    {
        // 1. Get ride details (RiderFare amount)
        // 2. Get rider's payment method
        // 3. Authorize payment (hold funds)
        // 4. Store authorization ID
        // 5. Return success/failure
    }
    
    // 🔴 Called when driver accepts - charge the rider
    public async Task<PaymentResult> ChargeRideAsync(Guid rideId)
    {
        // 1. Get ride details + authorization ID
        // 2. Get rider's payment method
        // 3. Initiate 3DS flow
        // 4. Capture authorized payment (charge RiderFare)
        // 5. Update ride status to "Paid"
        // 6. Generate driver receipt via platform
        // 7. Send receipt to rider
        // 8. If fails: cancel ride, compensate driver, notify admin
    }
}
```

#### Frontend: Payment UI

**PWA Pages:**
1. `/payment/add` - Add payment method
2. `/payment/methods` - Manage cards
3. `/payment/confirm` - 3DS confirmation

**Components:**
- `<PaymentMethodForm>` - Add card with validation
- `<CardList>` - Display saved cards
- `<SecurePayment>` - 3DS iframe (triggered when driver accepts)
- `<Receipt>` - 🔴 Driver receipt via ChaufHER template

**Acceptance Criteria:**
- [ ] Riders can add payment methods
- [ ] 🔴 Payment authorized (not charged) at booking
- [ ] 🔴 Payment charged when driver accepts (3DS flow)
- [ ] 🔴 CVV required for every transaction
- [ ] 🔴 If payment fails after driver accepts: ride cancelled, driver compensated, next driver notified
- [ ] 3DS flow completes successfully
- [ ] Ride marked as paid
- [ ] 🔴 Receipt template: "Receipt from [Driver Name] via ChaufHER"
- [ ] 🔴 Receipt shows driver payout amount (what driver earned)
- [ ] Receipt sent to rider via email + in-app
- [ ] Admin can issue manual refunds

### Epic 3.2: Notification System

#### Backend: Notification Service

**Channels:**
- 🔴 **SMS (Africa's Talking)** - PRIMARY channel for driver notifications
- Email (SendGrid) - Receipts and confirmations
- Push (Firebase Cloud Messaging) - Secondary for riders/drivers

**API Implementation:**
```csharp
public interface INotificationService
{
    Task SendSmsAsync(string phoneNumber, string message);
    Task SendEmailAsync(string email, string subject, string body);
    Task SendPushAsync(string userId, string title, string body);
}
```

**Notification Events:**
- Ride confirmed (rider: SMS + email + push)
- 🔴 **New ride request** (driver: **SMS PRIMARY** + push secondary)
- Driver assigned (rider: SMS + push)
- Driver en route (rider: SMS + push)
- Driver arrived (rider: SMS + push)
- Trip started (rider: SMS + push)
- Trip completed (rider: SMS + push)
- Payment processed (rider: email with receipt)
- Payment failed after acceptance (rider + admin: SMS + email urgent)

**API Endpoints:**
- `POST /api/notifications/test` - Test notification
- `PUT /api/users/notification-preferences` - Update preferences

#### Frontend: Push Notifications

**PWA Setup:**
1. Register service worker
2. Request notification permission
3. Subscribe to FCM
4. Handle incoming notifications

**Components:**
- `<NotificationBell>` - In-app notification center
- `<NotificationPreferences>` - User settings
- `<PushPrompt>` - Request permission

**Acceptance Criteria:**
- [ ] 🔴 SMS sent to drivers for new ride requests (PRIMARY channel)
- [ ] SMS sent for ride status updates to riders
- [ ] Email sent for receipts
- [ ] Push notifications work on supported browsers
- [ ] Users can manage notification preferences
- [ ] Notifications display correctly in-app
- [ ] All critical events trigger notifications
- [ ] 🔴 SMS notification includes deep link to open app directly to ride details

### Sprint 3 Deliverables

- ✅ Payment provider integrated
- ✅ Payment flow complete (charge on accept)
- ✅ 3DS authentication working
- ✅ SMS notifications functional
- ✅ Email notifications functional
- ✅ Push notifications (best-effort)

**Testing:**
- Payment flow integration test
- Refund workflow test
- Notification delivery verification
- 3DS authentication E2E test

---

## Sprint 4: Polish & Testing (Weeks 7-8)

**Duration:** 10 business days  
**Goal:** Bug fixes, performance, testing, and refinement

### Epic 4.1: Testing & Quality Assurance

#### Unit Tests

**Coverage Target:** 80% for critical paths

**Backend Tests:**
- Services (Ride, Driver, Payment, Notification)
- Fare calculation logic
- Driver matching algorithm
- Validation logic

**Frontend Tests:**
- Component unit tests (Jest/React Testing Library)
- Form validation
- State management (Zustand stores)
- Utility functions

#### Integration Tests

**API Integration:**
- Ride lifecycle (create → accept → start → complete)
- Payment processing
- Driver matching
- Notification triggers

**Database Integration:**
- Entity relationships
- Query performance
- Transaction handling

#### E2E Tests

**Critical User Journeys:**
1. Rider registration → book ride → pay → complete
2. Driver registration → set availability → accept ride → complete
3. Admin approve driver → view rides → issue refund

**Tools:**
- Playwright or Cypress for E2E
- Test data factories
- Database seeding for tests

**Acceptance Criteria:**
- [ ] 80%+ code coverage on critical services
- [ ] All API endpoints have integration tests
- [ ] 3 critical E2E scenarios pass
- [ ] No P0/P1 bugs remaining

### Epic 4.2: Performance & Security

#### Performance Optimizations

**Frontend:**
- Image optimization
- Code splitting (Next.js automatic)
- API response caching (React Query)
- Lazy loading components

**Backend:**
- Database query optimization
- Redis caching (driver locations, fare estimates)
- Response compression
- Connection pooling

**Targets:**
- API p95 latency < 200ms
- PWA page load < 3s
- Admin dashboard < 5s

#### Security Audit

**Checklist:**
- [ ] SQL injection prevention (EF Core parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF protection (SameSite cookies)
- [ ] Rate limiting (API throttling)
- [ ] Input validation (all endpoints)
- [ ] Sensitive data encryption (at rest & in transit)
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured

#### Compliance

**GDPR:**
- [ ] Data retention policies defined
- [ ] User data export functionality
- [ ] Account deletion functionality
- [ ] Privacy policy published

**PCI-DSS:**
- [ ] No card data stored (tokenization via provider)
- [ ] Secure payment flow
- [ ] Audit logging

### Epic 4.3: UI/UX Polish

**Design Review:**
- Consistent spacing and typography
- Accessible color contrasts (WCAG AA)
- Mobile-responsive layouts
- Loading states and skeletons
- Error states and messages
- Empty states

**User Feedback:**
- Run usability testing (5-10 users)
- Fix confusing flows
- Improve error messages
- Add helpful tooltips/hints

**Acceptance Criteria:**
- [ ] All pages mobile-responsive
- [ ] Accessibility audit passes (Axe)
- [ ] Loading states for all async operations
- [ ] Error messages user-friendly
- [ ] Design consistent across apps

### Sprint 4 Deliverables

- ✅ Comprehensive test suite
- ✅ Performance optimizations applied
- ✅ Security audit complete
- ✅ UI/UX polished
- ✅ No critical bugs

---

## Sprint 5: Production Launch (Weeks 9-10)

**Duration:** 10 business days  
**Goal:** Deploy to production and launch MVP

### Epic 5.1: Infrastructure Setup

#### Azure Deployment

**Resources to Create:**
1. Azure AD B2C tenant (already done in Sprint 1)
2. Resource groups (dev, staging, prod)
3. PostgreSQL Flexible Server
4. Redis Cache
5. Container Registry
6. Container Apps (API, PWA, Admin)
7. Blob Storage (documents, photos)
8. Key Vault (secrets)
9. Application Insights (monitoring)
10. SignalR Service (future - not MVP)

**Deployment Commands:**
```powershell
# Deploy infrastructure
cd infra
az deployment sub create \
  --location southafricanorth \
  --template-file main.bicep \
  --parameters environment=prod sqlAdminPassword=$SQL_PASSWORD

# Build and push API container
cd ../apps/api
docker build -t chaufher-api:latest .
docker tag chaufher-api:latest chaufherprod.azurecr.io/api:latest
docker push chaufherprod.azurecr.io/api:latest

# Build and deploy PWA (static export)
cd ../pwa
pnpm build
pnpm export
az storage blob upload-batch -d '$web' -s out
```

**Acceptance Criteria:**
- [ ] All Azure resources provisioned
- [ ] Database migrated to production
- [ ] API deployed to Container Apps
- [ ] PWA deployed to Azure Static Web Apps
- [ ] Admin deployed to Azure Static Web Apps
- [ ] SSL certificates configured
- [ ] Custom domains configured
- [ ] Monitoring dashboards created

### Epic 5.2: CI/CD Pipeline

**GitHub Actions Workflows:**

1. **PR Validation** (`.github/workflows/pr.yml`)
   - Lint code
   - Run unit tests
   - Build all apps
   - Check types

2. **Deploy Staging** (`.github/workflows/deploy-staging.yml`)
   - Trigger on merge to `main`
   - Deploy to staging environment
   - Run smoke tests

3. **Deploy Production** (`.github/workflows/deploy-prod.yml`)
   - Trigger on tag `v*`
   - Require manual approval
   - Deploy to production
   - Monitor for errors

**Acceptance Criteria:**
- [ ] PR checks enforce quality
- [ ] Staging deploys automatically on merge
- [ ] Production requires approval
- [ ] Rollback procedure documented
- [ ] Zero-downtime deployments

### Epic 5.3: Launch Preparation

#### Operational Readiness

**Runbooks:**
1. Deploy new version
2. Roll back deployment
3. Database migration
4. Handle payment failures
5. Investigate ride issues
6. Suspend problematic driver
7. Scale resources

**Monitoring & Alerts:**
- API error rate > 1%
- Response time > 500ms
- Payment failure rate > 5%
- Database connections > 80%
- Disk space < 20%

**Support Setup:**
- Support email configured
- WhatsApp support number
- Admin alert notifications
- On-call rotation (if applicable)

#### Pre-Launch Checklist

**Technical:**
- [ ] All services healthy in production
- [ ] Database backup configured
- [ ] Secrets rotated to production values
- [ ] Rate limiting configured
- [ ] DDoS protection enabled
- [ ] Monitoring dashboards configured
- [ ] Alerts tested and working

**Business:**
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Pricing confirmed
- [ ] Driver onboarding process ready
- [ ] Support channels ready
- [ ] Marketing materials prepared

**Legal/Compliance:**
- [ ] Business registration complete
- [ ] Insurance obtained
- [ ] Driver background check process established
- [ ] GDPR compliance verified
- [ ] Payment provider agreements signed

### Epic 5.4: Soft Launch

**Week 1: Internal Testing**
- Team uses platform for real rides
- Fix any critical bugs
- Monitor performance

**Week 2: Closed Beta**
- Invite 10-20 trusted users
- Onboard 5-10 drivers
- Process 20-50 rides
- Gather feedback

**Week 3: Public Launch**
- Open registration
- Marketing push
- Monitor closely
- Daily retrospectives

**Success Metrics (First Month):**
- 50+ completed rides
- 10+ active drivers
- 0 critical bugs
- 99.5% uptime
- 4.5+ CSAT

### Sprint 5 Deliverables

- ✅ Production infrastructure live
- ✅ CI/CD pipeline functional
- ✅ Monitoring & alerts configured
- ✅ Soft launch successful
- ✅ MVP launched to public

---

## Post-MVP: Phase 2 Features

**Timeline:** Months 2-6 (after MVP launch)

### Phase 2.1: Advanced Rider Features (Month 2-3)

**Features:**
- Recurring rides (school runs, work commutes)
- Saved favorite locations
- Ride history export
- In-app chat with driver
- Live map tracking
- Ride sharing (multiple passengers)

### Phase 2.2: Driver Experience (Month 3-4)

**Features:**
- Performance analytics dashboard
- Instant payout option
- Driver ratings & reviews
- Preferred riders
- Heat maps (high-demand areas)
- Shift planning tools

### Phase 2.3: Organization Accounts (Month 4-5)

**Features:**
- School accounts
- Corporate accounts
- Bulk ride management
- Consolidated billing
- Multi-rider coordination
- Reporting for coordinators

### Phase 2.4: Platform Enhancements (Month 5-6)

**Features:**
- Multilingual support (Afrikaans, Zulu, Xhosa)
- Advanced driver matching (preferences, ratings)
- Dynamic pricing (surge pricing)
- Loyalty/rewards program
- Referral system
- Advanced analytics for admins

### Phase 2.5: Mobile Apps (Month 6+)

**Native Mobile:**
- iOS app (Swift/SwiftUI)
- Android app (Kotlin/Jetpack Compose)
- Better offline support
- Enhanced push notifications
- Biometric authentication
- Background location (drivers)

---

## Risk Management

### High-Priority Risks

| Risk | Mitigation | Owner |
|------|------------|-------|
| Azure AD B2C complexity delays Sprint 1 | Allocate 2 full days for setup; have fallback to simple JWT | Backend Lead |
| Payment provider integration issues | Start spike task in Week 4; have backup provider | Backend Lead |
| Driver matching algorithm performance | Start with simple algorithm; optimize in Phase 2 | Backend Lead |
| PWA limitations on iOS | Accept per ADR-001; native app in Phase 2 | Product Owner |
| Low driver signup rate | Marketing campaign; referral bonuses | Business Team |

### Contingency Plans

**If Behind Schedule:**
1. Cut nice-to-have features (push to Phase 2)
2. Reduce test coverage target (70% instead of 80%)
3. Launch with manual admin processes (automate later)

**If Critical Bug in Production:**
1. Rollback to previous version (zero-downtime)
2. Fix in hotfix branch
3. Deploy fix within 2 hours
4. Post-mortem within 24 hours

---

## Success Metrics & KPIs

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Uptime | 99.5% | Azure Monitor |
| API p95 Latency | < 200ms | Application Insights |
| PWA Load Time | < 3s | Lighthouse |
| Error Rate | < 0.1% | Sentry |
| Test Coverage | > 80% | Code coverage tools |

### Business Metrics

| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Completed Rides | 50 | 300 | 1,000 |
| Active Drivers | 5 | 25 | 100 |
| Active Riders | 20 | 100 | 500 |
| CSAT Score | 4.5+ | 4.7+ | 4.8+ |
| Revenue | Baseline | Growing | Break-even path |

---

## Dependencies & Blockers

### External Dependencies

1. **Azure Resources:**
   - Azure subscription with sufficient quota
   - Budget approval ($200-500/month MVP)

2. **Third-Party Services:**
   - Azure AD B2C tenant
   - Payment provider account
   - Africa's Talking API key
   - SendGrid account
   - Google Maps API key
   - Firebase project

3. **Business Requirements:**
   - Driver vetting process defined
   - Insurance coverage obtained
   - Legal entity established
   - Terms of Service drafted

### Internal Dependencies

1. **Design Assets:**
   - Logo and branding
   - Driver onboarding documents
   - Marketing materials

2. **Content:**
   - Terms of Service
   - Privacy Policy
   - Safety guidelines
   - FAQ content

---

## Team Capacity & Roles

### Recommended Team

| Role | Capacity | Responsibilities |
|------|----------|------------------|
| **Full-Stack Engineer** | 100% | API + PWA development |
| **Product Owner** | 50% | Requirements, prioritization, UAT |
| **QA Engineer** | 50% | Testing, bug tracking |
| **DevOps Engineer** | 25% | Infrastructure, CI/CD |
| **Designer** | 25% | UI/UX refinements |

**Total Effort:** ~2.5 FTE for 10 weeks

### Sprint Capacity

- **2-week sprints**
- **10 business days per sprint**
- **Velocity:** 40-50 story points per sprint (estimated)

---

## Next Actions

### This Week (Week 0)

1. ✅ Fix PostgreSQL configuration
2. ✅ Upgrade to .NET 9
3. ✅ Create initial database migration
4. ✅ Verify local development setup
5. ✅ Team kickoff meeting

### Next Week (Sprint 1 Start)

1. Set up Azure AD B2C tenant
2. Begin user authentication implementation
3. Start ride booking form (PWA)
4. Set up testing frameworks

**Let's build something amazing! 🚀**
