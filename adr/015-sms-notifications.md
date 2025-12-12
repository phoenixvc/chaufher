# ADR-015: SMS & Push Notifications – Africa's Talking vs Alternatives

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Operations
**Technical Story:** SMS and push notification provider for ride alerts and communications

---

## Context

ChaufHER requires notification services for:
- Ride status updates (driver assigned, en route, arrived, completed)
- OTP verification for authentication
- Driver notifications for new ride requests
- Rider reminders before scheduled pickups
- Emergency alerts (panic button)
- Marketing communications (future)

The platform must:
- Deliver SMS reliably to South African mobile numbers
- Support push notifications to PWA
- Provide delivery receipts and status tracking
- Handle high throughput during peak hours
- Be cost-effective for transactional SMS
- Integrate with .NET backend

---

## Decision Drivers

1. **South Africa Delivery** – Reliable SMS delivery to SA networks
2. **Cost** – Per-SMS pricing for transactional messages
3. **Reliability** – Delivery success rate, uptime
4. **Integration** – .NET SDK, API quality
5. **Push Support** – Web push notification capability
6. **Delivery Speed** – Time to deliver SMS
7. **Scalability** – Handle volume spikes
8. **Features** – Templates, scheduling, two-way SMS
9. **Compliance** – POPIA, opt-out handling
10. **Support** – African timezone support

---

## Options Considered

### Option A: Africa's Talking

Africa-focused communications platform.

**Pros:**
- Built specifically for African markets
- Excellent SA network coverage
- Direct carrier connections (not reselling)
- Competitive pricing (R0.20-0.30/SMS)
- USSD support (future feature)
- Voice calls capability
- Good .NET SDK
- African company, local support
- Delivery reports

**Cons:**
- No native push notifications (need separate service)
- Dashboard less polished
- Documentation could be better
- Smaller global presence

### Option B: Twilio

Global communications platform leader.

**Pros:**
- Industry leader, proven at scale
- Excellent developer experience
- Comprehensive .NET SDK
- Push notifications via Twilio Notify
- Rich feature set (WhatsApp, voice)
- Beautiful documentation
- Strong delivery infrastructure

**Cons:**
- Expensive for SA (R0.50+/SMS)
- Routes through international gateways
- SA delivery can be slower
- No direct SA carrier relationships
- Support in US timezone
- Overkill for SMS-only

### Option C: Azure Communication Services

Microsoft's communications platform.

**Pros:**
- Native Azure integration
- Single vendor with cloud
- SMS and email in one service
- .NET SDK first-class
- Managed identity auth
- Global infrastructure

**Cons:**
- Limited SA presence
- Higher SMS costs
- Newer service, less mature
- SA delivery via partners
- Push notifications separate
- Less African expertise

### Option D: Clickatell

SA-founded global messaging company.

**Pros:**
- South African roots
- Strong carrier relationships
- Enterprise-grade
- WhatsApp Business API
- Good delivery rates
- Compliance expertise

**Cons:**
- Enterprise-focused pricing
- Minimum commitments
- API less modern
- Complex pricing tiers
- Better for high volume

### Option E: BulkSMS

South African SMS provider.

**Pros:**
- Local SA company
- Direct carrier connections
- Very competitive pricing
- Simple API
- Good for bulk

**Cons:**
- SMS only (no push)
- Basic features
- API dated
- Limited scalability
- Minimal support

---

## Weighted Evaluation Matrix

| Criterion | Weight | Africa's Talking | Twilio | Azure Comms | Clickatell | BulkSMS |
|-----------|--------|------------------|--------|-------------|------------|---------|
| **SA Delivery** | 20% | 5 | 3 | 3 | 5 | 5 |
| **Cost** | 15% | 5 | 2 | 3 | 3 | 5 |
| **Reliability** | 15% | 4 | 5 | 4 | 5 | 3 |
| **Integration** | 12% | 4 | 5 | 5 | 3 | 2 |
| **Push Support** | 10% | 2 | 4 | 3 | 2 | 1 |
| **Delivery Speed** | 8% | 5 | 3 | 3 | 4 | 4 |
| **Scalability** | 8% | 4 | 5 | 5 | 5 | 3 |
| **Features** | 5% | 4 | 5 | 4 | 4 | 2 |
| **Compliance** | 4% | 4 | 5 | 4 | 5 | 3 |
| **Support** | 3% | 5 | 3 | 4 | 4 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Africa's Talking** | (5×.20)+(5×.15)+(4×.15)+(4×.12)+(2×.10)+(5×.08)+(4×.08)+(4×.05)+(4×.04)+(5×.03) | **4.19** |
| **Twilio** | (3×.20)+(2×.15)+(5×.15)+(5×.12)+(4×.10)+(3×.08)+(5×.08)+(5×.05)+(5×.04)+(3×.03) | **3.74** |
| **Clickatell** | (5×.20)+(3×.15)+(5×.15)+(3×.12)+(2×.10)+(4×.08)+(5×.08)+(4×.05)+(5×.04)+(4×.03) | **4.01** |
| **Azure Comms** | (3×.20)+(3×.15)+(4×.15)+(5×.12)+(3×.10)+(3×.08)+(5×.08)+(4×.05)+(4×.04)+(4×.03) | **3.62** |
| **BulkSMS** | (5×.20)+(5×.15)+(3×.15)+(2×.12)+(1×.10)+(4×.08)+(3×.08)+(2×.05)+(3×.04)+(4×.03) | **3.46** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Africa's Talking** | 4.19 |
| 2 | Clickatell | 4.01 |
| 3 | Twilio | 3.74 |
| 4 | Azure Communication Services | 3.62 |
| 5 | BulkSMS | 3.46 |

---

## Analysis

### Why Africa's Talking Wins for ChaufHER

1. **Built for Africa**: Direct relationships with SA carriers:
   - MTN, Vodacom, Cell C, Telkom direct routes
   - Not reselling through international aggregators
   - Better delivery rates to SA numbers

2. **Cost-Effective**: Critical for transactional SMS volume:
   - ~R0.25/SMS vs R0.50+ for Twilio
   - On 10,000 SMS/month: R2,500 vs R5,000+
   - 50% cost savings

3. **Delivery Speed**: Direct routes mean faster delivery:
   - Typical: 2-5 seconds
   - Critical for ride status updates
   - Driver notifications need immediacy

4. **African Expertise**: Understanding of local market:
   - Network-specific handling
   - Compliance with SA regulations
   - Support in African timezone

5. **Future-Ready**: Platform includes:
   - USSD (future: USSD booking for feature phones)
   - Voice calls (future: driver-rider calls)
   - Airtime top-up (future: driver rewards)

### Push Notifications Strategy

Africa's Talking doesn't include push notifications. Recommended approach:

```
Notifications
├── SMS: Africa's Talking (transactional)
├── Web Push: Firebase Cloud Messaging (FCM)
└── In-App: SignalR (already selected in ADR-003)
```

FCM is free and integrates well with PWA service workers.

### When to Reconsider

Consider alternatives if:
- Expanding beyond Africa (Twilio better for global)
- Need WhatsApp Business API (Clickatell)
- Want single-vendor with Azure (Azure Comms)
- Volume exceeds 100K SMS/month (negotiate enterprise rates)

---

## Decision

**Selected: Africa's Talking** for SMS + **Firebase Cloud Messaging** for push

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Notification Service                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                                           │
│  │ Notification     │                                           │
│  │ Orchestrator     │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
│     ┌─────┴─────┬─────────────┐                                 │
│     ▼           ▼             ▼                                 │
│  ┌──────┐  ┌──────────┐  ┌─────────┐                           │
│  │ SMS  │  │ Web Push │  │ SignalR │                           │
│  │ (AT) │  │  (FCM)   │  │ In-App  │                           │
│  └──────┘  └──────────┘  └─────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Notification Types

| Event | SMS | Push | In-App |
|-------|-----|------|--------|
| Ride confirmed | ✓ | ✓ | ✓ |
| Driver assigned | ✓ | ✓ | ✓ |
| Driver en route | | ✓ | ✓ |
| Driver arrived | ✓ | ✓ | ✓ |
| Trip started | | ✓ | ✓ |
| Trip completed | ✓ | ✓ | ✓ |
| Payment received | ✓ | | ✓ |
| OTP verification | ✓ | | |
| Panic alert | ✓ | ✓ | ✓ |

### SMS Templates

```csharp
public static class SmsTemplates
{
    public const string RideConfirmed =
        "ChaufHER: Your ride on {date} at {time} is confirmed. " +
        "Pickup: {pickup}. Ref: {ref}";

    public const string DriverAssigned =
        "ChaufHER: {driverName} will pick you up in {vehicle}. " +
        "Reg: {registration}. ETA: {eta}";

    public const string DriverArrived =
        "ChaufHER: Your driver has arrived at {pickup}. " +
        "Look for {vehicle} ({registration})";

    public const string OtpVerification =
        "ChaufHER: Your verification code is {otp}. " +
        "Valid for 5 minutes. Do not share.";
}
```

### Configuration

```csharp
// appsettings.json
{
  "AfricasTalking": {
    "Username": "chaufher",
    "ApiKey": "xxx",
    "ShortCode": "ChaufHER",
    "Environment": "sandbox" // or "production"
  },
  "Firebase": {
    "ProjectId": "chaufher-app",
    "CredentialsPath": "/secrets/firebase-credentials.json"
  }
}
```

### Cost Estimate

| Volume | Monthly Cost |
|--------|--------------|
| 5,000 SMS | ~R1,250 |
| 10,000 SMS | ~R2,500 |
| 25,000 SMS | ~R6,250 |
| Push (FCM) | Free |

---

## Consequences

### Positive

- Direct SA carrier routes ensure reliable delivery
- 50% cost savings vs international providers
- Fast delivery for time-sensitive ride updates
- African timezone support
- Future USSD/voice capabilities

### Negative

- No native push (need FCM separately)
- Smaller company than Twilio
- Less polished developer experience
- Africa-focused limits global expansion

### Neutral

- Team learns Africa's Talking API
- Two services for notifications (SMS + push)
- Can migrate to Twilio if needed

---

## Related Documents

- [ADR-003: Real-Time Communication (SignalR)](003-realtime-signalr.md)
- [ADR-007: Authentication (Azure AD B2C)](007-authentication-azure-ad-b2c.md)
- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)

---

## References

- [Africa's Talking Documentation](https://africastalking.com/docs)
- [Africa's Talking SMS API](https://africastalking.com/docs/sms)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Web Push with FCM](https://firebase.google.com/docs/cloud-messaging/js/client)
