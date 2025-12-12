# ChaufHER App — Technical Design (PWA)

A women-only ridesharing Progressive Web App prioritizing safety, privacy, and reliability for riders and drivers.

> **Technology Decision**: See [ADR-001](../../adr/001-client-technology-flutter-vs-pwa.md) for the weighted evaluation that selected PWA over Flutter, React Native, and native approaches.

---

## Table of Contents

### Business & Product
- [Product Overview](#product-overview)
- [Purpose & Value](#purpose--value)
- [Target Audience](#target-audience)
- [Expected Outcomes](#expected-outcomes)
- [Multi-Repo Architecture](#multi-repo-architecture)

### Architecture & Design
- [Technical Architecture](#technical-architecture)
- [Design Philosophy](#design-philosophy)
- [Core Flows](#core-flows)
- [Domain Model](#domain-model)

### Integration
- [External Interfaces](#external-interfaces)
- [Related Repositories](#related-repositories)
- [Infrastructure](#infrastructure)

### Developer Guide
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Development Guidelines](#development-guidelines)
- [Testing & Quality](#testing--quality)
- [Deployment](#deployment)
- [Security Guidelines](#security-guidelines)
- [Troubleshooting](#troubleshooting)

### Reference
- [User Interface](#user-interface)
- [Contributing](#contributing)
- [License](#license)

---

# Business & Product

## Product Overview

ChaufHER is a women-only ridesharing platform engineered to address critical safety, privacy, and reliability concerns in traditional ridesharing. The Progressive Web App serves as the primary interface for riders and drivers, delivering a trusted transportation experience exclusively for women.

### Why PWA?

| Benefit | Description |
|---------|-------------|
| **Instant Access** | No app store download required; users access via URL |
| **Cross-Platform** | Single codebase serves iOS, Android, and desktop |
| **Instant Updates** | Deploy fixes immediately without app store approval |
| **Lower Friction** | Easy onboarding via link sharing or QR codes |
| **Offline Support** | Service Workers enable offline booking confirmations |
| **Native-Like UX** | Add to Home Screen, push notifications, full-screen mode |

### Core Value Proposition

Change: panic always visible to rider is phase 2+. Always visible to driver, phase 1. Riders recommended to subscribe the SAFER.
- **Safety First**: Always-visible panic button, real-time status updates, instant incident escalation
- **Women-Only Network**: Pre-verified female drivers and riders create a trusted community
- **Privacy Protected**: Minimal data collection with secure, encrypted storage
- **Always Reliable**: Offline support, fallback mechanisms, and robust error handling

### Key Capabilities

NB: support chat, as below, is not a phase 1 requirement. It will be Whatsapp/email as per client PRD.

| Feature | Rider Experience | Driver Experience |
|---------|-----------------|-------------------|
| **Booking** | Schedule rides with transparent pricing | View upcoming requests with route preview |
| **Safety** | Always-visible panic button, status updates | Panic access, incident reporting, support contact |
| **Payments** | Secure card storage, clear fare breakdown | Real-time earnings visibility |
| **Communication** | SMS/push notifications, support chat | Rider contact without exposing personal numbers |
| **History** | Trip receipts, ratings, re-booking | Performance metrics, earnings history |

---

## Purpose & Value

### Business Problems Solved

1. **Safety Concerns**: Reduces harassment and security incidents through women-only network
2. **Market Gap**: Serves underserved female demographic seeking trusted transportation
3. **Trust Deficit**: Builds confidence through verification, ratings, and safety features
4. **Economic Opportunity**: Provides flexible income for female drivers in safe environment
5. **Distribution Friction**: PWA eliminates app store barriers for rapid user acquisition

### Technical Challenges Addressed

1. **Real-Time Coordination**: WebSocket updates between riders, drivers, and operations
2. **Offline Resilience**: Service Workers cache critical data and queue actions
3. **Cross-Platform Consistency**: Single codebase for all devices and browsers
4. **Rapid Iteration**: Deploy updates instantly without app store delays
5. **Low-End Device Support**: Optimized for older smartphones and limited connectivity

### Example Scenarios

**Scenario 1: Late-Night Commute**
- Female professional opens ChaufHER via saved home screen icon
- Schedules ride for 11 PM after work
- Sees driver profile, photo, rating, and vehicle details
- Shares live trip status link with emergency contacts
- Receives push notification when driver arrives

**Scenario 2: Safety Incident**
- Rider feels uncomfortable during trip
- Taps panic button (always visible, one-tap access)
- App immediately sends alert to operations with location
- SMS fallback triggers if network unavailable
- Support contacts rider, dispatches help if needed

**Scenario 3: First-Time User**
- Receives WhatsApp referral link from friend
- Opens link → PWA loads instantly in browser
- Prompted to "Add to Home Screen" for app-like experience
- Completes registration in 3 steps
- Schedules first ride within 5 minutes

---

## Target Audience

### Primary Users

#### Riders
- **Demographics**: Women aged 18-60+, urban/suburban areas
- **Personas**: Students, professionals, mothers, elderly
- **Needs**: Safe, reliable transportation; transparent pricing; easy booking
- **Pain Points**: Safety concerns, harassment, lack of trust in traditional services

#### Drivers
- **Demographics**: Female drivers seeking flexible income
- **Personas**: Part-time workers, students, caregivers, retirees
- **Needs**: Safe work environment, fair compensation, flexible schedule
- **Pain Points**: Safety risks, unpredictable earnings, lack of support

### Secondary Users

#### Operations/Support
- **Role**: Monitor safety events, handle escalations, manage compliance
- **Needs**: Real-time dashboards, incident management tools, communication channels
- **Tools**: Admin portal (chaufher-web), incident tracking, user management

> **Full Personas**: See [User Personas](../user_personas.md) and [Customer Journey Map](../customer_journey_map.md)

---

## Expected Outcomes

### Business Impact

**Short-Term (0-6 months):**
- Rapid user acquisition via link sharing (no app store friction)
- Strong word-of-mouth adoption within target communities
- Reduced incident rates compared to traditional ridesharing
- High user satisfaction and retention

**Long-Term (6-24 months):**
- Category leadership in women-focused transportation
- Geographic expansion to new markets
- Data-driven service improvements
- Brand recognition and trust

### Key Performance Indicators

Change/remove, reduce weekly active to 500+ / 5000+

| Metric | Short-Term Target | Long-Term Goal | Measurement |
|--------|-------------------|----------------|-------------|
| **Weekly Active Users** | 2,000+ | 25,000+ | Analytics |
| **PWA Install Rate** | >30% | >50% | Add to Home Screen events |
| **Ride Completion Rate** | >95% | >98% | Trip status tracking |
| **Safety Incidents** | <0.1% of trips | <0.05% of trips | Incident reports |
| **Page Load Time** | <2s | <1s | Lighthouse/RUM |
| **Offline Capability** | Core flows | Full app | Service Worker coverage |

---

## Multi-Repo Architecture

ChaufHER is a coordinated multi-repository ecosystem:

```
                    chaufher-workspace (entry point, shared docs)
                            |
        ┌───────────────────┼───────────────────┐
        |                   |                   |
   chaufher-app        chaufher-web        chaufher-api
   (PWA client)       (React admin)       (.NET backend)
        |                   |                   |
        └───────────────────┼───────────────────┘
                            |
                     chaufher-infra
                  (Azure IaC, CI/CD)
```

### Repository Responsibilities

| Repository | Purpose | Technology | Integration Points |
|------------|---------|------------|-------------------|
| **chaufher-workspace** | Coordination, shared docs | Markdown, YAML | All repos |
| **chaufher-app** (this repo) | PWA client for riders/drivers | React, TypeScript, Vite | chaufher-api |
| **chaufher-web** | Admin portal for operations | React, TypeScript | chaufher-api |
| **chaufher-api** | Backend services, business logic | .NET 9, PostgreSQL | chaufher-infra |
| **chaufher-infra** | Infrastructure as code, CI/CD | Bicep/Terraform | All repos |

---

# Architecture & Design

## Technical Architecture

ChaufHER PWA uses a modern, component-based architecture optimized for performance, offline capability, and maintainability.

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | React 18+ | Component-based UI |
| **Language** | TypeScript | Type safety, developer experience |
| **Build Tool** | Vite | Fast builds, HMR, optimized bundles |
| **State Management** | Zustand / React Query | Client state + server state |
| **Routing** | React Router | Client-side navigation |
| **Styling** | Tailwind CSS | Utility-first, responsive design |
| **PWA** | Workbox | Service Workers, caching, offline |
| **API Client** | Axios / Fetch | REST communication |
| **Real-Time** | SignalR | WebSocket for live updates |
| **Forms** | React Hook Form + Zod | Validation, type-safe forms |
| **Testing** | Vitest, Playwright | Unit, integration, E2E tests |

### Architectural Principles

**Core Principle**: Domain and infrastructure responsibilities are delegated to chaufher-api. The PWA focuses on orchestration, state management, and user interface. Business rules, persistence, and system-wide invariants are enforced server-side.

**PWA Responsibilities**:
- UI rendering and user interaction
- Client-side state management
- Input validation and form handling
- Offline caching and sync
- Device API integration (Geolocation, Notifications)

**API Responsibilities**:
- Business logic and domain rules
- Data persistence and consistency
- Payment processing and verification
- Safety event escalation and routing
- Analytics and reporting

### Layer Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                                  │
│   (React Components, Pages, Layouts, Navigation)                             │
│  ┌─────────────────┬──────────────────┬─────────────────┬──────────────┐    │
│  │  Rider UI       │  Driver UI       │  Safety UI      │  Auth UI     │    │
│  │  - BookingPage  │  - DashboardPage │  - PanicButton  │  - LoginPage │    │
│  │  - TripMapPage  │  - RequestsPage  │  - StatusBar    │  - Register  │    │
│  │  - HistoryPage  │  - EarningsPage  │  - SupportChat  │  - Profile   │    │
│  └─────────────────┴──────────────────┴─────────────────┴──────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
                                       ↕
┌──────────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER (Hooks + State)                        │
│   (Custom Hooks, React Query, Zustand Stores, Event Handlers)                │
│  ┌─────────────────┬──────────────────┬─────────────────┬──────────────┐    │
│  │ useBooking      │ useTrip          │ useSafety       │ useAuth      │    │
│  │ - validate      │ - acceptRequest  │ - triggerPanic  │ - login      │    │
│  │ - searchDrivers │ - trackLocation  │ - escalate      │ - logout     │    │
│  │ - requestRide   │ - updateStatus   │ - notifications │ - refresh    │    │
│  └─────────────────┴──────────────────┴─────────────────┴──────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
                                       ↕
┌──────────────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER                                       │
│   (API Clients, WebSocket, Service Worker, Storage)                          │
│  ┌─────────────────┬──────────────────┬─────────────────┬──────────────┐    │
│  │ API Client      │ SignalR Hub      │ Service Worker  │ Storage      │    │
│  │ - REST calls    │ - Real-time      │ - Caching       │ - IndexedDB  │    │
│  │ - Auth headers  │ - Reconnection   │ - Offline queue │ - LocalStorage│    │
│  │ - Error handling│ - Event dispatch │ - Background sync│ - Secure     │    │
│  └─────────────────┴──────────────────┴─────────────────┴──────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
                                       ↕
┌──────────────────────────────────────────────────────────────────────────────┐
│                          WEB PLATFORM APIS                                   │
│  ┌─────────────────┬──────────────────┬─────────────────┬──────────────┐    │
│  │ Geolocation API │ Notifications API│ Cache API       │ Fetch API    │    │
│  │ - getCurrentPos │ - requestPerm    │ - addAll        │ - request    │    │
│  │ - watchPosition │ - showNotif      │ - match         │ - response   │    │
│  └─────────────────┴──────────────────┴─────────────────┴──────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
                                       ↕
                        ┌──────────────────────────┐
                        │   chaufher-api (Backend) │
                        │   - Auth Service         │
                        │   - Trip Orchestration   │
                        │   - Safety Escalation    │
                        │   - Payments             │
                        │   - Analytics            │
                        └──────────────────────────┘
```

### Folder Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/     # Login, Register forms
│   │   ├── hooks/          # useAuth, useSession
│   │   ├── services/       # authApi.ts
│   │   └── types/          # User, Session types
│   ├── rider/
│   │   ├── components/     # BookingForm, TripCard
│   │   ├── hooks/          # useBooking, useTrip
│   │   ├── pages/          # BookingPage, HistoryPage
│   │   └── services/       # riderApi.ts
│   ├── driver/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── safety/
│   │   ├── components/     # PanicButton, StatusIndicator
│   │   ├── hooks/          # useSafety, usePanic
│   │   └── services/       # safetyApi.ts
│   └── payments/
├── shared/
│   ├── components/         # Button, Input, Modal, Map
│   ├── hooks/              # useGeolocation, useOnline
│   ├── services/           # apiClient.ts, signalr.ts
│   ├── stores/             # Zustand stores
│   └── utils/              # Helpers, formatters
├── pwa/
│   ├── service-worker.ts   # Workbox configuration
│   ├── manifest.json       # Web App Manifest
│   └── offline.ts          # Offline queue management
├── styles/
│   └── globals.css         # Tailwind imports
├── App.tsx                 # Root component
├── main.tsx                # Entry point
└── vite.config.ts          # Build configuration
```

---

## Design Philosophy

### Core Principles

#### 1. Progressive Enhancement
- **Works Everywhere**: Core functionality works in any modern browser
- **Enhanced Experience**: Additional features for capable browsers/devices
- **Graceful Degradation**: App remains functional when features unavailable
- **Offline-First**: Critical flows work without network connectivity

#### 2. Feature-Based Organization
- **Modular Design**: Each feature is self-contained with clear boundaries
- **Parallel Development**: Teams can work on features independently
- **Code Reuse**: Shared components in `shared/` directory
- **Scalability**: Easy to add new features without refactoring

#### 3. Performance First
- **Code Splitting**: Lazy load routes and heavy components
- **Asset Optimization**: Compressed images, tree-shaken bundles
- **Caching Strategy**: Aggressive caching with smart invalidation
- **Core Web Vitals**: Target LCP <2.5s, FID <100ms, CLS <0.1

#### 4. Safety-First
- **Always Accessible**: Panic button visible during active trips
- **Fast Response**: Minimal latency for safety event triggers
- **Redundancy**: Multiple escalation paths (API, SMS fallback)
- **Privacy**: Location data auto-scrubbed after event resolution

### Design Patterns

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **Custom Hooks** | Reusable logic (useBooking, useSafety) | Composition, testability |
| **React Query** | Server state management | Caching, background updates |
| **Zustand** | Client state management | Simple, performant |
| **Service Worker** | Offline, caching, background sync | Reliability, performance |
| **Adapter Pattern** | API abstraction | Testability, flexibility |

---

## Core Flows

### Ride Booking Flow

```
1. Rider opens PWA (home screen icon or browser)
   ↓
2. Sees scheduled rides dashboard or "Book a Ride" CTA
   ↓
3. Enters pickup/dropoff locations (autocomplete)
   ↓
4. Selects date/time for scheduled ride
   ↓
5. Reviews fare estimate and available time slots
   ↓
6. Confirms booking with saved payment method
   ↓
7. API creates booking, matches driver [NB: PRD specifies WhatsApp broadcast + first accept, but I believe client would prefer app broadcast. If we can fit api match in budget let's give them the option)
   ↓
8. Push notification confirms booking
   ↓
9. Reminder notifications before ride
   ↓
10. Real-time status updates via SignalR
    ↓
11. Trip completes → Receipt and rating
```

### Safety Event Flow

```
User taps panic button
   ↓
Confirmation modal: "Are you safe? Send alert?"
   ↓
User confirms
   ↓
useSafety hook records timestamp + location
   ↓
Rate limit check (prevent duplicate triggers)
   ↓
UI updates: "Safety alert active... notifying support"
   ↓
API call via fetch with retry
   ↓
If offline:
   - Store event in IndexedDB
   - Queue for background sync
   - Trigger SMS fallback (if enabled)
   ↓
API acknowledges → Clear local queue
   ↓
SignalR updates: Real-time escalation status
   ↓
Support team reviews, contacts rider
   ↓
Incident resolved → UI notification
```

### PWA Install Flow

```
User visits ChaufHER URL
   ↓
Service Worker registers, caches shell
   ↓
Browser detects installability criteria:
   - HTTPS
   - Valid manifest.json
   - Service Worker registered
   ↓
Install prompt appears (or manual via menu)
   ↓
User taps "Add to Home Screen"
   ↓
PWA installs with app icon
   ↓
Subsequent opens launch in standalone mode
   ↓
Full-screen, app-like experience
```

---

## Domain Model

### Core Entities

**User (Rider/Driver)**
- ID, role (rider/driver), name, email, phone
- Profile photo, verification status
- Preferences (payment methods, emergency contacts)
- Rating, trip count, join date

**Trip**
- ID, status (pending, confirmed, driver-assigned, in-progress, completed, canceled)
- Rider ID, driver ID
- Pickup/dropoff locations, scheduled time
- Fare, payment method
- Safety flags, incident references

**SafetyEvent**
- ID, trip ID, user ID
- Type (panic, harassment, accident, other)
- Timestamp, location (lat/lon)
- Status (pending, escalated, resolved)
- Escalation level, assigned ops team

### State Machines

**Trip Lifecycle:**
```
PENDING → CONFIRMED → DRIVER_ASSIGNED → IN_PROGRESS → COMPLETED
                                                         ↓
                                                      CANCELED
```

**Safety Event:**
```
TRIGGERED → ACKNOWLEDGED → ESCALATED → RESOLVED
                              ↓
                          DISMISSED (false alarm)
```

---

# Integration

## External Interfaces

### API Communication

**REST API (chaufher-api):**
- Base URL: Environment-specific (dev/staging/prod)
- Authentication: JWT bearer tokens (Azure AD B2C)
- Endpoints: Users, trips, safety events, payments, notifications
- Error Handling: Standardized error responses with correlation IDs

Note, Real-Time is nice to have, not MVP requirement
**SignalR (Real-Time):** 
- Hub: `/hubs/rideevents`
- Events: `trip.updated`, `safety.event.update`, `driver.location.updated`
- Connection: WebSocket with automatic reconnection
- Fallback: Long-polling if WebSocket unavailable

### Web Platform APIs

| API | Purpose | Fallback |
|-----|---------|----------|
| **Geolocation** | GPS tracking, pickup/dropoff | Manual address entry |
| **Notifications** | Push notifications | SMS fallback |
| **Service Worker** | Offline, caching | Online-only mode |
| **Cache API** | Asset caching | Network-only |
| **IndexedDB** | Local data storage | LocalStorage |
| **Share API** | Native sharing | Copy link fallback |

### PWA Capabilities by Platform

| Feature | iOS (16.4+) | Android | Desktop |
|---------|-------------|---------|---------|
| **Push Notifications** | ✅ | ✅ | ✅ |
| **Add to Home Screen** | ✅ | ✅ | ✅ |
| **Offline Mode** | ✅ | ✅ | ✅ |
| **Geolocation** | ✅ | ✅ | ✅ |
| **Camera Access** | ✅ | ✅ | ✅ |
| **Background Sync** | ⚠️ Limited | ✅ | ✅ |

---

## Related Repositories

| Repository | Purpose | Link |
|------------|---------|------|
| **chaufher-workspace** | Coordination, shared docs | [GitHub](https://github.com/phoenixvc/chaufher-workspace) |
| **chaufher-api** | Backend REST APIs, SignalR | [GitHub](https://github.com/phoenixvc/chaufher-api) |
| **chaufher-web** | React admin portal | [GitHub](https://github.com/phoenixvc/chaufher-web) |
| **chaufher-infra** | Azure IaC, CI/CD | [GitHub](https://github.com/phoenixvc/chaufher-infra) |

---

# Developer Guide

## Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **npm/pnpm** | Latest | Package management |
| **Git** | Latest | Version control |

### Get Started in 3 Steps

**1. Clone & Install**
```bash
git clone https://github.com/phoenixvc/chaufher-app.git
cd chaufher-app
npm install
```

**2. Configure Environment**
```bash
cp .env.example .env.local
# Update API_URL, AUTH_DOMAIN, etc.
```

**3. Run Locally**
```bash
npm run dev
# Opens http://localhost:5173
```

### Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run lint` | Lint code |
| `npm run type-check` | TypeScript validation |

---

## Development Setup

### Environment Configuration

**1. Node.js & Dependencies**
```bash
# Install Node.js 18+ (via nvm recommended)
nvm install 18
nvm use 18

# Install dependencies
npm install
```

**2. Environment Variables**

Create `.env.local`:
```env
VITE_API_URL=https://api.dev.chaufher.app
VITE_SIGNALR_URL=https://api.dev.chaufher.app/hubs
VITE_AUTH_DOMAIN=chaufher-dev.b2clogin.com
VITE_AUTH_CLIENT_ID=your-client-id
VITE_MAPS_API_KEY=your-maps-key
```

**3. HTTPS for Local Development**

PWA features require HTTPS:
```bash
npm run dev -- --https
```

**4. Test PWA Features**
```bash
npm run build
npm run preview
# Test Service Worker, offline mode, install prompt
```

### IDE Configuration

**VS Code (Recommended):**

Extensions:
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar) - for .tsx
- Tailwind CSS IntelliSense

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## Development Guidelines

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Features** | kebab-case | `src/features/rider/`, `src/features/safety/` |
| **Components** | PascalCase | `BookingForm.tsx`, `PanicButton.tsx` |
| **Hooks** | camelCase with `use` prefix | `useBooking.ts`, `useSafety.ts` |
| **Services** | camelCase | `riderApi.ts`, `safetyApi.ts` |
| **Types** | PascalCase | `User.ts`, `Trip.ts` |
| **Constants** | UPPER_SNAKE_CASE | `API_TIMEOUT`, `RATE_LIMIT_MS` |
| **Variables** | camelCase | `currentLocation`, `tripStatus` |

### Commit Conventions

Use conventional commits:
```
<type>(<scope>): <subject>
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`

**Examples:**
- `feat(safety): add panic button with offline queue`
- `fix(auth): resolve token refresh race condition`
- `docs(setup): add local HTTPS instructions`

### Code Quality Standards

- **Linting**: ESLint (enforced in CI)
- **Formatting**: Prettier (on save)
- **Type Safety**: Strict TypeScript, no `any`
- **Test Coverage**: 80%+ for critical paths (safety, auth, payments)
- **Bundle Size**: Monitor with `npm run build -- --report`

---

## Testing & Quality

### Test Strategy

| Test Type | Framework | Purpose | Coverage Target |
|-----------|-----------|---------|-----------------|
| **Unit** | Vitest | Hooks, utilities, services | 90%+ |
| **Component** | Vitest + Testing Library | UI components | 80%+ |
| **Integration** | Vitest | Feature flows with mocked API | 70%+ |
| **E2E** | Playwright | Critical user journeys | Key flows |

### Test Coverage Focus

| Area | Priority | Scenarios |
|------|----------|-----------|
| **Safety** | Critical | Panic trigger, offline queue, rate limiting |
| **Authentication** | High | Login, token refresh, session expiry |
| **Booking** | High | Schedule ride, validation, cancellation |
| **Offline** | High | Service Worker caching, background sync |
| **Payments** | High | Add card, validation, transaction flow |

### Running Tests

```bash
# Unit & Component Tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E Tests
npm run test:e2e

# E2E with UI
npm run test:e2e -- --ui
```

---

## Deployment

### Deployment Strategy

PWA deployment is simpler than app stores:

1. **CI Build**: Lint, test, build production bundle
2. **Deploy to CDN**: Upload to Azure Static Web Apps / Cloudflare
3. **Service Worker Update**: New SW registered, prompts user to refresh
4. **Monitoring**: Track errors, performance, PWA metrics

### Deployment Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Dev** | `dev.chaufher.app` | Development testing |
| **Staging** | `staging.chaufher.app` | UAT, pre-production |
| **Production** | `app.chaufher.app` | Live users |

### Service Worker Updates

```typescript
// Prompt user when new version available
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (confirm('New version available. Reload?')) {
      window.location.reload();
    }
  });
}
```

---

## Security Guidelines

### Secrets Management

**Never commit:**
- `.env.local` files with API keys
- Private certificates or keys
- Database credentials
- Hardcoded tokens

**Always:**
- Store secrets in Azure Key Vault
- Use environment variables at build time
- Rotate credentials every 90 days

### Code Security

**Input Validation:**
- Validate all user inputs with Zod schemas
- Sanitize data before API calls
- Use TypeScript for type safety

**Network Security:**
- Always use HTTPS
- Validate API responses
- Implement CORS properly

**Storage Security:**
- Use secure cookies for tokens (HttpOnly, Secure, SameSite)
- Encrypt sensitive data in IndexedDB
- Clear sensitive data on logout

---

## Troubleshooting

### Common Issues

**Service Worker not updating:**
```bash
# Force update in DevTools
Application → Service Workers → Update on reload
```

**Push notifications not working on iOS:**
- Requires iOS 16.4+
- Must be installed to Home Screen
- Notification permission must be granted

**Offline mode issues:**
```bash
# Check Service Worker status
Application → Service Workers
# Verify cached resources
Application → Cache Storage
```

**Build fails with memory error:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Getting Help

- **Documentation**: [chaufher-workspace](https://github.com/phoenixvc/chaufher-workspace)
- **API Issues**: [chaufher-api](https://github.com/phoenixvc/chaufher-api)
- **GitHub Issues**: Open with error details, steps to reproduce
- **Contact**: jurie@phoenixvc.tech

---

# Reference

## User Interface

### Key Flows

- **Onboarding**: Registration, verification, payment setup
- **Rider Dashboard**: Scheduled rides, booking, history
- **Driver Dashboard**: Upcoming rides, earnings, availability
- **Safety Flows**: Panic button, status updates, support contact
- **Payments**: Add methods, review charges, receipts

### Accessibility

- Large touch targets (48x48px minimum)
- High contrast mode support
- Screen reader compatible
- Keyboard navigation
- WCAG 2.1 AA compliance target

### PWA Features

| Feature | Implementation |
|---------|---------------|
| **Installable** | Web App Manifest, install prompt |
| **Offline** | Service Worker, Cache API, IndexedDB |
| **Push Notifications** | Web Push API, Firebase Cloud Messaging |
| **Background Sync** | Workbox Background Sync |
| **Share Target** | Web Share Target API |

---

## Contributing

### Before You Commit

- [ ] Code follows naming conventions
- [ ] All tests pass: `npm run test`
- [ ] Linting passes: `npm run lint`
- [ ] Types check: `npm run type-check`
- [ ] No secrets in commit
- [ ] Commit message follows convention
- [ ] Branch up-to-date with `main`

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Push and open PR with description
4. Address feedback from reviewers
5. Ensure all checks pass
6. Squash and merge on approval
7. Delete branch after merge

---

## License

Copyright (c) 2025 ChaufHER. All rights reserved.

---

## Related Documents

- [ADR-001: Client Technology Selection](../../adr/001-client-technology-flutter-vs-pwa.md)
- [Product Requirements Document](../PRD.md)
- [User Personas](../user_personas.md)
- [Design Guardrails](../design_guardrails.md)
- [Customer Journey Map](../customer_journey_map.md)
