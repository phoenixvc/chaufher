# PRD & Roadmap Alignment Issues

**Date:** 2026-01-04  
**Status:** 🔴 Critical Gaps Identified  
**Source:** Stakeholder Feedback (Stacey Wright, Greg Wakelin)

---

## Executive Summary

After reviewing stakeholder feedback screenshots, **7 critical misalignments** have been identified between the current PRD/Roadmap and actual business requirements. These must be addressed before Sprint 1 begins.

**Impact:** Without these changes, the MVP will not meet stakeholder expectations and may require significant rework.

---

## Critical Issues

### 1. Payment Timing & Flow 🔴 BLOCKER

**Issue:** When does payment actually occur?

**PRD Note (from feedback):**
> "Charge occurs when driver accepts the trip"  
> "3DS required + CVV required each transaction"

**Current Assumptions:**
- Roadmap Sprint 1 shows riders booking and confirming with payment
- But feedback says payment happens AFTER driver accepts

**Required Clarification:**
1. Does rider enter payment details at booking?
2. Is payment authorized (hold) at booking but captured on driver acceptance?
3. What happens if payment fails after driver accepts?

**Impact on Roadmap:**
- Sprint 1 booking flow needs revision
- Sprint 3 payment integration must align with "charge on acceptance" model
- UX needs to clearly communicate when charge occurs

**Recommendation:**
```
Booking Flow (Revised):
1. Rider schedules ride with pickup/dropoff/time
2. Rider adds payment method (card saved, not charged yet)
3. Fare estimate shown
4. Booking confirmed (no charge yet)
5. Driver assigned and accepts
6. Payment charged immediately (3DS flow)
7. Rider receives confirmation + receipt
```

---

### 2. Driver Fare Display 🔴 HIGH PRIORITY

**Issue:** Drivers see different fare than riders pay.

**Feedback (Greg Wakelin):**
> "Driver to see fare pricing in terms of what they are paid, not the Rider fare"

**Current Gap:**
- Roadmap doesn't distinguish between:
  - Rider fare (what customer pays)
  - Driver payout (what driver receives)
  - Platform commission (difference)

**Required Changes:**

**Database Schema:**
```csharp
public class Ride
{
    public decimal RiderFare { get; set; }        // What rider pays
    public decimal DriverPayout { get; set; }     // What driver gets
    public decimal PlatformCommission { get; set; } // Difference
    public decimal CommissionRate { get; set; }   // % or fixed
}
```

**UI Changes:**
- Rider sees: Total fare breakdown
- Driver sees: **Only their payout amount** (not rider fare)
- Admin sees: Both + commission

**Impact on Roadmap:**
- Sprint 1: Fare calculation service must compute both
- Sprint 2: Driver UI shows payout only
- Admin dashboard shows full breakdown

---

### 3. Receipt Generation Ownership 🟡 MEDIUM

**Issue:** Who issues the receipt?

**Feedback (Greg Wakelin):**
> "The ride receipt is produced by Chaufher on behalf of the Driver. It is technically a Driver receipt for Rider"

**Implication:**
- Receipt is legally from driver, not platform
- ChaufHER acts as intermediary
- Affects tax/accounting implications

**Required Changes:**
- Receipt template must say "Receipt from [Driver Name] via ChaufHER"
- Not "Receipt from ChaufHER"
- Legal review needed for wording

**Impact on Roadmap:**
- Sprint 3 payment implementation
- Receipt template design
- Legal consultation required

---

### 4. Minimum Booking Window 🔴 HIGH PRIORITY

**Issue:** No minimum booking notice period defined.

**Feedback (Greg Wakelin):**
> "Need to add in the minimum booking notice period. Currently 90mins"

**Current Gap:**
- PRD says "schedule in advance" but no minimum
- Roadmap Sprint 1 doesn't include this validation

**Required Changes:**

**Business Rule:**
```
Minimum booking window: 90 minutes from now
- User cannot select time < 90 minutes from current time
- Validation error: "Rides must be booked at least 90 minutes in advance"
```

**UI Changes:**
- Date/time picker disables times within 90-minute window
- Error message if user tries to circumvent

**API Validation:**
```csharp
public class BookRideValidator : AbstractValidator<BookRideRequest>
{
    public BookRideValidator()
    {
        RuleFor(x => x.ScheduledTime)
            .GreaterThan(DateTime.UtcNow.AddMinutes(90))
            .WithMessage("Rides must be booked at least 90 minutes in advance");
    }
}
```

**Impact on Roadmap:**
- Sprint 1: Add to booking validation
- Update PRD with explicit rule
- Add to MVP limitations documentation

---

### 5. Driver Availability Accuracy 🔴 CRITICAL

**Issue:** Driver availability list is not accurate due to data costs.

**Feedback (Stacey Wright):**
> "Please note due to perceived data costs, drivers do not have their Apps permanently on. So the active drivers list will not be an accurate representation of who is available to respond."

**This changes EVERYTHING about driver matching!**

**Current Assumption (WRONG):**
- Drivers set availability in calendar
- Platform matches based on calendar
- Drivers with app open are "available"

**Reality:**
- Drivers don't keep app open due to data costs
- Availability calendar is aspirational, not real-time
- Need notification system to alert drivers of new rides

**Required Solution:**

**Revised Driver Flow:**
1. Driver sets availability schedule (days/times)
2. When ride is booked matching driver's schedule:
   - Send SMS notification to driver
   - Send push notification (if app open)
   - Driver has X minutes to respond
3. If no response, move to next driver
4. If no driver accepts within Y minutes, notify rider

**Configuration Needed:**
```
DRIVER_RESPONSE_TIMEOUT=10 minutes
MAX_DRIVERS_TO_NOTIFY=5 (sequential or parallel?)
FALLBACK_ACTION=notify_admin / notify_rider
```

**Impact on Roadmap:**
- Sprint 1: Driver matching algorithm completely revised
- Sprint 3: SMS notification becomes CRITICAL (not nice-to-have)
- Admin dashboard needs "unassigned rides" alert

**Cost Implications:**
- More SMS notifications = higher cost
- Need to optimize notification strategy

---

### 6. Quote Before Payment Details 🟡 MEDIUM

**Issue:** Riders want fare estimate before entering payment info.

**Feedback (Stacey Wright):**
> "Riders want to get quotes before adding payment details. They are uncomfortable entering card details unless actually booking a ride."

**Current Flow (PRD):**
1. Onboarding includes payment method addition
2. Then book rides

**Revised Flow:**
1. User can browse and get quotes WITHOUT payment method
2. Only require payment method at final booking confirmation
3. Saved payment methods optional until booking

**Impact on Roadmap:**
- Sprint 1: Booking flow - move payment method addition to later
- Allow guest users to get estimates
- Require auth + payment only at confirmation

---

### 7. 24-Hour Clock & UI Details 🟢 LOW PRIORITY

**Issue:** Users confuse AM/PM.

**Feedback (Stacey Wright):**
> "24hr clock please, so many riders get this wrong and book PAM and PM trips in reverse, so rectify"

**Solution:**
- Default to 24-hour time format
- Option to switch to 12-hour (user preference)
- Clear visual distinction if using AM/PM

**Impact on Roadmap:**
- Sprint 1: UI component selection (time picker)
- Sprint 4: Polish - add preference settings

---

### 8. Tipping Feature 🟢 FUTURE

**Feedback (Stacey Wright):**
> "Add a tip for the driver?"

**Decision Needed:**
- MVP or Phase 2?
- If MVP: Add to Sprint 3 (payments)
- If Phase 2: Document for future

**Recommendation:** Phase 2
- Adds complexity to payment flow
- Not in original PRD
- Can be added post-launch

---

### 9. Elderly/Non-Tech Users 🟢 FUTURE

**Feedback (Stacey Wright):**
> "Elderly /non tech users along with riders who want to feel like they're booking with a person rather than a platform, must be considered."

**Decision:** Phone booking option (Phase 2)
- Admin can book on behalf of user
- WhatsApp booking integration
- Not MVP scope

---

## Updated Business Rules for PRD

### Payment Rules
1. Payment method required at booking
2. Payment **authorized** at booking (hold)
3. Payment **captured** when driver accepts ride
4. 3DS required for all transactions
5. CVV required every time (no CVV-less recurring)
6. Refunds fully manual by admin

### Booking Rules
1. **Minimum booking window: 90 minutes**
2. Maximum booking window: 30 days
3. No past dates allowed
4. Pickup and dropoff cannot be same location

### Driver Matching Rules
1. Match based on availability schedule
2. Notify driver via SMS (primary) + push (secondary)
3. Driver has 10 minutes to respond
4. If no response, notify next driver
5. Maximum 5 drivers notified per ride
6. If no driver accepts in 30 minutes, notify admin + rider

### Fare Display Rules
1. Rider sees: Total rider fare
2. Driver sees: Driver payout only (NOT rider fare)
3. Admin sees: Rider fare + driver payout + commission
4. Commission configurable per ride or % rate

### Receipt Rules
1. Receipt issued from driver (via ChaufHER)
2. Template: "Receipt from [Driver Name] via ChaufHER"
3. Shows driver payout amount (what driver earned)
4. Rider receives copy via email + in-app

---

## Action Items

### Immediate (Before Sprint 1)

- [ ] **Product Owner: Clarify payment timing** with stakeholders
  - When is card charged exactly?
  - What happens if charge fails after driver accepts?

- [ ] **Update PRD.md** with:
  - Minimum booking window (90 minutes)
  - Payment timing (charge on driver acceptance)
  - Driver payout vs rider fare distinction
  - 24-hour clock default

- [ ] **Update DEVELOPMENT_ROADMAP.md**:
  - Sprint 1: Revise booking flow
  - Sprint 1: Add 90-minute validation
  - Sprint 1: Revise driver matching (SMS notifications critical)
  - Sprint 3: Payment flow aligned with "charge on acceptance"
  - Sprint 3: Driver payout vs rider fare in UI

- [ ] **Legal Review**:
  - Receipt wording (driver receipt via platform)
  - Payment terms (hold vs capture)

### Sprint 1 Changes

**Booking Flow:**
```
1. Enter pickup/dropoff
2. Select date/time (90-min minimum enforced)
3. View fare estimate
4. Add payment method (if not already saved)
5. Confirm booking (payment authorized/held)
6. Show "Finding driver..." status
```

**Driver Matching:**
```
1. Find drivers matching schedule + proximity
2. Send SMS to driver(s): "New ride request - R[amount] payout"
3. Driver opens app/clicks link to view details
4. Driver accepts/declines
5. If accept: Charge rider's card (3DS flow)
6. If decline/timeout: Notify next driver
```

### Sprint 3 Changes

**Payment Implementation:**
```
At booking:
- Validate payment method (optional: authorize $0.01)
- Store payment method token

On driver acceptance:
- Initiate 3DS flow
- Charge full amount
- If fails: Notify rider, cancel ride, re-notify drivers
- If success: Generate receipt, notify both parties
```

---

## Risk Assessment

| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|------------|
| Payment timing confusion causes failed rides | High | High | Clear documentation + testing |
| SMS costs exceed budget (driver notifications) | Medium | Medium | Optimize notification logic; batch where possible |
| Driver payout display wrong = legal issues | High | Low | Clear specs + thorough testing |
| 90-min window too restrictive = low bookings | Medium | Low | Monitor metrics; adjust if needed |
| Driver app-off assumption breaks matching | High | Medium | SMS-first approach already mitigates |

---

## Questions for Product Owner / Stakeholders

1. **Payment Timing:** Confirm exact flow - authorize at booking, capture on driver acceptance?
2. **Failed Payment:** What happens if payment fails after driver accepts? Driver compensation?
3. **Commission Rate:** What % or fixed amount does platform take?
4. **SMS Budget:** Expected cost per notification? Budget for X notifications/month?
5. **Driver Response Time:** Is 10 minutes appropriate? Too long/short?
6. **Fallback Strategy:** If no driver accepts, what's the rider experience?
7. **Tipping:** MVP or Phase 2?
8. **Phone Booking:** Confirm Phase 2 / out of MVP scope?

---

## Conclusion

These issues are **critical for MVP success**. The current roadmap assumes a simpler flow than what stakeholders expect.

**Recommendation:** 
- Pause development if already started
- Update PRD and roadmap with these clarifications
- Get stakeholder sign-off on revised flows
- Then proceed with Sprint 1

**Estimated Impact:** +1 week to Phase 0 (clarification + replanning)

---

## Next Steps

1. Schedule meeting with Stacey Wright and Greg Wakelin
2. Walk through revised flows
3. Get approval on all business rules
4. Update PRD.md
5. Update DEVELOPMENT_ROADMAP.md
6. Create updated UI mockups showing revised flow
7. **Then** start Sprint 1 implementation

---

**Document Owner:** Engineering Team  
**Requires Approval:** Product Owner (Jurie), Business Analyst (Eben), Stakeholders (Stacey, Greg)
