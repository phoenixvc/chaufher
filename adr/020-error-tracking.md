# ADR-020: Error Tracking – Sentry vs Application Insights

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering
**Technical Story:** Client and server-side error tracking for debugging and reliability

---

## Context

ChaufHER requires error tracking for:
- PWA client-side JavaScript errors
- .NET API exceptions
- Unhandled errors and crashes
- Performance issues detection
- User session context for debugging
- Release tracking and regression detection

The platform must:
- Capture errors from both PWA and API
- Provide stack traces with source maps
- Group similar errors intelligently
- Alert on new/regression errors
- Integrate with development workflow
- Not impact application performance

---

## Decision Drivers

1. **Client-Side Support** – PWA/JavaScript error capture
2. **Server-Side Support** – .NET exception tracking
3. **Azure Integration** – Existing monitoring stack
4. **Developer Experience** – Issue investigation UX
5. **Cost** – Pricing at scale
6. **Alerting** – Notification on errors
7. **Release Tracking** – Associate errors with releases
8. **Performance** – Low overhead
9. **Source Maps** – Readable stack traces
10. **Workflow Integration** – GitHub, Linear integration

---

## Options Considered

### Option A: Sentry

Leading error tracking platform.

**Pros:**
- Best-in-class error tracking
- Excellent JavaScript/PWA support
- Good .NET SDK
- Intelligent error grouping
- Release tracking
- Source map support
- GitHub integration
- Performance monitoring
- Session replay (Pro)
- 5,000 errors/month free

**Cons:**
- Another vendor to manage
- Pro features require paid plan
- Can be expensive at scale
- Separate from Azure monitoring

### Option B: Application Insights (Extend ADR-013)

Use Azure Application Insights for error tracking.

**Pros:**
- Already selected for monitoring (ADR-013)
- Single platform for all telemetry
- Native Azure integration
- No additional vendor
- .NET auto-instrumentation
- Cost included in monitoring
- Smart detection

**Cons:**
- Client-side JS SDK less mature
- Error grouping not as good as Sentry
- No session replay
- Release tracking basic
- Source maps require setup
- Less error-focused UX

### Option C: Raygun

Error and performance monitoring.

**Pros:**
- Good error tracking
- Crash reporting
- User tracking
- Real user monitoring

**Cons:**
- Less popular than Sentry
- Smaller community
- Higher price point
- Less workflow integration

### Option D: Bugsnag

Error monitoring platform.

**Pros:**
- Stability scoring
- Good mobile support
- Release health tracking
- Workflow integrations

**Cons:**
- More mobile-focused
- Expensive
- Less PWA-specific
- Smaller ecosystem

---

## Weighted Evaluation Matrix

| Criterion | Weight | Sentry | App Insights | Raygun | Bugsnag |
|-----------|--------|--------|--------------|--------|---------|
| **Client-Side Support** | 20% | 5 | 3 | 4 | 4 |
| **Server-Side Support** | 15% | 5 | 5 | 4 | 4 |
| **Azure Integration** | 15% | 3 | 5 | 3 | 3 |
| **Developer Experience** | 15% | 5 | 3 | 4 | 4 |
| **Cost** | 10% | 4 | 5 | 3 | 3 |
| **Alerting** | 8% | 5 | 4 | 4 | 4 |
| **Release Tracking** | 7% | 5 | 3 | 4 | 5 |
| **Performance** | 4% | 5 | 5 | 4 | 4 |
| **Source Maps** | 3% | 5 | 4 | 4 | 4 |
| **Workflow Integration** | 3% | 5 | 3 | 3 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Sentry** | (5×.20)+(5×.15)+(3×.15)+(5×.15)+(4×.10)+(5×.08)+(5×.07)+(5×.04)+(5×.03)+(5×.03) | **4.55** |
| **App Insights** | (3×.20)+(5×.15)+(5×.15)+(3×.15)+(5×.10)+(4×.08)+(3×.07)+(5×.04)+(4×.03)+(3×.03) | **3.94** |
| **Bugsnag** | (4×.20)+(4×.15)+(3×.15)+(4×.15)+(3×.10)+(4×.08)+(5×.07)+(4×.04)+(4×.03)+(4×.03) | **3.86** |
| **Raygun** | (4×.20)+(4×.15)+(3×.15)+(4×.15)+(3×.10)+(4×.08)+(4×.07)+(4×.04)+(4×.03)+(3×.03) | **3.73** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Sentry** | 4.55 |
| 2 | Application Insights | 3.94 |
| 3 | Bugsnag | 3.86 |
| 4 | Raygun | 3.73 |

---

## Analysis

### Why Sentry Wins for ChaufHER

1. **PWA Excellence**: Best JavaScript error tracking:
   - Automatic error capture
   - Source map upload
   - Breadcrumbs for context
   - Session context
   - User feedback widget

2. **Intelligent Grouping**: Reduces noise:
   - Similar errors grouped automatically
   - Fingerprinting for custom grouping
   - Regression detection
   - First seen / last seen tracking

3. **Developer Experience**: Fast debugging:
   - Stack traces with source context
   - Git commit integration
   - Suspect commits identification
   - Linear/GitHub issue creation

4. **Free Tier**: Sufficient for MVP:
   - 5,000 errors/month
   - 1 user
   - 30-day retention

### Hybrid Approach

Use both Sentry and Application Insights:
- **Sentry**: Client-side (PWA) error tracking
- **Application Insights**: Server-side (.NET) already configured

This leverages each tool's strengths.

### When to Reconsider

Consider consolidating to Application Insights if:
- Sentry costs become significant
- App Insights JavaScript SDK improves
- Team prefers single-vendor approach

---

## Decision

**Selected: Sentry** for PWA client + **Application Insights** for .NET API

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Error Tracking Strategy                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐          ┌──────────────────┐            │
│  │     PWA App      │          │    .NET API      │            │
│  │  (JavaScript)    │          │   (Backend)      │            │
│  └────────┬─────────┘          └────────┬─────────┘            │
│           │                             │                       │
│           ▼                             ▼                       │
│  ┌──────────────────┐          ┌──────────────────┐            │
│  │     Sentry       │          │ Application      │            │
│  │ (Client Errors)  │          │ Insights         │            │
│  │                  │          │ (Server Errors)  │            │
│  └────────┬─────────┘          └────────┬─────────┘            │
│           │                             │                       │
│           └──────────┬──────────────────┘                      │
│                      ▼                                          │
│           ┌──────────────────┐                                 │
│           │   Alerting       │                                 │
│           │  (Slack/Email)   │                                 │
│           └──────────────────┘                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### PWA Sentry Setup

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Set user context
export function setUser(user: User) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

// Manual error capture
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}
```

### .NET Application Insights (Already configured per ADR-013)

```csharp
// Exceptions automatically captured
// Additional context via TelemetryClient
public class RideService
{
    private readonly TelemetryClient _telemetry;

    public async Task<Ride> CreateRideAsync(CreateRideRequest request)
    {
        try
        {
            // ... business logic
        }
        catch (Exception ex)
        {
            _telemetry.TrackException(ex, new Dictionary<string, string>
            {
                ["RiderId"] = request.RiderId.ToString(),
                ["PickupAddress"] = request.PickupAddress
            });
            throw;
        }
    }
}
```

### Alert Configuration

| Error Type | Threshold | Channel |
|------------|-----------|---------|
| New issue (Sentry) | 1 occurrence | Slack |
| Regression (Sentry) | 1 occurrence | Slack |
| High volume | 100 in 1 hour | Slack + Email |
| Critical (payment/auth) | 1 occurrence | Slack + SMS |

### Cost Estimate

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Sentry | Developer (free) | $0 |
| App Insights | Per ADR-013 | Included |
| **Total** | | **$0** |

---

## Consequences

### Positive

- Best-in-class PWA error tracking with Sentry
- Intelligent error grouping reduces noise
- Source maps provide readable stack traces
- Release tracking identifies regressions
- Free tier sufficient for MVP

### Negative

- Two error tracking systems to monitor
- Sentry is another vendor/account
- May need paid tier at scale

### Neutral

- Team learns Sentry SDK
- Errors visible in two dashboards
- Can consolidate later if needed

---

## Related Documents

- [ADR-001: Client Technology (PWA)](001-client-technology-flutter-vs-pwa.md)
- [ADR-013: Monitoring & Observability](013-monitoring-observability.md)
- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)

---

## References

- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry JavaScript SDK](https://docs.sentry.io/platforms/javascript/)
- [Sentry .NET SDK](https://docs.sentry.io/platforms/dotnet/)
- [Application Insights Exception Tracking](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-exceptions)
