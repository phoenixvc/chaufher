# ChaufHER Web — Operational Portal

A browser-based operational platform empowering guardians, operators, administrators, and drivers to ensure safe, reliable, and transparent ride management.

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
- [Design Variants](#design-variants)
- [Project Structure](#project-structure)

### Integration
- [API Integration](#api-integration)
- [Related Repositories](#related-repositories)
- [Infrastructure](#infrastructure)

### Developer Guide
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Development Guidelines](#development-guidelines)
- [Testing & Quality](#testing--quality)
- [Deployment](#deployment)
- [Performance & Optimization](#performance--optimization)
- [Troubleshooting](#troubleshooting)

### Reference
- [Current Status](#current-status)
- [Contributing](#contributing)
- [License](#license)

---

# Business & Product

## Product Overview

ChaufHER Web is the operational command center for the ChaufHER platform, providing real-time oversight, incident management, and administrative controls for safe, reliable ride operations.

### Core Value Proposition

- **Real-Time Oversight**: Live ride tracking, status monitoring, and instant incident alerts
- **Safety Management**: Rapid panic response, escalation workflows, and incident resolution
- **Operational Control**: Driver management, scheduling, dispatch, and route optimization
- **Compliance Ready**: Comprehensive audit logs, exportable reports, and regulatory tracking
- **Role-Based Access**: Tailored views for guardians, operators, administrators, and drivers

### Key Capabilities

| Feature | Capability | User Benefit |
|---------|-----------|--------------|
| **Live Tracking** | Real-time route monitoring, ETA updates | Immediate visibility into all active rides |
| **Admin Dashboard** | Unified view of rides, incidents, metrics | Single pane of glass for operations |
| **Scheduling** | Bulk trip creation, recurring schedules | Efficient resource planning |
| **Driver Management** | Onboarding, verification, permissions | Streamlined workforce administration |
| **Safety Response** | Panic signal handling, escalation paths | Rapid incident resolution |
| **Reporting** | Audit logs, CSV/PDF exports | Compliance and analytics |

---

## Purpose & Value

### Business Problems Solved

1. **Operational Visibility**: Real-time oversight of all rides eliminates blind spots
2. **Incident Response**: Rapid escalation and resolution of safety events
3. **Resource Optimization**: Efficient scheduling and dispatch reduce idle time
4. **Compliance Burden**: Automated audit trails and reporting simplify regulatory requirements
5. **Trust Building**: Transparent operations increase stakeholder confidence

### Technical Challenges Addressed

1. **Real-Time Coordination**: WebSocket-based updates ensure instant synchronization
2. **Role-Based Access**: Granular permissions prevent unauthorized access
3. **Data Integrity**: Comprehensive audit logging tracks all actions
4. **Scalability**: Modular architecture supports growing user base
5. **Accessibility**: WCAG 2.1 AA compliance ensures universal usability

### Example Scenarios

**Scenario 1: Guardian Monitoring**
- Parent arranges ride for child via mobile app
- Opens web portal to track ride in real-time
- Receives instant notification when child arrives safely
- Reviews trip history and driver ratings

**Scenario 2: Incident Escalation**
- Driver triggers panic button during ride
- Operations dashboard immediately alerts on-duty staff
- Operator views live location, contacts driver
- Escalates to emergency services if needed
- Incident logged with full timeline for review

**Scenario 3: Corporate Fleet Management**
- Admin schedules recurring rides for employee shift changes
- Bulk-assigns drivers based on availability and location
- Monitors on-time performance metrics
- Exports monthly compliance reports for audit

---

## Target Audience

### Primary Users

#### Operations Staff
- **Role**: Monitor active rides, respond to incidents, coordinate drivers
- **Needs**: Real-time dashboards, escalation tools, communication channels
- **Pain Points**: Delayed incident notifications, fragmented information

#### Administrators
- **Role**: Manage drivers, configure schedules, generate reports
- **Needs**: User management, bulk operations, compliance reporting
- **Pain Points**: Manual data entry, lack of audit trails

#### Guardians
- **Role**: Arrange and monitor rides for dependents
- **Needs**: Live tracking, safety notifications, trip history
- **Pain Points**: Lack of visibility, delayed updates

#### Drivers
- **Role**: View schedules, accept requests, update status
- **Needs**: Clear assignments, route guidance, earnings tracking
- **Pain Points**: Confusing interfaces, poor communication

### Secondary Users

#### Compliance Officers
- **Role**: Audit operations, generate regulatory reports
- **Needs**: Comprehensive logs, exportable data, incident summaries
- **Tools**: Reporting module, audit trail viewer

#### Support Staff
- **Role**: Assist users, resolve issues, escalate problems
- **Needs**: User lookup, incident history, communication tools
- **Tools**: Support dashboard, chat integration

---

## Expected Outcomes

### Business Impact

**Short-Term (0-6 months):**
- Reduced incident response times (target: <5 minutes)
- Improved on-time performance (target: >95%)
- Increased operational efficiency
- Higher stakeholder satisfaction

**Long-Term (6-24 months):**
- Full compliance and audit readiness
- Recurring business from schools/corporates
- Data-driven service improvements
- Scalable operations supporting growth

### Key Performance Indicators

| Metric | Target | Measurement | Owner |
|--------|--------|-------------|-------|
| **Incident Response Time** | <5 min | Dashboard analytics | Operations Lead |
| **On-Time Pickups** | >95% | Trip completion data | Fleet Manager |
| **Ride Disruptions** | <2% | Incident reports | Operations Lead |
| **User Satisfaction (NPS)** | >70 | In-app surveys | Product Manager |
| **Compliance Coverage** | 100% | Audit log completeness | Compliance Officer |
| **Dashboard Uptime** | >99.5% | Azure Monitor | DevOps Lead |

---

## Multi-Repo Architecture

ChaufHER Web is part of a coordinated multi-repository ecosystem:

```
                    chaufher-workspace (entry point, shared docs)
                            |
        ┌───────────────────┼───────────────────┐
        |                   |                   |
   chaufher-app       chaufher-web         chaufher-api
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
| **chaufher-workspace** | Monorepo coordination, shared docs | Markdown, scripts | All repos |
| **chaufher-web** (this repo) | Operational portal | React/TypeScript | chaufher-api, chaufher-infra |
| **chaufher-app** | PWA client for riders/drivers | Progressive Web App | chaufher-api |
| **chaufher-api** | Backend services, business logic | .NET 9, PostgreSQL | chaufher-infra |
| **chaufher-infra** | Infrastructure as code, CI/CD | Bicep/Terraform | All repos |

---

# Architecture & Design

## Technical Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Build Tool** | Vite | Fast dev server, optimized builds |
| **Styling** | Tailwind CSS | Utility-first styling |
| **State Management** | Redux Toolkit (planned) | Global state |
| **Server State** | React Query / SWR (planned) | API data caching |
| **Testing** | Jest, React Testing Library | Unit/integration tests |
| **E2E Testing** | Playwright/Cypress | End-to-end flows |
| **Accessibility** | Axe-core | WCAG 2.1 AA compliance |

### System Architecture

```
┌─────────────────────────────┐
│      User Browser           │
│   (ChaufHER Web - React)    │
└──────────┬──────────────────┘
           │
    ┌──────▼──────┐
    │ UI Layer    │
    │ State MGMT  │
    │ RBAC Logic  │
    └──────┬──────┘
           │
     [REST/SignalR API]
           │
    ┌──────▼──────────────────┐
    │  ChaufHER Backend API   │
    │ Business Rules & Events │
    └──────┬──────────────────┘
           │
  ┌────────┴─────────────┐
  │ External Services    │
  │ Maps, Notifications  │
  │ Location, Support    │
  └──────────────────────┘
```

### Responsibilities

**Client (Web Portal):**
- UI rendering and user interaction
- Client-side validation and optimistic updates
- Role-based view filtering
- Real-time data synchronization (SignalR)

**Server (chaufher-api):**
- Source of truth for business logic
- Data persistence and consistency
- Incident escalation and routing
- Audit event emission

---

## Design Philosophy

### Design Guardrails

Non-negotiable principles across all features:

1. **Safety Prominence**: Safety-critical information always visually prioritized
2. **Status At-a-Glance**: Every ride status clear within two clicks
3. **Real-Time Updates**: All data updates live or user notified of stale state
4. **Clear Escalation**: "What do I do next?" obvious for any unexpected scenario
5. **Role-Appropriate Views**: Only relevant information shown per user role
6. **Auditability**: All activity generates reliable, exportable logs
7. **Consistency**: Core visuals and flows identical across devices
8. **Accessibility**: WCAG 2.1 AA compliance mandatory

### Core Principles

#### 1. Clarity Over Complexity
- Minimal visual noise, focus on critical data
- Clear information hierarchy
- Obvious call-to-action buttons

#### 2. Speed of Response
- Real-time updates via WebSocket
- Optimistic UI for instant feedback
- Minimal latency for critical actions

#### 3. Role-Based Design
- Tailored dashboards per user type
- Granular permission controls
- Context-aware navigation

#### 4. Audit-First
- Every action logged with timestamp
- Exportable reports for compliance
- Immutable audit trail

---

## Design Variants

ChaufHER Web supports multiple design variants for different organizational contexts. Each variant shares core logic but applies distinct visual theming.

### Available Variants

| Variant | Use Case | Characteristics |
|---------|----------|-----------------|
| **MinimalClarity** (Default) | Corporate/school operations | Clean typography, low visual noise |
| **BoldProfessional** | Enterprise/premium positioning | Strong contrast, authority-focused |
| **VibrantEnergy** | Youth-focused or modern brands | Bright colors, dynamic layout |
| **WarmCommunity** | Community-focused services | Warm palette, approachable tone |

### Switching Variants

Edit `src/index.tsx` to change active variant:

```tsx
// Import desired variant
import Variant from './variants/MinimalClarity';

// Render variant
ReactDOM.render(<Variant />, document.getElementById('root'));
```

### Component Sharing

- **Base Components** (`src/components/`): Pure logic, minimal styling
- **Variant Components** (`src/variants/*/`): Override with variant-specific styling
- **Shared Patterns**: Identical data flows and interactions across variants

### Adding New Variants

1. Create `src/variants/YourVariant/` directory
2. Copy component files from `src/variants/MinimalClarity/`
3. Customize Tailwind classes for your design system
4. Test all flows match base component logic
5. Update variant list when production-ready

---

## Project Structure

```
src/
├── components/           # Shared UI components
│   ├── BookingCard.tsx
│   ├── BottomNav.tsx
│   ├── DriverSpotlight.tsx
│   ├── Hero.tsx
│   └── TrustBadges.tsx
├── variants/             # Design variants
│   ├── BoldProfessional/
│   ├── MinimalClarity/   # DEFAULT
│   ├── VibrantEnergy/
│   └── WarmCommunity/
├── hooks/                # Custom React hooks
├── utils/                # Helper functions
├── types/                # TypeScript interfaces
├── App.tsx               # Main application
├── index.tsx             # Entry point
└── index.css             # Global styles
```

---

# Integration

## API Integration

### Backend Setup

ChaufHER Web connects to [chaufher-api](https://github.com/phoenixvc/chaufher-api). See that repository for:
- Full API schema and endpoints
- Authentication setup (OAuth2/Azure AD)
- Local development environment

### API Configuration

Set API base URL in `.env.local`:

```bash
# Development
VITE_API_BASE_URL=http://localhost:3000/api

# Staging
VITE_API_BASE_URL=https://api-staging.chaufher.azure.com/api

# Production
VITE_API_BASE_URL=https://api.chaufher.azure.com/api
```

### Authentication

Configured automatically via Azure AD:

```
Authorization: Bearer {access_token}
X-Tenant-ID: {tenant_id}
```

### API Documentation

OpenAPI/Swagger specs available at:
- **Dev**: `http://localhost:3000/api/docs`
- **Staging**: `https://api-staging.chaufher.azure.com/api/docs`
- **Production**: `https://api.chaufher.azure.com/api/docs`

---

## Related Repositories

| Repository | Purpose | Link |
|------------|---------|------|
| **chaufher-workspace** | Monorepo entry point, shared docs | [GitHub](https://github.com/phoenixvc/chaufher-workspace) |
| **chaufher-api** | Backend REST APIs, SignalR hubs | [GitHub](https://github.com/phoenixvc/chaufher-api) |
| **chaufher-app** | PWA client for riders/drivers | [GitHub](https://github.com/phoenixvc/chaufher-app) |
| **chaufher-infra** | Azure IaC, CI/CD pipelines | [GitHub](https://github.com/phoenixvc/chaufher-infra) |

---

## Infrastructure

This project uses centralized infrastructure managed in **[chaufher-infra](https://github.com/phoenixvc/chaufher-infra)**.

For frontend integration guidance, environment variables, and deployment checklists, see:
**[chaufher-infra/MOBILE_CHECKLIST.md](https://github.com/phoenixvc/chaufher-infra/blob/main/MOBILE_CHECKLIST.md)**

---

# Developer Guide

## Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime |
| **npm/pnpm** | Latest | Package manager |
| **Git** | Latest | Version control |

### Installation

### Environment Configuration

Create `.env.local` file in root directory with required configuration values.

### Development

### Build for Production

---

## Development Setup

### Environment Variables

**Required:**

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Azure Configuration
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173/auth/callback

# Feature Flags
VITE_FEATURE_LIVE_TRACKING=true
VITE_FEATURE_PANIC_BUTTON=true
VITE_FEATURE_REPORTING=false

# Monitoring
VITE_APP_INSIGHTS_KEY=your-instrumentation-key

# Environment
VITE_ENV=development
```

**Environment-Specific Configs:**
- **Development** (`.env.local`): Local API, feature flags enabled
- **Staging** (`.env.staging`): Azure staging endpoints, test credentials
- **Production** (`.env.production`): Azure production endpoints, hardened secrets

Load environment files:
```bash
npm run dev -- --mode staging  # Uses .env.staging
```

---

## Development Guidelines

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Component Files** | PascalCase | `BookingCard.tsx`, `DriverSpotlight.tsx` |
| **Utility Files** | camelCase | `useAuth.ts`, `apiClient.ts` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS`, `API_TIMEOUT` |
| **Props Interfaces** | `{Component}Props` | `BookingCardProps` |

### Component Structure

```
ComponentName/
├── index.tsx                  # Default export
├── ComponentName.tsx          # Implementation
├── ComponentName.test.tsx     # Unit tests
├── types.ts                   # TypeScript interfaces
└── constants.ts               # Local constants
```

### State Management

- **Local State**: React `useState` for UI-only state
- **Shared State**: Redux Toolkit (planned)
- **Server State**: React Query / SWR for API data
- **Auth State**: Azure AD + context provider

### Styling Guidelines

- **Framework**: Tailwind CSS
- **Design Tokens**: Defined in `tailwind.config.js`
- **Variant Overrides**: Place in `src/variants/{Variant}/index.css`
- **Avoid**: Inline styles or CSS-in-JS

### Git Workflow

**Branching:**
- `main` — Production-ready
- `feature/your-feature` — Feature branches
- `fix/issue-description` — Bugfix branches

**Commit Conventions:**

```
<type>(<scope>): <subject>
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`

**Examples:**
- `feat(booking-card): add panic button with escalation flow`
- `fix(auth): resolve Azure AD token refresh issue`
- `docs(readme): update environment setup instructions`

---

## Testing & Quality

### Test Strategy

| Test Type | Framework | Purpose | Coverage Target |
|-----------|-----------|---------|-----------------|
| **Unit** | Jest | Component logic | 80%+ |
| **Integration** | React Testing Library | Component behavior | 70%+ |
| **E2E** | Playwright/Cypress | User flows | Key paths |
| **Accessibility** | Axe-core | WCAG compliance | 100% |

### Running Tests

**Unit & Component Tests:**

**End-to-End Tests:**

**Accessibility Checks:**

### Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingCard } from './BookingCard';

describe('BookingCard', () => {
  it('renders booking details', () => {
    render(<BookingCard ride={{ id: '123', status: 'active' }} />);
    expect(screen.getByText(/Active Ride/)).toBeInTheDocument();
  });

  it('handles escalation click', () => {
    const onEscalate = jest.fn();
    render(<BookingCard ride={{}} onEscalate={onEscalate} />);
    fireEvent.click(screen.getByRole('button', { name: /Escalate/ }));
    expect(onEscalate).toHaveBeenCalled();
  });
});
```

---

## Deployment

### Hosting

Deployed on **Microsoft Azure** for enterprise-grade performance and reliability.

#### Azure Resources

- **App Service (Web)**: Hosts React/Vite SPA
- **Azure Storage**: CDN-backed static hosting
- **Application Insights**: Real-time monitoring, error tracking
- **Log Analytics**: Centralized logging
- **Key Vault**: Secure secrets storage
- **Deployment Slots**: Staging and production slots

#### Setup & Configuration

See [chaufher-infra](https://github.com/phoenixvc/chaufher-infra) for:
- Terraform/ARM templates
- Connection strings and managed identities
- Deployment slot configuration
- Certificate management

### CI/CD Pipeline

**Pull Request Workflow:**

```
PR Created
  ↓
  ├─ ESLint & Prettier checks
  ├─ TypeScript compilation
  ├─ Jest unit tests
  ├─ Axe accessibility audit
  └─ Build verification
     ↓
     ✅ Pass → Preview deployment to staging
     ❌ Fail → Block merge
```

**Main Branch Workflow:**

```
Merge to main
  ↓
  ├─ Full test suite
  ├─ Build production artifact
  ├─ Deploy to staging slot
  ├─ Smoke tests & health checks
  └─ Manual approval gate
     ↓
     ✅ Approved → Swap to production
     ❌ Issues → Rollback
```

### Deployment Environments

| Environment | URL | Slot | Data |
|-------------|-----|------|------|
| **Staging** | https://chaufher-web-staging.azurewebsites.net | staging | Synthetic |
| **Production** | https://chaufher.azurewebsites.net | production | Real |

---

## Performance & Optimization

### Build Optimization

### Lighthouse Targets

- **Performance**: ≥85
- **Accessibility**: 95+
- **Best Practices**: ≥90
- **SEO**: ≥90

### Key Optimization Tips

1. **Code Splitting**: Lazy-load variants and heavy components
2. **Image Optimization**: Use WebP with fallbacks
3. **Tree-Shaking**: Ensure Tailwind purges unused styles
4. **React Optimization**: Use `React.memo()`, `useMemo()`, `useCallback()`
5. **Network Performance**: Enable gzip, implement debouncing, cache API responses

### Performance Monitoring

Application Insights tracks:
- Page load time (Core Web Vitals)
- Error rates and details
- User session duration
- Custom events (escalations, exports)

---

## Troubleshooting

### Common Issues

**Port 5173 already in use:**
- Find and kill process or use different port

**npm install fails:**
- Clear cache and reinstall

**TypeScript compilation errors:**
- Ensure strict mode enabled
- Run type check

**ESLint/Prettier conflicts:**
- Format and lint code

**Build fails in CI:**
- Clean and rebuild
- Check environment variables

**API calls fail with 401:**
- Verify Azure credentials
- Check backend is running
- Validate access token

**Variant doesn't display:**
- Clear browser cache
- Check `src/index.tsx` imports
- Verify Tailwind build

### Getting Help

- Check [chaufher-workspace](https://github.com/phoenixvc/chaufher-workspace)
- Review [chaufher-api](https://github.com/phoenixvc/chaufher-api)
- Open issue with error details and steps to reproduce
- **Primary**: jurie@phoenixvc.tech
- **CC**: eben@phoenixvc.tech

---

# Reference

## Current Status

**This is a UI/UX design exploration and demo.** Backend integration and full feature implementation are planned.

### Implementation Roadmap

| Component/Flow | Status | Notes |
|----------------|--------|-------|
| **Design Variants** | ✅ Complete | All 4 variants interactive |
| **Hero/Landing** | ✅ Complete | Responsive across variants |
| **Booking Card** | ✅ Complete | Interactive booking UI |
| **Driver Spotlight** | ✅ Complete | Driver profile display |
| **Trust Badges** | ✅ Complete | Safety indicators |
| **Bottom Navigation** | ✅ Complete | Mobile-optimized nav |
| **Live Ride Tracker** | 🏗️ Planned | Real-time route, ETA |
| **Admin Dashboard** | 🏗️ Planned | Unified rides/incidents |
| **Scheduling UI** | 🏗️ Planned | Bulk trip creation |
| **User Management** | 🏗️ Planned | RBAC, onboarding |
| **Reporting/Export** | 🏗️ Planned | CSV/PDF export |
| **API Integration** | ⏳ Blocked | Awaiting API finalization |
| **Authentication** | ⏳ Blocked | Awaiting Azure AD config |

### What's Working

- Interactive UI components
- Design variant switching
- Responsive design
- Tailwind CSS theming
- Accessibility patterns

### What's Mocked

- API calls (hardcoded data)
- User authentication
- Real-time location updates
- Incident escalation flows
- Reporting functions

---

## Contributing

### Before You Commit

- [ ] Code follows naming conventions
- [ ] All tests pass
- [ ] Linting passes
- [ ] Code formatted
- [ ] No secrets in commit
- [ ] Commit message follows convention
- [ ] Branch up-to-date with `main`

### Pull Request Process

1. Create feature branch
2. Commit with clear messages
3. Open PR with detailed description
4. Ensure all tests pass
5. Await code review approval
6. Squash and merge
7. Delete branch after merge

---

## License

Copyright (c) 2025 ChaufHER. All rights reserved.

[Add License Here — e.g., MIT, Apache 2.0, or proprietary]

---

**ChaufHER Web** delivers a robust, safety-first operational toolset with modern engineering rigor and immutable design guardrails.
