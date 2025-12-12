# ChaufHER – Scheduled Ride-Hail Platform (PWA) – Product Requirements Document

## Executive Summary

ChaufHER is a Progressive Web App ride-hail platform designed for women, providing scheduled rides with vetted female drivers. Key features include advanced scheduling, transparent pricing, and ride status notifications. The platform prioritizes trust, empowerment, and ease of use, addressing the need for a specialist ride-hail service for women who often feel underserved or unsafe using mainstream options.

---

## Goals

### Business Goals

The following are the primary business objectives for ChaufHER's initial launch phase.

* Achieve over 1,000 scheduled rides within the first three months post-launch, as measured by completed bookings in the platform database.
* Onboard at least 100 active drivers (drivers who complete at least one ride) within the first quarter.
* Maintain a customer satisfaction (CSAT) score of 4.8 out of 5 or higher, as measured by post-ride survey responses.
* Reach operational break-even (revenue covers all recurring operational costs) by the end of the sixth month post-launch.
* Ensure 99.5% uptime for the platform, measured on a monthly basis.

### User Product Goals Overview

These objectives represent the core needs and desired outcomes for riders, drivers, and administrators using ChaufHER.

* Riders can schedule reliable rides in advance, providing peace of mind and reducing last-minute stress.
* Experience a women-centric, safety-focused environment both as rider and driver.
* Receive timely status notifications for scheduled rides, such as trip start, trip end, and driver arrival; note that real-time map tracking will be introduced in a future release.
* Pay for rides securely and easily, with support for commonly used credit and debit cards.

### Out of Scope for MVP

These objectives are not part of the MVP scope.

* On-demand, unscheduled ride requests are not supported at launch; the initial focus is exclusively on scheduled rides.
* Expansion to non-women drivers or broader markets at MVP stage.
* Integration with third-party loyalty or reward programs will not be included in the MVP.

---

## User Stories

Full user personas are available in the [user_personas.md](user_personas.md) document. For the complete customer journey across all touchpoints, see the [Customer Journey Map](CUSTOMER_JOURNEY_MAP.md).

### Rider (Primary: women booking for themselves or minors – e.g., Sarah, Nomsa, Aisha)

| Priority | User Story |
|----------|------------|
| **MVP** | As a Rider, I want to schedule a ride in advance, so that I have reliable transportation when I need it. |
| **MVP** | As a Rider, I want to see driver profiles and ratings, so that I can feel confident in my travel arrangements and in who is driving my child. |
| **MVP** | As a Rider, I want to track my ride's status in real time and receive notifications when the trip starts and ends, so that I can prepare effectively and know my child arrived safely. |
| **MVP** | As a Rider, I want to pay securely within the app with saved cards and clear fare breakdowns, so that my payment process is hassle-free and trustworthy. |

### Driver (Female driver earning full-time or side income – Thandi, Zanele)

| Priority | User Story |
|----------|------------|
| **MVP** | As a Driver, I want to set my availability, so that I can choose when to accept rides. |
| **MVP** | As a Driver, I want to accept or decline scheduled rides with full pick-up/drop-off details, so that I maintain control over my schedule and can plan my trips efficiently. |
| **MVP** | As a Driver, I want to see rider pick-up/drop-off details and expected waiting time in advance, so that I can plan routes, fuel, and time effectively. |
| **MVP** | As a Driver, I want to receive prompt, transparent payment for completed rides and see my earnings and payouts in one place, so that I can trust the platform and plan my finances. |

### Admin/Dispatcher (Internal platform operations – Lerato)

| Priority | User Story |
|----------|------------|
| **MVP** | As an Admin, I want to view all upcoming, ongoing, and completed rides in a single dashboard, so that I can monitor and manage service quality. |
| **MVP** | As an Admin, I want to onboard and verify new drivers and manage document expiry, so that we maintain a highly vetted and compliant driver pool. |
| **MVP** | As an Admin, I want to be alerted to exceptions (no driver acceptance, panic alerts, disputes) and resolve rider/driver issues efficiently, so that platform trust and reliability remain high. |

### Future User Stories (Phase 2)

#### Coordinator / Organiser (Mari – school or corporate coordinator)

| Priority | User Story |
|----------|------------|
| **Future** | As a Coordinator, I want to manage bookings for multiple riders under one school or company account, so that I can standardise safe transport without each parent or employee arranging their own rides. |
| **Future** | As a Coordinator, I want to receive consolidated reports and invoices for all rides linked to my organisation, so that I can reconcile transport costs quickly and share clear records with finance and parents. |

#### Rider – Advanced / Power Features (Sarah, Nomsa, Aisha)

| Priority | User Story |
|----------|------------|
| **Future** | As a Rider, I want to schedule multiple and recurring rides (e.g., school runs, regular shifts) and define recurring ride templates (e.g., every weekday at 07:00 from home to school), so that I can reduce daily planning and last-minute stress by setting up my routine once and only adjusting when things change. |
| **Future** | As a Rider, I want my employer or school to link my profile to an organisation account, so that some rides can be billed centrally while I still see all my own history and safety information. |

#### Driver – Advanced (Thandi, Zanele)

| Priority | User Story |
|----------|------------|
| **Future** | As a Driver, I want to access detailed performance stats (earnings trends, on-time rate, rider ratings), so that I can understand my performance and optimise when and where I drive. |
| **Future** | As a Driver, I want the option for faster or instant payouts for a small fee, so that I can access my earnings quickly when I need cash flow. |

---

## Functional Requirements Overview

### Rider Experience

| Priority | Features |
|----------|----------|
| **Must-Have (MVP)** | **Schedule Ride**: Riders can choose pickup, drop-off, time, and vehicle type. |
| | **Ride Status Notifications**: Timely status updates (push/SMS/email), e.g., driver assigned, driver en route, arrived, trip start, trip end. (Live map tracking – Future) |
| | **View Driver Profile**: Photos, ratings, and bio. |
| | **In-app Secure Payment**: Support for credit/debit cards. |
| | **Notifications**: Push/email/SMS for confirmations and reminders (English only for MVP). |
| **Nice-to-Have / Future** | **Live Map Tracking**: Real-time in-app tracking of car location. |
| | **Favorite Locations**: Save frequent destinations. |
| | **Ride History**: Past trip details. |
| | **In-app Chat**: Secure rider-driver messaging. |
| | Multilingual support (Future). |

### Driver Portal

| Priority | Features |
|----------|----------|
| **Must-Have** | **Set Availability**: Calendar and shift management. |
| | **Ride Acceptance**: Accept/decline incoming ride requests. |
| | **Trip Dashboard**: List of upcoming rides. |
| | **Navigation Integration**: Directions to pickup/drop-off. |
| **Nice-to-Have** | **Performance Stats**: Earnings and reviews. |
| | **Instant Payout**: Withdraw earnings instantly. |

### Admin Dashboard

| Priority | Features |
|----------|----------|
| **Must-Have** | **Ride Management**: View/manage rides by status. |
| | **Driver Onboarding**: Approve, verify, and manage drivers. |
| | **Dispute Resolution**: Handle complaints. |
| **Nice-to-Have** | **Analytics Export**: Download ride and user data. |
| | **Broadcast Announcements**: Send updates to user groups. |

### System Core

| Priority | Features |
|----------|----------|
| **Must-Have** | **User Authentication**: Secure login/signup for all user types. |
| | **Role-Based Access**: Rider, driver, admin permissions. |
| | **Notification Engine**: Multi-channel delivery. |
| | **Payment Gateway Integration**: Automated funds flow and receipt generation. |
| | **Responsive PWA Shell**: Mobile and desktop optimized. |
| **Nice-to-Have** | **Deep Link Support**: Direct navigation from external sources. |
| | **Accessibility**: WCAG 2.1 Level AA compliance. |

---

## User Experience and Key User Journeys

### Rider User Journey

#### Entry Point and Onboarding Experience

* Users discover ChaufHER via web, app store (installable PWA), or referral campaigns.
* First-time visitors see a clear value proposition screen and option to sign up as a rider or driver.
* Riders are onboarded through a 3-step form: profile info, phone/email verification, and payment method addition.
* Optional tutorial highlights scheduling and safety features.

> **Note**: All onboarding content, support documentation, and notifications are English only for MVP. MVP limitations—no live map tracking, no in-app chat, no multilingual—are disclosed at onboarding and in platform help/FAQ.

#### Core Experience

**Book a Ride: Home Screen Call-to-Action**
* Minimal friction: prominent button, clear instructions.
* Location fields with auto-complete for pick-up/drop-off.
* Date and time selection using calendar widget.
* Validation: no past-dates, address auto-complete, resolve missing info.

**Review and Select Driver: Driver Match Preview**
* Review available drivers with profiles, ratings.
* Choose preferred driver if options exist, otherwise platform auto-selects best match.

**Confirmation and Payment: Fare Review and Payment Process**
* Fare estimate breakdown shown.
* Secure payment via card (one-tap if saved).
* Schedule completion confirmation; event added to user calendar (optional).

**Pre-Ride Notifications and Reminders**
* Automated reminders (1 hr before, 10 min before).
* Real-time status: "Awaiting Driver," "En Route," "Arrived."

**In-Ride User Experience**
* (MVP) Status notifications are sent at each key stage (driver en route, arrival, start, end).
* (Future) Live ride tracking (map interface); direct messaging.
* Rate and review driver after trip.

**Post-Ride Actions and Feedback**
* Email receipt, trip summary in app.
* Option to re-book or report an issue.

#### MVP Limitations Communication

> The ChaufHER MVP platform currently supports scheduled rides only, English-language notifications and support, and status updates via push/SMS/email. Live map tracking, in-app messaging, and other advanced features will be added in future releases based on demand and feedback.

Platform help, onboarding copy, and staff/admin training include this disclaimer.

### Driver User Journey

#### Entry Point
* Driver signs up via clear "Drive with ChaufHER" call-to-action.
* Onboarding: license upload, vehicle/insurance verification, background check form, calendar setup.
* Training/tutorial on platform use and safety.

#### Core Experience

| Step | Description |
|------|-------------|
| **Set Availability** | Calendar/shift view for managing future ride slots. |
| **Ride Notification** | Accept/decline ride offers with full visibility on itinerary. |
| **Ride Execution** | Navigation and ride progress tracking; in-app communication. |
| **Completion** | Mark trip as "Completed"; earnings summary displayed, tips processed. |

### Admin User Journey

#### Entry Point
* Secure login, role-based landing page (dashboard).
* Immediate view of overall system status: ride queue, active drivers/riders.

#### Core Experience
* Real-time ride monitoring, manual override if issues detected.
* Driver onboarding/review process.
* Customer support/dispute resolution dashboard.

### Advanced Features and Edge Cases Handling

* **Power-users**: Frequent riders use saved profiles, instant re-booking.
* **Error states**: Failed payment triggers retry prompt; missed rides enable rescheduling.
* **No driver match**: Triggers waitlist/notify system.

### UI/UX Highlights for MVP

* Accessible high-contrast mode, large touch targets.
* App-like feel on both mobile and desktop.
* Consistent branding and clear hierarchy, inclusive imagery.
* All critical flows delivered in English only for MVP.

> Multilingual support (and further accessibility enhancements) considered only as a future phase, not promised in MVP.

---

## Sample User Scenario Narrative

Sarah, a working mother, struggles to coordinate transportation between her night shifts and her child's school pickups. Mainstream ride-hail apps make her anxious due to unreliable rides and uncomfortable driver experiences. After discovering ChaufHER through a local referral, she quickly schedules reliable rides for the upcoming week with vetted female drivers. On her first ride, Sarah receives timely reminders, views her driver's profile, and tracks the journey. The ride is smooth and friendly, giving her peace of mind. She receives a trip summary and an option to schedule her next ride—transforming her daily routine. As ChaufHER's reputation grows, more women join as drivers and riders, increasing value for the community.

---

## Success Metrics

### Metrics and Measurement Criteria

| Metric | Measurement Criteria |
|--------|---------------------|
| **Rider Retention** | % of Riders booking >1 ride/month (tracked via app logs) |
| **CSAT (Satisfaction)** | Post-ride survey results (goal: ≥4.8/5 avg) |
| **Total Completed Rides** | Number/month (goal: 1,000+ by month 3) |
| **Active Driver Count** | # drivers logging ≥1 ride/month |
| **Revenue** | Net revenue, monthly |
| **System Reliability** | Uptime, downtime, transaction error rates |

### User-Centric Metrics

* Rider retention (repeat use per month)
* Driver satisfaction (via post-ride and monthly pulse surveys)
* Average ride rating
* Number of resolved support tickets within 24 hours

### Business Performance Metrics and KPIs

* Number of new users (riders/drivers) acquired monthly
* Gross bookings and net revenues
* Driver onboarding conversion rate

### Technical Performance KPIs

* Successful payment transaction rate (>99%)
* Platform error/crash reports (<1% per session)
* P95 load time (<2 seconds for all flows)

### MVP Analytics and Tracking Plan

* Ride scheduled/completed events
* Payment initiated/processed/completed events
* User registration events
* Onboarding completion (rider, driver)
* Ride cancellation / dispute events
* Feature usage (e.g., notifications, ride tracking)

---

## Technical Architecture

### MVP Technical Needs

* Backend RESTful APIs for ride scheduling, user profiles, payments, and notifications.
* Real-time data layer for ride status updates (websockets or similar).
* Front-end PWA optimized for mobile and desktop devices.
* Admin portal with secure, role-based authentication.
* Payment gateway integration for card processing.
* Notification service supporting SMS, push, and email (English only, manual support via WhatsApp as backup in MVP).
* Robust database schema for users, rides, driver compliance.

### Manual/Operational Dependencies

> **Estimate required**: Admin can comfortably manage [X] rides per day using manual processes. Over this, support load and error risk sharply increase.

### Key Integration Points

* Payment processor(s)
* 3rd-party SMS/email notification providers
* Map/geolocation API (route tracking, directions)
* Background check provider for driver onboarding

### Data Storage, Privacy, and Compliance

* All user data encrypted in transit and at rest.
* Sensitive PII and payment data handled per PCI-DSS, local laws.
* Data retention policies compliant with GDPR and local jurisdiction.

### Platform Scalability and Performance

* Designed for initial volume: thousands of users; scalable horizontally as usage grows.
* Load balanced for minimum 99.5% uptime.
* Auto-scaling for notifications and real-time event handling.

### Potential Challenges and Risks

* Ensuring on-time driver arrivals for scheduled rides.
* Fraud or identity spoofing prevention.
* Systemic bias in driver reviewing or scheduling.
* Reliance on third-party services for key features (notifications, payments).
* Operational dependency on WhatsApp/manual booking in early MVP phase may increase support workload and error tolerance until full automation is feasible.

---

## Development Milestones and Launch Sequencing

### MVP Project Estimate

* Small to Medium: 3–6 weeks for MVP, depending on design/feedback cycles.

### MVP Team Composition and Roles

**Small Team**: 1 Product Owner (PM/Design hybrid), 1 Engineer, 1 Business Analyst (Eben), and 1 Tester.

**Roles**: Product/project leadership, Full-stack engineering, lightweight UX/UI design, business analysis, and testing.

MVP support includes manual admin processes—dispatch, notification, and driver verification—handled by operations/admin until automation.

Ongoing training and documentation for admin as hand-off for scaling reduces tech support cost risk.

### Recommended MVP Development and Launch Phases

#### Phase 1: Core MVP Build (Estimated Duration: 2 Weeks)

**Key Deliverables:**
* Core Rider and Driver flows live
* Admin dashboard basic functionality
* Payment and notification systems functional
* PWA responsive shell

**Dependencies:**
* Account with payment gateway, notification provider
* Map/geolocation API keys
* Background check provider integration

#### Phase 2: Real-Time Features and Edge Case Handling (Estimated Duration: 1 Week)

**Key Deliverables:**
* Real-time ride status engine
* Advanced validation, error handling
* Initial reporting/analytics hooks

**Dependencies:**
* Completion of Phase 1 MVP flows

#### Phase 3: Usability Improvements and Pilot Launch (Estimated Duration: 1–2 Weeks)

**Key Deliverables:**
* Polish onboarding, ride management
* Accessibility and multilingual support
* Pilot user onboarding (riders, drivers, admin test accounts)

**Dependencies:**
* Completion of MVP, early test feedback

#### Phase 4: Stabilization and Feedback Iteration (Estimated Duration: 1 Week)

**Key Deliverables:**
* Address pilot feedback
* Stress/load testing
* Initial marketing collateral

**Dependencies:**
* Pilot phase completion

---

## Supporting Documents and References

1. For more details on user personas, please refer to: [user_personas.md](user_personas.md)
2. For customer journey mapping and touchpoints, please refer to: [CUSTOMER_JOURNEY_MAP.md](CUSTOMER_JOURNEY_MAP.md)
3. For design principles and constraints, please refer to: [DESIGN_GUARDRAILS.md](DESIGN_GUARDRAILS.md)
4. For architecture decisions, please refer to: [ADR Index](../adr/)
