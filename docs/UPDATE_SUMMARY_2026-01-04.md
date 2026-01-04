# Documentation Update Summary - 2026-01-04

## Changes Made

Updated PRD and Development Roadmap to v2.0 based on critical stakeholder feedback from Stacey Wright and Greg Wakelin.

## Key Documents Updated

1. **PRD.md** (v1.0 → v2.0)
   - Added new "Critical Business Rules" section
   - Status changed to "Updated - Requires Stakeholder Approval"

2. **DEVELOPMENT_ROADMAP.md** (v1.0 → v2.0)
   - Updated Sprint 1, 2, and 3 with revised flows
   - Added critical business rules callout at top

3. **PRD_ALIGNMENT_ISSUES.md** (NEW)
   - Comprehensive gap analysis document
   - 9 critical issues identified
   - Updated business rules
   - Action items for product owner

## 🔴 Critical Changes That Impact Development

### 1. 90-Minute Minimum Booking Window
**Impact:** HIGH  
**Change:** Riders must book at least 90 minutes in advance.

**What needs to change:**
- Sprint 1: Add validation to booking flow (client + server)
- UI: Date/time picker must disable times < 90 mins from now
- Error message: "Rides must be booked at least 90 minutes in advance"

### 2. SMS-First Driver Matching
**Impact:** CRITICAL  
**Change:** Drivers don't keep app open due to data costs. SMS is PRIMARY notification channel.

**What needs to change:**
- Sprint 1: Driver matching algorithm completely revised
- Sprint 2: SMS notification is CRITICAL feature (not nice-to-have)
- Sprint 3: SMS budget and provider selection become critical
- Flow: Query available drivers by schedule → Send SMS with payout amount → 10-min response window → Sequential notification

**Cost Implications:**
- More SMS notifications = higher operational cost
- Need to optimize notification strategy

### 3. Driver Payout Display Only
**Impact:** HIGH (Legal/Compliance)  
**Change:** Drivers see ONLY their payout amount, NOT the rider fare.

**What needs to change:**
- Sprint 1: Ride entity must separate `RiderFare` and `DriverPayout`
- Sprint 1: Fare calculation service computes both
- Sprint 2: All driver UI shows payout only
- Sprint 2: Admin dashboard shows both + commission
- Database schema update required

### 4. Payment Timing: Authorize at Booking, Charge on Acceptance
**Impact:** CRITICAL  
**Change:** Payment method added at booking with authorization (hold). Payment charged when driver accepts (within 10-minute window).

**What needs to change:**
- Sprint 1: Booking flow revised - payment authorized (not charged)
- Sprint 1: Clear messaging: "You'll be charged when a driver accepts"
- Sprint 2: When driver accepts → trigger payment charge (3DS flow)
- Sprint 3: Payment service split into `AuthorizeRidePaymentAsync` and `ChargeRideAsync`
- Sprint 3: Handle payment failure after driver acceptance (cancel ride, compensate driver, notify next driver)

### 5. Driver Receipt via ChaufHER
**Impact:** MEDIUM (Legal)  
**Change:** Receipt legally from driver (via ChaufHER), not from ChaufHER directly.

**What needs to change:**
- Sprint 3: Receipt template wording: "Receipt from [Driver Name] via ChaufHER"
- Legal review required for wording
- Receipt shows driver payout (what driver earned)

### 6. 24-Hour Clock Format
**Impact:** LOW  
**Change:** Default to 24-hour time format to prevent AM/PM confusion.

**What needs to change:**
- Sprint 1: Time picker component uses 24-hour format by default
- Sprint 4: Add user preference option (nice-to-have)

### 7. Fare Estimate Before Payment
**Impact:** MEDIUM  
**Change:** Riders want to see fare estimate BEFORE entering payment details.

**What needs to change:**
- Sprint 1: Booking flow revised - fare estimate shown first
- Sprint 1: Payment method required only at final booking confirmation
- UX: Users can browse/estimate without payment method saved

## Updated Sprint Acceptance Criteria

### Sprint 1 Changes
- ✅ Date/time picker enforces 90-minute minimum (client + server validation)
- ✅ Time picker uses 24-hour format by default
- ✅ Fare estimate shown BEFORE payment method required
- ✅ Payment authorized (not charged) at booking
- ✅ Clear message: "You'll be charged when driver accepts"
- ✅ Ride entity has `RiderFare`, `DriverPayout`, `PlatformCommission`, `CommissionRate`
- ✅ Driver matching uses SMS notification (not real-time app status)

### Sprint 2 Changes
- ✅ SMS sent to drivers with payout amount when ride matches availability
- ✅ Driver sees ONLY payout amount, NOT rider fare (all views)
- ✅ 10-minute countdown timer shown after notification
- ✅ Payment charged to rider immediately when driver accepts
- ✅ If driver doesn't respond in 10 mins, next driver notified
- ✅ If no driver in 30 mins, admin alerted

### Sprint 3 Changes
- ✅ Payment authorized (not charged) at booking
- ✅ Payment charged when driver accepts (3DS flow)
- ✅ CVV required for every transaction
- ✅ If payment fails after driver accepts: ride cancelled, driver compensated, next driver notified
- ✅ Receipt template: "Receipt from [Driver Name] via ChaufHER"
- ✅ Receipt shows driver payout amount (what driver earned)
- ✅ SMS sent to drivers for new ride requests (PRIMARY channel)
- ✅ SMS notification includes deep link to open app

## Database Schema Changes Required

### Ride Entity
```csharp
public class Ride
{
    // ... existing fields
    
    // ADDED: Separate rider fare from driver payout
    public decimal RiderFare { get; set; }          // What rider pays
    public decimal DriverPayout { get; set; }       // What driver gets
    public decimal PlatformCommission { get; set; }  // Difference
    public decimal CommissionRate { get; set; }     // % rate
    
    // ADDED: Payment timing tracking
    public string PaymentMethodId { get; set; }     // Saved at booking
    public DateTime? PaymentAuthorizedAt { get; set; }  // When authorized
    public DateTime? PaymentChargedAt { get; set; }     // When charged (driver accepts)
}
```

**Migration Required:** Create migration in Phase 0 or Sprint 1 start.

## Configuration Changes Required

### Environment Variables / App Settings

```json
{
  "BusinessRules": {
    "MinimumBookingWindowMinutes": 90,
    "DriverResponseTimeoutMinutes": 10,
    "MaxDriverNotificationAttempts": 5,
    "NoDriverFallbackMinutes": 30
  },
  "Payments": {
    "AuthorizeAtBooking": true,
    "ChargeOnDriverAcceptance": true,
    "Require3DS": true,
    "RequireCVV": true
  },
  "Notifications": {
    "DriverPrimaryChannel": "SMS",
    "SMSProvider": "AfricasTalking",
    "SendDriverFareInNotification": false,  // Send payout only
    "IncludeDeepLinkInSMS": true
  }
}
```

## Testing Requirements

### New Tests Required

1. **Booking Validation Tests**
   - Test 90-minute minimum enforcement
   - Test validation error messages
   - Test 24-hour time format

2. **Payment Flow Tests**
   - Test authorization at booking
   - Test charge on driver acceptance
   - Test payment failure after acceptance (cancel + compensate flow)

3. **Driver Notification Tests**
   - Test SMS sent when ride matches driver availability
   - Test SMS includes payout only (NOT rider fare)
   - Test 10-minute timeout
   - Test sequential notification (up to 5 drivers)
   - Test 30-minute fallback to admin

4. **Fare Display Tests**
   - Test rider sees rider fare
   - Test driver sees payout only
   - Test admin sees both + commission

5. **Receipt Tests**
   - Test receipt template wording
   - Test receipt shows driver payout
   - Test receipt delivery (email + in-app)

## Risks & Mitigation

| Risk | Severity | Mitigation |
|------|----------|------------|
| SMS costs exceed budget | Medium | Optimize notification logic; monitor costs closely |
| Payment timing confusion causes failed rides | High | Clear UX messaging; thorough testing |
| Driver payout display wrong = legal issues | High | Comprehensive testing; code review |
| 90-min window too restrictive = low bookings | Medium | Monitor metrics; adjust if needed |
| Driver app-off assumption breaks matching | High | SMS-first approach already mitigates |

## Next Steps (In Order)

### Immediate (Before Starting Implementation)

1. **Product Owner: Schedule stakeholder meeting**
   - Walk through PRD_ALIGNMENT_ISSUES.md with Stacey Wright and Greg Wakelin
   - Get confirmation on all 7 critical changes
   - Clarify open questions (see below)

2. **Legal Review**
   - Receipt wording (driver receipt via platform)
   - Payment terms (authorization vs charge)

3. **Update API Specification**
   - Swagger/OpenAPI docs with new endpoints
   - Payment authorize + charge split
   - Receipt generation endpoint

### Sprint 1 Prep

1. Update database schema (add migration)
2. Create booking validation service
3. Set up SMS provider (Africa's Talking)
4. Update UI components (time picker, fare display)

## Open Questions for Product Owner

These questions MUST be answered before Sprint 1:

1. **Commission Rate:** What % or fixed amount does platform take?
2. **Failed Payment:** What compensation does driver get if payment fails after acceptance?
3. **SMS Budget:** Expected cost per notification? Monthly budget?
4. **Driver Response Time:** Is 10 minutes appropriate? Too long/short?
5. **Fallback Strategy:** If no driver accepts in 30 mins, what's the exact rider experience?
6. **Tipping:** MVP or Phase 2?
7. **Phone Booking:** Confirm Phase 2 / out of MVP scope?

## Timeline Impact

**Estimated Impact:** +1 week to Phase 0 (clarification + replanning)

**Revised Timeline:**
- Phase 0 (Foundation): 3-5 days → **1-2 weeks** (add stakeholder approval + schema changes)
- Sprint 1-5: Remain 8-10 weeks (but with revised flows)

**Total:** 9-12 weeks to MVP (was 8-10 weeks)

## Success Criteria for Update

✅ Stakeholder approval received  
✅ All open questions answered  
✅ Legal review complete  
✅ Database schema updated  
✅ Team understands all changes  
✅ Sprint 1 backlog updated with new acceptance criteria

## Document References

- **PRD.md** - Product Requirements Document v2.0
- **DEVELOPMENT_ROADMAP.md** - Development Roadmap v2.0
- **PRD_ALIGNMENT_ISSUES.md** - Detailed gap analysis and recommendations

---

**Document Owner:** Engineering Team  
**Requires Action From:** Product Owner (Jurie), Business Analyst (Eben), Stakeholders (Stacey, Greg)  
**Status:** 🟡 Awaiting Stakeholder Approval
