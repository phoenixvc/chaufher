# ADR-018: Email Provider – SendGrid vs Alternatives

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Operations
**Technical Story:** Transactional email service for receipts, onboarding, and notifications

---

## Context

ChaufHER requires email services for:
- Ride receipts and invoices
- Welcome/onboarding emails
- Driver application confirmations
- Password reset emails
- Payment confirmations
- Support ticket updates
- Marketing emails (future)

The platform must:
- Deliver reliably to major SA email providers
- Support HTML email templates
- Provide delivery tracking and analytics
- Handle bounce and complaint management
- Integrate with .NET backend
- Be cost-effective for transactional volume

---

## Decision Drivers

1. **Deliverability** – Inbox placement rate
2. **Cost** – Per-email pricing
3. **Integration** – .NET SDK, API quality
4. **Templates** – Dynamic template support
5. **Analytics** – Opens, clicks, bounces
6. **Scalability** – Handle volume growth
7. **Reliability** – Uptime, delivery speed
8. **Compliance** – POPIA, GDPR support
9. **Support** – Documentation, help
10. **Azure Integration** – Native Azure option

---

## Options Considered

### Option A: SendGrid (Twilio)

Leading transactional email platform.

**Pros:**
- Industry leader for transactional email
- Excellent deliverability
- 100 emails/day free forever
- Comprehensive .NET SDK
- Dynamic templates with Handlebars
- Real-time webhooks
- Detailed analytics
- Excellent documentation

**Cons:**
- Twilio acquisition concerns
- Can get expensive at scale
- Support response times vary
- IP reputation shared on lower tiers

### Option B: Azure Communication Services (Email)

Microsoft's communication platform.

**Pros:**
- Native Azure integration
- Single billing with Azure
- Managed identity auth
- Growing feature set
- Competitive pricing
- .NET SDK first-class

**Cons:**
- Newer service, less mature
- Fewer template features
- Limited analytics
- Deliverability unproven at scale
- Smaller community

### Option C: Mailgun

Developer-focused email service.

**Pros:**
- Developer-friendly API
- Good deliverability
- Flexible pricing
- Email validation service
- Detailed logs
- Good .NET support

**Cons:**
- Sinch acquisition changes
- Free tier limited (5,000/month for 3 months)
- UI less polished
- Templates less advanced
- Support varies by plan

### Option D: Amazon SES

AWS's email service.

**Pros:**
- Extremely cheap ($0.10/1000 emails)
- Massive scale capability
- Reliable infrastructure
- Good deliverability

**Cons:**
- Requires AWS account
- Minimal features out of box
- No built-in templates
- Complex setup
- Not Azure-native

### Option E: Postmark

Transactional email specialist.

**Pros:**
- Excellent deliverability
- Fast delivery (seconds)
- Beautiful interface
- Great support
- Message streams separation
- Template system

**Cons:**
- Higher price point
- Transactional only (no marketing)
- Smaller scale than SendGrid
- Less .NET-specific docs

---

## Weighted Evaluation Matrix

| Criterion | Weight | SendGrid | Azure Email | Mailgun | Amazon SES | Postmark |
|-----------|--------|----------|-------------|---------|------------|----------|
| **Deliverability** | 20% | 5 | 4 | 4 | 4 | 5 |
| **Cost** | 15% | 4 | 4 | 4 | 5 | 3 |
| **Integration** | 15% | 5 | 5 | 4 | 3 | 4 |
| **Templates** | 12% | 5 | 3 | 4 | 2 | 5 |
| **Analytics** | 10% | 5 | 3 | 4 | 3 | 4 |
| **Scalability** | 8% | 5 | 5 | 5 | 5 | 4 |
| **Reliability** | 8% | 5 | 4 | 4 | 5 | 5 |
| **Compliance** | 5% | 5 | 5 | 4 | 4 | 5 |
| **Support** | 4% | 4 | 4 | 3 | 2 | 5 |
| **Azure Integration** | 3% | 3 | 5 | 3 | 1 | 3 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **SendGrid** | (5×.20)+(4×.15)+(5×.15)+(5×.12)+(5×.10)+(5×.08)+(5×.08)+(5×.05)+(4×.04)+(3×.03) | **4.70** |
| **Postmark** | (5×.20)+(3×.15)+(4×.15)+(5×.12)+(4×.10)+(4×.08)+(5×.08)+(5×.05)+(5×.04)+(3×.03) | **4.30** |
| **Azure Email** | (4×.20)+(4×.15)+(5×.15)+(3×.12)+(3×.10)+(5×.08)+(4×.08)+(5×.05)+(4×.04)+(5×.03) | **4.04** |
| **Mailgun** | (4×.20)+(4×.15)+(4×.15)+(4×.12)+(4×.10)+(5×.08)+(4×.08)+(4×.05)+(3×.04)+(3×.03) | **4.02** |
| **Amazon SES** | (4×.20)+(5×.15)+(3×.15)+(2×.12)+(3×.10)+(5×.08)+(5×.08)+(4×.05)+(2×.04)+(1×.03) | **3.65** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **SendGrid** | 4.70 |
| 2 | Postmark | 4.30 |
| 3 | Azure Communication Services | 4.04 |
| 4 | Mailgun | 4.02 |
| 5 | Amazon SES | 3.65 |

---

## Analysis

### Why SendGrid Wins for ChaufHER

1. **Industry Leader**: Proven at massive scale:
   - Powers email for major companies
   - Excellent inbox placement
   - Strong sender reputation

2. **Free Tier**: 100 emails/day forever:
   - 3,000 emails/month free
   - Sufficient for MVP testing
   - Scales to paid plans seamlessly

3. **Dynamic Templates**: Professional emails easily:
   ```handlebars
   Hi {{rider_name}},

   Your ride on {{ride_date}} at {{ride_time}} is confirmed!

   **Pickup:** {{pickup_address}}
   **Dropoff:** {{dropoff_address}}
   **Driver:** {{driver_name}}
   **Vehicle:** {{vehicle_description}}

   Fare estimate: R{{fare_estimate}}
   ```

4. **Excellent .NET SDK**:
   ```csharp
   var client = new SendGridClient(apiKey);
   var msg = new SendGridMessage
   {
       From = new EmailAddress("rides@chaufher.co.za", "ChaufHER"),
       Subject = "Your Ride is Confirmed",
       TemplateId = "d-xxxxx"
   };
   msg.SetTemplateData(new { rider_name, ride_date, ... });
   await client.SendEmailAsync(msg);
   ```

5. **Comprehensive Analytics**: Visibility into delivery:
   - Open rates
   - Click tracking
   - Bounce handling
   - Spam reports
   - Webhook events

### Azure Communication Services Consideration

Azure Email scored well (4.04) and is attractive for:
- Single-vendor Azure strategy
- Simpler billing consolidation
- Native managed identity auth

For MVP where email features matter, SendGrid's maturity wins.

### When to Reconsider

Consider alternatives if:
- SendGrid pricing becomes prohibitive
- Azure Email templates improve significantly
- Need dedicated IP at lower volume
- Marketing email becomes priority (consider separate service)

---

## Decision

**Selected: SendGrid** for transactional email

### Email Types

| Email Type | Template | Trigger |
|------------|----------|---------|
| Welcome | d-welcome | User registration |
| Ride Confirmation | d-ride-confirmed | Ride booked |
| Driver Assigned | d-driver-assigned | Driver accepts |
| Ride Receipt | d-ride-receipt | Ride completed |
| Password Reset | d-password-reset | Reset requested |
| Driver Application | d-driver-application | Application submitted |
| Payout Confirmation | d-payout | Weekly payout |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        .NET API                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │ EmailService     │────▶│ SendGrid API     │                  │
│  │ (IEmailService)  │     │                  │                  │
│  └──────────────────┘     └────────┬─────────┘                  │
│                                    │                             │
│                                    ▼                             │
│                           ┌──────────────────┐                  │
│                           │ SendGrid         │                  │
│                           │ (Templates,      │                  │
│                           │  Delivery,       │                  │
│                           │  Analytics)      │                  │
│                           └────────┬─────────┘                  │
│                                    │                             │
│                                    ▼                             │
│                           ┌──────────────────┐                  │
│                           │ Webhooks         │                  │
│                           │ (Bounces, Opens) │                  │
│                           └──────────────────┘                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Configuration

```csharp
// appsettings.json
{
  "SendGrid": {
    "ApiKey": "SG.xxx",
    "FromEmail": "rides@chaufher.co.za",
    "FromName": "ChaufHER",
    "Templates": {
      "Welcome": "d-xxx",
      "RideConfirmed": "d-xxx",
      "RideReceipt": "d-xxx",
      "PasswordReset": "d-xxx"
    }
  }
}
```

### Service Implementation

```csharp
public interface IEmailService
{
    Task SendWelcomeEmailAsync(User user);
    Task SendRideConfirmationAsync(Ride ride);
    Task SendRideReceiptAsync(Ride ride);
    Task SendPasswordResetAsync(User user, string resetToken);
}

public class SendGridEmailService : IEmailService
{
    private readonly ISendGridClient _client;
    private readonly SendGridOptions _options;

    public async Task SendRideReceiptAsync(Ride ride)
    {
        var msg = new SendGridMessage
        {
            From = new EmailAddress(_options.FromEmail, _options.FromName),
            TemplateId = _options.Templates.RideReceipt
        };

        msg.AddTo(ride.Rider.Email, ride.Rider.FullName);
        msg.SetTemplateData(new
        {
            rider_name = ride.Rider.FirstName,
            ride_date = ride.CompletedAt?.ToString("dd MMM yyyy"),
            pickup = ride.PickupAddress,
            dropoff = ride.DropoffAddress,
            driver_name = ride.Driver.FullName,
            fare = ride.FinalFare.ToString("C"),
            payment_method = ride.PaymentMethod,
            receipt_number = ride.ReceiptNumber
        });

        await _client.SendEmailAsync(msg);
    }
}
```

### Cost Estimate

| Plan | Emails/Month | Cost |
|------|--------------|------|
| Free | 100/day (3,000/mo) | $0 |
| Essentials | 50,000 | $19.95 |
| Pro | 100,000 | $89.95 |

*MVP likely stays on free tier initially.*

---

## Consequences

### Positive

- Industry-leading deliverability
- Free tier covers MVP needs
- Excellent template system
- Comprehensive analytics
- Strong .NET SDK

### Negative

- Another vendor to manage
- Can get expensive at scale
- Template editor requires web UI

### Neutral

- Team learns SendGrid API
- Webhooks need endpoint setup
- Can migrate to Azure Email if needed

---

## Related Documents

- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)
- [ADR-015: SMS Notifications](015-sms-notifications.md)
- [ADR-017: Background Jobs (Hangfire)](017-background-jobs.md)

---

## References

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid .NET SDK](https://github.com/sendgrid/sendgrid-csharp)
- [SendGrid Dynamic Templates](https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates)
- [SendGrid Pricing](https://sendgrid.com/pricing/)
