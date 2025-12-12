# ADR-017: Background Jobs & Queue – Hangfire vs Alternatives

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps
**Technical Story:** Background job processing for scheduled tasks and async operations

---

## Context

ChaufHER requires background job processing for:
- Driver-rider matching algorithm
- Scheduled ride reminders (1 hour before, 10 minutes before)
- Payment processing retries
- Driver payout batch processing
- Notification delivery (SMS, push, email)
- Report generation
- Data cleanup and archival
- Scheduled ride auto-cancellation

The platform must:
- Process jobs reliably (at-least-once delivery)
- Support scheduled/delayed jobs
- Handle job failures with retries
- Provide visibility into job status
- Scale with increased load
- Integrate with .NET 9 backend

---

## Decision Drivers

1. **.NET Integration** – Native .NET support, minimal friction
2. **Reliability** – Job persistence, failure handling
3. **Scheduling** – Cron-like scheduling, delays
4. **Visibility** – Dashboard, monitoring
5. **Scalability** – Horizontal scaling, workers
6. **Cost** – Infrastructure and licensing costs
7. **Simplicity** – Setup and maintenance effort
8. **Performance** – Job throughput, latency
9. **PostgreSQL Support** – Use existing database
10. **Cloud Native** – Azure service integration

---

## Options Considered

### Option A: Hangfire

.NET background job library with persistence.

**Pros:**
- Native .NET library (first-class support)
- PostgreSQL storage provider
- Excellent dashboard UI
- Fire-and-forget, delayed, recurring jobs
- Automatic retries with backoff
- Job continuations
- Simple setup (NuGet package)
- Active community
- MIT license (core)

**Cons:**
- Dashboard requires Pro license for some features
- Single process by default (can scale)
- Not a true distributed queue
- Job state stored in database (load)
- Limited message patterns

### Option B: Azure Service Bus

Microsoft's enterprise message broker.

**Pros:**
- True distributed messaging
- Topics and subscriptions
- Dead-letter queues
- Sessions for ordering
- At-least-once/exactly-once delivery
- Native Azure integration
- Scales massively
- Geo-redundancy

**Cons:**
- Additional Azure cost
- More complex setup
- Requires separate worker process
- No built-in dashboard
- Learning curve for messaging patterns
- Overkill for simple jobs

### Option C: Azure Queue Storage

Simple Azure queue service.

**Pros:**
- Very cheap ($0.0004/10K operations)
- Simple API
- Reliable delivery
- Azure native
- Easy to understand

**Cons:**
- Basic features only
- No scheduling (need timer trigger)
- No built-in retry logic
- Manual dead-letter handling
- No dashboard
- 64KB message limit

### Option D: MassTransit + RabbitMQ

Open-source message bus abstraction.

**Pros:**
- Powerful messaging patterns
- Saga support
- RabbitMQ battle-tested
- Good .NET integration
- Flexible topologies

**Cons:**
- Requires RabbitMQ infrastructure
- More complex setup
- Steeper learning curve
- Additional operational burden
- Overkill for MVP

### Option E: Quartz.NET

.NET port of Java Quartz scheduler.

**Pros:**
- Mature scheduler
- Cron expressions
- Clustered mode
- PostgreSQL support
- Free and open-source

**Cons:**
- Primarily for scheduling, not queuing
- No built-in dashboard
- More low-level API
- Less active than Hangfire
- Manual job persistence

---

## Weighted Evaluation Matrix

| Criterion | Weight | Hangfire | Service Bus | Queue Storage | MassTransit | Quartz.NET |
|-----------|--------|----------|-------------|---------------|-------------|------------|
| **.NET Integration** | 20% | 5 | 4 | 4 | 4 | 4 |
| **Reliability** | 15% | 4 | 5 | 4 | 5 | 4 |
| **Scheduling** | 15% | 5 | 3 | 2 | 3 | 5 |
| **Visibility** | 12% | 5 | 3 | 2 | 3 | 2 |
| **Scalability** | 10% | 3 | 5 | 5 | 5 | 4 |
| **Cost** | 10% | 5 | 3 | 5 | 3 | 5 |
| **Simplicity** | 8% | 5 | 3 | 4 | 2 | 3 |
| **Performance** | 5% | 4 | 5 | 4 | 5 | 4 |
| **PostgreSQL Support** | 3% | 5 | 1 | 1 | 3 | 5 |
| **Cloud Native** | 2% | 3 | 5 | 5 | 3 | 3 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Hangfire** | (5×.20)+(4×.15)+(5×.15)+(5×.12)+(3×.10)+(5×.10)+(5×.08)+(4×.05)+(5×.03)+(3×.02) | **4.51** |
| **Service Bus** | (4×.20)+(5×.15)+(3×.15)+(3×.12)+(5×.10)+(3×.10)+(3×.08)+(5×.05)+(1×.03)+(5×.02) | **3.79** |
| **Quartz.NET** | (4×.20)+(4×.15)+(5×.15)+(2×.12)+(4×.10)+(5×.10)+(3×.08)+(4×.05)+(5×.03)+(3×.02) | **3.93** |
| **Queue Storage** | (4×.20)+(4×.15)+(2×.15)+(2×.12)+(5×.10)+(5×.10)+(4×.08)+(4×.05)+(1×.03)+(5×.02) | **3.57** |
| **MassTransit** | (4×.20)+(5×.15)+(3×.15)+(3×.12)+(5×.10)+(3×.10)+(2×.08)+(5×.05)+(3×.03)+(3×.02) | **3.72** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Hangfire** | 4.51 |
| 2 | Quartz.NET | 3.93 |
| 3 | Azure Service Bus | 3.79 |
| 4 | MassTransit + RabbitMQ | 3.72 |
| 5 | Azure Queue Storage | 3.57 |

---

## Analysis

### Why Hangfire Wins for ChaufHER

1. **.NET Native**: Built for .NET from the ground up:
   ```csharp
   // Fire-and-forget
   BackgroundJob.Enqueue(() => SendRideConfirmation(rideId));

   // Delayed
   BackgroundJob.Schedule(() => SendReminder(rideId), TimeSpan.FromHours(1));

   // Recurring
   RecurringJob.AddOrUpdate("daily-payouts",
       () => ProcessDriverPayouts(), Cron.Daily);
   ```

2. **PostgreSQL Storage**: Uses existing database:
   - No additional infrastructure
   - Job state persisted reliably
   - Transactional consistency
   - Single backup strategy

3. **Built-in Dashboard**: Visibility out of the box:
   - Job queue status
   - Failed job inspection
   - Manual retry/delete
   - Real-time updates

4. **Simple Setup**: Minutes to production:
   ```csharp
   builder.Services.AddHangfire(config =>
       config.UsePostgreSqlStorage(connectionString));
   builder.Services.AddHangfireServer();
   ```

5. **MVP-Appropriate**: Right-sized for startup:
   - Single server deployment works
   - Can scale workers later
   - No messaging infrastructure
   - Low operational overhead

### Azure Service Bus Consideration

Service Bus scored well (3.79) and is better for:
- High-volume messaging (100K+ messages/day)
- Complex workflows with multiple consumers
- True distributed architecture
- Exactly-once processing requirements

For MVP with ~1000 rides/day, Hangfire is sufficient.

### When to Reconsider

Consider Azure Service Bus if:
- Job volume exceeds 50K/day
- Need pub/sub patterns
- Multiple services consuming same events
- Require exactly-once delivery
- Geographic distribution needed

---

## Decision

**Selected: Hangfire** with PostgreSQL storage

### Job Categories

| Category | Type | Example |
|----------|------|---------|
| **Fire-and-Forget** | Immediate async | Send notification |
| **Delayed** | Future execution | Ride reminder |
| **Recurring** | Scheduled | Daily payouts |
| **Continuation** | Chained jobs | Book → Confirm → Notify |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        .NET API                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │  API Controllers │────▶│ BackgroundJob    │                  │
│  │  (Enqueue Jobs)  │     │ .Enqueue()       │                  │
│  └──────────────────┘     └────────┬─────────┘                  │
│                                    │                             │
│                                    ▼                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Hangfire Server                          │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │ Enqueued   │ │ Scheduled  │ │ Recurring  │           │   │
│  │  │ Queue      │ │ Queue      │ │ Jobs       │           │   │
│  │  └────────────┘ └────────────┘ └────────────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   PostgreSQL                              │   │
│  │  (Job storage: hangfire schema)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Job Implementations

```csharp
public interface IRideJobs
{
    Task SendRideConfirmationAsync(Guid rideId);
    Task SendRideReminderAsync(Guid rideId);
    Task ProcessDriverMatchingAsync(Guid rideId);
    Task HandleRideTimeoutAsync(Guid rideId);
}

public class RideJobs : IRideJobs
{
    public async Task SendRideConfirmationAsync(Guid rideId)
    {
        var ride = await _rideRepository.GetByIdAsync(rideId);
        await _notificationService.SendSmsAsync(ride.Rider.Phone,
            SmsTemplates.RideConfirmed, ride);
        await _notificationService.SendPushAsync(ride.Rider.Id,
            "Ride Confirmed", $"Your ride on {ride.ScheduledTime} is confirmed");
    }

    public async Task SendRideReminderAsync(Guid rideId)
    {
        var ride = await _rideRepository.GetByIdAsync(rideId);
        if (ride.Status == RideStatus.Confirmed)
        {
            await _notificationService.SendSmsAsync(ride.Rider.Phone,
                SmsTemplates.RideReminder, ride);
        }
    }
}
```

### Configuration

```csharp
// Program.cs
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(options => options
        .UseNpgsqlConnection(connectionString)));

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = Environment.ProcessorCount * 2;
    options.Queues = new[] { "critical", "default", "low" };
});

// Dashboard (admin only)
app.MapHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new AdminAuthorizationFilter() }
});
```

### Job Scheduling Examples

```csharp
// When ride is created
public async Task<Ride> CreateRideAsync(CreateRideRequest request)
{
    var ride = await _rideRepository.CreateAsync(request);

    // Immediate: Send confirmation
    BackgroundJob.Enqueue<IRideJobs>(x =>
        x.SendRideConfirmationAsync(ride.Id));

    // Delayed: 1 hour reminder
    var reminderTime = ride.ScheduledTime.AddHours(-1);
    BackgroundJob.Schedule<IRideJobs>(x =>
        x.SendRideReminderAsync(ride.Id), reminderTime);

    // Delayed: 10 min reminder
    var finalReminder = ride.ScheduledTime.AddMinutes(-10);
    BackgroundJob.Schedule<IRideJobs>(x =>
        x.SendRideReminderAsync(ride.Id), finalReminder);

    return ride;
}
```

### Recurring Jobs

```csharp
// Startup configuration
RecurringJob.AddOrUpdate<IPayoutJobs>(
    "process-daily-payouts",
    x => x.ProcessDailyPayoutsAsync(),
    "0 6 * * *", // 6 AM daily
    TimeZoneInfo.FindSystemTimeZoneById("South Africa Standard Time"));

RecurringJob.AddOrUpdate<ICleanupJobs>(
    "cleanup-old-rides",
    x => x.ArchiveCompletedRidesAsync(),
    Cron.Weekly);
```

---

## Consequences

### Positive

- Native .NET integration, minimal learning curve
- Uses existing PostgreSQL (no new infrastructure)
- Excellent dashboard for visibility
- Simple fire-and-forget and scheduling
- MVP-appropriate complexity

### Negative

- Not a true distributed queue
- Database load from job polling
- Dashboard Pro features require license
- Single-server by default

### Neutral

- Can migrate to Service Bus if needed
- Job state queryable in database
- Workers can be scaled horizontally

---

## Related Documents

- [ADR-002: Database (PostgreSQL)](002-database-postgresql.md)
- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)
- [ADR-015: SMS Notifications](015-sms-notifications.md)

---

## References

- [Hangfire Documentation](https://docs.hangfire.io/)
- [Hangfire.PostgreSql](https://github.com/hangfire-postgres/Hangfire.PostgreSql)
- [Background Tasks in .NET](https://learn.microsoft.com/aspnet/core/fundamentals/host/hosted-services)
- [Azure Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/)
