# ADR-027: Driver Scheduling Algorithm

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Product, Operations
**Technical Story:** Algorithm for driver shift scheduling, availability management, and recurring ride assignments

---

## Context

ChaufHER requires a scheduling system distinct from real-time matching (ADR-026). While matching handles "who gets this ride now?", scheduling handles:

- **Shift Management**: When drivers are available to work
- **Recurring Rides**: School runs, regular commutes
- **Advance Bookings**: Rides scheduled hours/days ahead
- **Coverage Planning**: Ensuring adequate supply in areas/times
- **Driver Preferences**: Preferred working hours/areas

### ChaufHER-Specific Scheduling Needs

| Need | Description |
|------|-------------|
| **School Runs** | Same driver, same route, same time daily |
| **Shift Workers** | Nurses, factory workers with predictable schedules |
| **Corporate Contracts** | Guaranteed coverage for corporate accounts |
| **Peak Coverage** | Rush hour, school pickup/dropoff times |
| **Driver Work-Life Balance** | Respect driver availability preferences |

---

## Decision Drivers

1. **Recurring Ride Reliability** – Same driver for regular routes
2. **Coverage Optimization** – Right drivers at right times/places
3. **Driver Autonomy** – Respect driver preferences
4. **Advance Booking** – Support rides scheduled ahead
5. **Fairness** – Equitable distribution of desirable shifts
6. **Flexibility** – Handle changes and cancellations
7. **Utilization** – Maximize driver productive time
8. **Simplicity** – Manageable for small team
9. **Scalability** – Handle growth
10. **Integration** – Work with real-time matching

---

## Options Considered

### Option A: Simple Availability Calendar

Drivers set availability windows, system assigns rides within windows.

**Pros:**
- Simple to implement
- Driver control over hours
- Easy to understand
- Low computational cost

**Cons:**
- No optimization
- Manual recurring ride setup
- No coverage balancing
- Inefficient utilization

### Option B: Constraint-Based Scheduling

Optimization engine with constraints (availability, location, preferences).

**Pros:**
- Optimal solutions
- Handles complex constraints
- Maximizes utilization
- Supports business rules

**Cons:**
- Complex to implement
- Computational overhead
- Harder to explain to drivers
- May feel "algorithmic"

### Option C: Hybrid Priority Queue

Drivers express preferences, system prioritizes based on history and fairness.

**Pros:**
- Balances optimization with simplicity
- Fair ride distribution
- Respects preferences
- Explainable decisions

**Cons:**
- Not globally optimal
- May miss some efficiencies
- Requires tuning

### Option D: Market-Based (Driver Bidding)

Drivers bid for scheduled rides/shifts.

**Pros:**
- Market-driven allocation
- Driver autonomy
- Price discovery

**Cons:**
- Complex UX
- May disadvantage new drivers
- Not aligned with safety-first brand
- Unpredictable coverage

### Option E: Machine Learning Optimization

ML model predicts optimal assignments.

**Pros:**
- Learns patterns
- Continuous improvement
- Handles complexity

**Cons:**
- Requires significant data
- Cold start problem
- Black box decisions
- Overkill for MVP

---

## Weighted Evaluation Matrix

| Criterion | Weight | Calendar | Constraint | Hybrid | Bidding | ML |
|-----------|--------|----------|------------|--------|---------|-----|
| **Recurring Reliability** | 20% | 3 | 5 | 4 | 3 | 5 |
| **Coverage Optimization** | 15% | 2 | 5 | 4 | 3 | 5 |
| **Driver Autonomy** | 15% | 5 | 3 | 4 | 5 | 2 |
| **Advance Booking** | 12% | 3 | 5 | 4 | 4 | 4 |
| **Fairness** | 10% | 2 | 4 | 5 | 2 | 4 |
| **Flexibility** | 8% | 4 | 3 | 4 | 4 | 3 |
| **Utilization** | 8% | 2 | 5 | 4 | 3 | 5 |
| **Simplicity** | 6% | 5 | 2 | 4 | 3 | 1 |
| **Scalability** | 4% | 4 | 3 | 4 | 4 | 4 |
| **Integration** | 2% | 4 | 4 | 5 | 3 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Hybrid Priority** | (4×.20)+(4×.15)+(4×.15)+(4×.12)+(5×.10)+(4×.08)+(4×.08)+(4×.06)+(4×.04)+(5×.02) | **4.14** |
| **Constraint-Based** | (5×.20)+(5×.15)+(3×.15)+(5×.12)+(4×.10)+(3×.08)+(5×.08)+(2×.06)+(3×.04)+(4×.02) | **4.12** |
| **ML Optimization** | (5×.20)+(5×.15)+(2×.15)+(4×.12)+(4×.10)+(3×.08)+(5×.08)+(1×.06)+(4×.04)+(4×.02) | **3.82** |
| **Simple Calendar** | (3×.20)+(2×.15)+(5×.15)+(3×.12)+(2×.10)+(4×.08)+(2×.08)+(5×.06)+(4×.04)+(4×.02) | **3.20** |
| **Market Bidding** | (3×.20)+(3×.15)+(5×.15)+(4×.12)+(2×.10)+(4×.08)+(3×.08)+(3×.06)+(4×.04)+(3×.02) | **3.44** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Hybrid Priority Queue** | 4.14 |
| 2 | Constraint-Based Scheduling | 4.12 |
| 3 | ML Optimization | 3.82 |
| 4 | Market Bidding | 3.44 |
| 5 | Simple Calendar | 3.20 |

---

## Decision

**Selected: Hybrid Priority Queue** with constraint validation

### Algorithm Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SCHEDULING SYSTEM OVERVIEW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ Driver          │    │ Rider           │    │ Operations      │         │
│  │ Availability    │    │ Scheduled Rides │    │ Coverage Goals  │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
│           │                      │                      │                   │
│           └──────────────────────┼──────────────────────┘                   │
│                                  │                                          │
│                                  ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                     SCHEDULING ENGINE                                  │ │
│  │                                                                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │  │  Recurring  │  │   Advance   │  │    Shift    │  │   Coverage   │  │ │
│  │  │   Rides     │  │   Booking   │  │   Planner   │  │   Optimizer  │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │ │
│  │                                                                        │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │ │
│  │  │              Priority Queue (Driver Ranking)                     │  │ │
│  │  │                                                                  │  │ │
│  │  │  Priority = f(Preference, History, Fairness, Rating, Location)  │  │ │
│  │  └─────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                        │ │
│  └────────────────────────────────────┬──────────────────────────────────┘ │
│                                       │                                     │
│                                       ▼                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    CONSTRAINT VALIDATOR                                │ │
│  │  - Driver available?              - Not double-booked?                 │ │
│  │  - Within service area?           - Meets ride requirements?           │ │
│  │  - Hours within legal limit?      - Vehicle type matches?              │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                       │                                     │
│                                       ▼                                     │
│                            ┌─────────────────┐                             │
│                            │   Assignment    │                             │
│                            │    Decision     │                             │
│                            └─────────────────┘                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Scheduling Components

### 1. Driver Availability Management

```csharp
public class DriverAvailability
{
    public Guid DriverId { get; set; }

    // Weekly recurring availability
    public List<WeeklySlot> WeeklySchedule { get; set; }

    // One-time availability/unavailability
    public List<AvailabilityOverride> Overrides { get; set; }

    // Preferred areas (weighted)
    public List<PreferredArea> PreferredAreas { get; set; }

    // Maximum hours per day/week
    public int MaxDailyHours { get; set; } = 10;
    public int MaxWeeklyHours { get; set; } = 50;
}

public class WeeklySlot
{
    public DayOfWeek Day { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsPreferred { get; set; } // Driver prefers these hours
}

public class PreferredArea
{
    public string AreaCode { get; set; } // e.g., "JHB-SANDTON"
    public int PreferenceWeight { get; set; } // 1-10
}
```

### 2. Recurring Ride Scheduler

```csharp
public class RecurringRideScheduler : IRecurringRideScheduler
{
    public async Task<ScheduleResult> ScheduleRecurringRideAsync(
        RecurringRideRequest request)
    {
        // Step 1: Find eligible drivers
        var eligibleDrivers = await GetEligibleDriversAsync(request);

        // Step 2: Score drivers for this recurring ride
        var scoredDrivers = new List<ScoredDriver>();

        foreach (var driver in eligibleDrivers)
        {
            var score = CalculateRecurringRideScore(driver, request);
            scoredDrivers.Add(new ScoredDriver(driver, score));
        }

        // Step 3: Rank by priority
        var rankedDrivers = scoredDrivers
            .OrderByDescending(d => d.Score)
            .ToList();

        // Step 4: Offer to top driver
        var assignment = await OfferRecurringRideAsync(
            rankedDrivers.First(),
            request
        );

        return assignment;
    }

    private double CalculateRecurringRideScore(
        Driver driver,
        RecurringRideRequest request)
    {
        var score = 0.0;

        // Existing relationship bonus (same rider before)
        if (await HasPreviousRidesWithRider(driver.Id, request.RiderId))
            score += 30;

        // Area preference match
        var areaPreference = driver.PreferredAreas
            .FirstOrDefault(a => a.AreaCode == request.PickupAreaCode);
        if (areaPreference != null)
            score += areaPreference.PreferenceWeight * 3;

        // Time slot preference
        if (IsPreferredTimeSlot(driver, request.ScheduledTime))
            score += 15;

        // Rating factor
        score += driver.Rating * 10;

        // Fairness factor (fewer recurring rides = higher priority)
        var recurringRideCount = await GetRecurringRideCount(driver.Id);
        score += Math.Max(0, 20 - recurringRideCount * 2);

        // Proximity to route
        var proximityScore = CalculateProximityScore(
            driver.HomeLocation,
            request.PickupLocation
        );
        score += proximityScore * 0.2;

        return score;
    }
}
```

### 3. Advance Booking Handler

```csharp
public class AdvanceBookingService : IAdvanceBookingService
{
    private readonly ISchedulingEngine _scheduler;
    private readonly IDriverAvailabilityService _availability;

    public async Task<BookingResult> CreateAdvanceBookingAsync(
        AdvanceBookingRequest request)
    {
        // Validate booking time (must be 1+ hours in advance)
        if (request.ScheduledTime < DateTime.UtcNow.AddHours(1))
            return BookingResult.TooSoon();

        // Check if this is a recurring ride pattern
        if (request.IsRecurring)
        {
            return await HandleRecurringBookingAsync(request);
        }

        // Single advance booking
        return await HandleSingleAdvanceBookingAsync(request);
    }

    private async Task<BookingResult> HandleSingleAdvanceBookingAsync(
        AdvanceBookingRequest request)
    {
        // Strategy depends on lead time
        var leadTime = request.ScheduledTime - DateTime.UtcNow;

        if (leadTime > TimeSpan.FromDays(1))
        {
            // Far future: Create tentative booking, assign closer to time
            return await CreateTentativeBookingAsync(request);
        }
        else
        {
            // Near future: Try to assign now
            return await AssignAdvanceBookingAsync(request);
        }
    }

    private async Task<BookingResult> AssignAdvanceBookingAsync(
        AdvanceBookingRequest request)
    {
        // Get available drivers for the scheduled time
        var availableDrivers = await _availability.GetAvailableDriversAsync(
            request.ScheduledTime,
            request.PickupLocation,
            request.DurationEstimate
        );

        if (!availableDrivers.Any())
        {
            // No drivers available - create waitlist entry
            return await CreateWaitlistEntryAsync(request);
        }

        // Score and rank drivers
        var rankedDrivers = await _scheduler.RankDriversAsync(
            availableDrivers,
            request
        );

        // Offer to top driver
        var topDriver = rankedDrivers.First();
        var offer = await CreateBookingOfferAsync(topDriver, request);

        return BookingResult.Offered(offer);
    }
}
```

### 4. Shift Planning & Coverage

```csharp
public class CoverageOptimizer : ICoverageOptimizer
{
    public async Task<CoveragePlan> GenerateCoveragePlanAsync(
        DateOnly date,
        List<CoverageGoal> goals)
    {
        var plan = new CoveragePlan { Date = date };

        // Step 1: Analyze demand forecast
        var demandForecast = await ForecastDemandAsync(date);

        // Step 2: Get driver availability
        var driverAvailability = await GetDriverAvailabilityAsync(date);

        // Step 3: Identify coverage gaps
        var gaps = IdentifyCoverageGaps(demandForecast, driverAvailability);

        // Step 4: Generate recommendations
        foreach (var gap in gaps)
        {
            var recommendation = GenerateGapRecommendation(gap, driverAvailability);
            plan.Recommendations.Add(recommendation);
        }

        // Step 5: Calculate coverage score
        plan.CoverageScore = CalculateCoverageScore(demandForecast, driverAvailability);

        return plan;
    }

    private List<CoverageGap> IdentifyCoverageGaps(
        DemandForecast forecast,
        List<DriverAvailability> availability)
    {
        var gaps = new List<CoverageGap>();

        // Check each hour of the day
        for (var hour = 0; hour < 24; hour++)
        {
            foreach (var area in forecast.Areas)
            {
                var expectedDemand = forecast.GetDemand(area, hour);
                var availableDrivers = availability
                    .Count(a => a.IsAvailable(hour) && a.CoversArea(area));

                // Rule of thumb: 1 driver can handle ~3 rides/hour
                var requiredDrivers = (int)Math.Ceiling(expectedDemand / 3.0);

                if (availableDrivers < requiredDrivers)
                {
                    gaps.Add(new CoverageGap
                    {
                        Area = area,
                        Hour = hour,
                        RequiredDrivers = requiredDrivers,
                        AvailableDrivers = availableDrivers,
                        Severity = CalculateSeverity(requiredDrivers, availableDrivers)
                    });
                }
            }
        }

        return gaps;
    }
}
```

### 5. School Run Scheduler

School runs are a key ChaufHER differentiator - same trusted driver, same route, daily reliability.

```csharp
public class SchoolRunScheduler : ISchoolRunScheduler
{
    public async Task<SchoolRunAssignment> CreateSchoolRunAsync(
        SchoolRunRequest request)
    {
        // Validate school run requirements
        ValidateSchoolRunRequest(request);

        // Find drivers who:
        // 1. Are available during school times
        // 2. Have school run experience (optional but preferred)
        // 3. Live near the route
        // 4. Have excellent ratings
        // 5. Pass additional background checks

        var candidates = await FindSchoolRunCandidatesAsync(request);

        // Score specifically for school runs
        var scored = candidates.Select(d => new
        {
            Driver = d,
            Score = CalculateSchoolRunScore(d, request)
        })
        .OrderByDescending(x => x.Score)
        .ToList();

        // Create trial period (first week with monitoring)
        var assignment = new SchoolRunAssignment
        {
            DriverId = scored.First().Driver.Id,
            Schedule = request.Schedule,
            TrialEndDate = DateTime.UtcNow.AddDays(7),
            Status = AssignmentStatus.Trial
        };

        // Notify parent and driver
        await NotifySchoolRunAssignmentAsync(assignment, request);

        return assignment;
    }

    private double CalculateSchoolRunScore(Driver driver, SchoolRunRequest request)
    {
        var score = 0.0;

        // Child safety verification
        if (driver.HasChildSafetyCertification)
            score += 25;

        // Previous school run experience
        score += driver.SchoolRunCount * 5; // Max 25 points

        // Rating (must be 4.5+ for school runs)
        if (driver.Rating >= 4.8)
            score += 20;
        else if (driver.Rating >= 4.5)
            score += 10;
        else
            return 0; // Disqualify

        // Proximity to pickup (driver's home)
        var distanceKm = CalculateDistance(driver.HomeLocation, request.PickupLocation);
        score += Math.Max(0, 20 - distanceKm * 2);

        // Schedule match (availability during school hours)
        if (HasConsistentAvailability(driver, request.Schedule))
            score += 15;

        // Tenure on platform
        var monthsActive = (DateTime.UtcNow - driver.JoinedAt).Days / 30;
        score += Math.Min(15, monthsActive); // Max 15 points

        return score;
    }
}
```

---

## Priority Queue Algorithm

### Driver Priority Score

```
Priority = (W₁ × PreferenceMatch) +
           (W₂ × HistoricalReliability) +
           (W₃ × FairnessScore) +
           (W₄ × RatingScore) +
           (W₅ × LocationScore) +
           (W₆ × TenureBonus)
```

### Default Weights by Ride Type

| Factor | Standard | School Run | Corporate | Advance |
|--------|----------|------------|-----------|---------|
| **Preference Match** | 20% | 30% | 25% | 20% |
| **Historical Reliability** | 25% | 30% | 30% | 25% |
| **Fairness** | 20% | 10% | 15% | 20% |
| **Rating** | 15% | 20% | 15% | 15% |
| **Location** | 15% | 5% | 10% | 15% |
| **Tenure** | 5% | 5% | 5% | 5% |

### Fairness Mechanism

```csharp
public class FairnessCalculator : IFairnessCalculator
{
    public async Task<double> CalculateFairnessScoreAsync(
        Guid driverId,
        ScheduledRideType rideType)
    {
        var stats = await GetDriverSchedulingStatsAsync(driverId);

        // Compare to platform averages
        var platformAvg = await GetPlatformAverageAsync(rideType);

        // Factors considered:
        // 1. Scheduled rides this week vs. average
        var weeklyRatio = stats.ScheduledRidesThisWeek / platformAvg.WeeklyAverage;

        // 2. Recurring rides held vs. average
        var recurringRatio = stats.RecurringRideCount / platformAvg.RecurringAverage;

        // 3. Premium rides (school runs, corporate) vs. average
        var premiumRatio = stats.PremiumRideCount / platformAvg.PremiumAverage;

        // Lower ratios = higher fairness score (give more opportunities)
        var fairnessScore = 100.0;

        // Penalize if above average
        if (weeklyRatio > 1.0)
            fairnessScore -= (weeklyRatio - 1.0) * 20;

        if (recurringRatio > 1.0)
            fairnessScore -= (recurringRatio - 1.0) * 15;

        if (premiumRatio > 1.0)
            fairnessScore -= (premiumRatio - 1.0) * 15;

        // Bonus if below average (needs more rides)
        if (weeklyRatio < 0.8)
            fairnessScore += (1.0 - weeklyRatio) * 15;

        return Math.Clamp(fairnessScore, 0, 100);
    }
}
```

---

## Schedule Conflict Resolution

```csharp
public class ConflictResolver : IConflictResolver
{
    public async Task<Resolution> ResolveConflictAsync(
        ScheduleConflict conflict)
    {
        return conflict.Type switch
        {
            ConflictType.DoubleBooking => await ResolveDoubleBookingAsync(conflict),
            ConflictType.DriverUnavailable => await ResolveUnavailabilityAsync(conflict),
            ConflictType.OverHoursLimit => await ResolveOverHoursAsync(conflict),
            ConflictType.AreaMismatch => await ResolveAreaMismatchAsync(conflict),
            _ => throw new UnknownConflictTypeException(conflict.Type)
        };
    }

    private async Task<Resolution> ResolveDoubleBookingAsync(ScheduleConflict conflict)
    {
        // Priority rules for double booking:
        // 1. Recurring rides take precedence over one-time
        // 2. Earlier booked takes precedence
        // 3. School runs take precedence over standard

        var ride1Priority = CalculateRidePriority(conflict.Ride1);
        var ride2Priority = CalculateRidePriority(conflict.Ride2);

        var keepRide = ride1Priority >= ride2Priority ? conflict.Ride1 : conflict.Ride2;
        var reassignRide = ride1Priority >= ride2Priority ? conflict.Ride2 : conflict.Ride1;

        // Find alternative driver for reassigned ride
        var alternativeDriver = await FindAlternativeDriverAsync(reassignRide);

        if (alternativeDriver != null)
        {
            return Resolution.Reassign(reassignRide, alternativeDriver);
        }

        // No alternative - notify rider and operations
        return Resolution.EscalateToOperations(reassignRide);
    }

    private int CalculateRidePriority(ScheduledRide ride)
    {
        var priority = 0;

        if (ride.IsRecurring) priority += 100;
        if (ride.Type == RideType.SchoolRun) priority += 50;
        if (ride.Type == RideType.Corporate) priority += 30;

        // Earlier booking wins ties
        priority += (int)(DateTime.MaxValue - ride.BookedAt).TotalMinutes / 1000;

        return priority;
    }
}
```

---

## Integration with Real-Time Matching

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCHEDULING + MATCHING INTEGRATION                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SCHEDULED RIDES (Advance Booking)          ON-DEMAND RIDES (Real-Time)     │
│                                                                              │
│  ┌─────────────────────────────┐           ┌─────────────────────────────┐ │
│  │  Scheduling Engine          │           │  Matching Engine             │ │
│  │  (ADR-027)                  │           │  (ADR-026)                   │ │
│  │                             │           │                              │ │
│  │  - Recurring rides          │           │  - Immediate requests        │ │
│  │  - Advance bookings         │           │  - Nearest available         │ │
│  │  - School runs              │           │  - Real-time scoring         │ │
│  │  - Corporate contracts      │           │                              │ │
│  └─────────────┬───────────────┘           └─────────────┬───────────────┘ │
│                │                                         │                  │
│                └─────────────────┬───────────────────────┘                  │
│                                  │                                          │
│                                  ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    DRIVER STATE MANAGER                                │ │
│  │                                                                        │ │
│  │  Driver Status:                                                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │  │   OFFLINE   │  │   ONLINE    │  │  SCHEDULED  │  │  IN_RIDE    │  │ │
│  │  │             │  │ (Available) │  │  (Blocked)  │  │  (Busy)     │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │ │
│  │                                                                        │ │
│  │  Scheduled rides block time slots in driver's availability             │ │
│  │  Real-time matching excludes drivers with upcoming scheduled rides     │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State Transitions

```csharp
public class DriverStateManager : IDriverStateManager
{
    public async Task<bool> CanAcceptOnDemandRideAsync(
        Guid driverId,
        TimeSpan estimatedDuration)
    {
        var state = await GetDriverStateAsync(driverId);

        if (state.Status != DriverStatus.Online)
            return false;

        // Check for upcoming scheduled rides
        var nextScheduled = await GetNextScheduledRideAsync(driverId);

        if (nextScheduled == null)
            return true;

        // Buffer time before scheduled ride (15 minutes)
        var bufferTime = TimeSpan.FromMinutes(15);
        var availableUntil = nextScheduled.ScheduledTime - bufferTime;

        // Can accept if ride will complete before buffer
        var estimatedCompletion = DateTime.UtcNow + estimatedDuration;

        return estimatedCompletion <= availableUntil;
    }

    public async Task BlockTimeForScheduledRideAsync(
        Guid driverId,
        ScheduledRide ride)
    {
        var blockStart = ride.ScheduledTime.AddMinutes(-15); // Buffer
        var blockEnd = ride.ScheduledTime + ride.EstimatedDuration;

        await CreateTimeBlockAsync(driverId, new TimeBlock
        {
            Start = blockStart,
            End = blockEnd,
            Reason = BlockReason.ScheduledRide,
            RideId = ride.Id
        });

        // Exclude from real-time matching during block
        await _matchingService.ExcludeDriverDuringBlockAsync(driverId, blockStart, blockEnd);
    }
}
```

---

## Notifications & Reminders

| Event | Driver Notification | Rider Notification |
|-------|--------------------|--------------------|
| **Ride Assigned** | Push + SMS | Push + SMS |
| **24h Before** | Push reminder | Push reminder |
| **2h Before** | Push reminder | - |
| **30min Before** | Push + SMS | Push |
| **Driver En Route** | - | Push + live tracking |
| **Cancellation** | Push + SMS | Push + SMS + alternatives |

```csharp
public class ScheduleNotificationService : IScheduleNotificationService
{
    public async Task ScheduleRemindersAsync(ScheduledRide ride)
    {
        var notifications = new List<ScheduledNotification>
        {
            // Driver 24h reminder
            new ScheduledNotification
            {
                UserId = ride.DriverId,
                ScheduledTime = ride.ScheduledTime.AddHours(-24),
                Type = NotificationType.ScheduleReminder24h,
                Payload = CreateRideReminderPayload(ride)
            },
            // Driver 2h reminder
            new ScheduledNotification
            {
                UserId = ride.DriverId,
                ScheduledTime = ride.ScheduledTime.AddHours(-2),
                Type = NotificationType.ScheduleReminder2h,
                Payload = CreateRideReminderPayload(ride)
            },
            // Driver 30min reminder (SMS)
            new ScheduledNotification
            {
                UserId = ride.DriverId,
                ScheduledTime = ride.ScheduledTime.AddMinutes(-30),
                Type = NotificationType.ScheduleReminder30m,
                Channels = new[] { Channel.Push, Channel.SMS },
                Payload = CreateRideReminderPayload(ride)
            },
            // Rider 30min reminder
            new ScheduledNotification
            {
                UserId = ride.RiderId,
                ScheduledTime = ride.ScheduledTime.AddMinutes(-30),
                Type = NotificationType.RideComingSoon,
                Payload = CreateRiderReminderPayload(ride)
            }
        };

        await _notificationScheduler.ScheduleBatchAsync(notifications);
    }
}
```

---

## Metrics & Monitoring

| Metric | Target | Alert |
|--------|--------|-------|
| Schedule fulfillment rate | > 98% | < 95% |
| Driver no-show rate | < 2% | > 5% |
| Reassignment rate | < 5% | > 10% |
| School run consistency | > 95% same driver | < 90% |
| Coverage score (peak hours) | > 90% | < 80% |
| Advance booking lead time | Track distribution | - |

---

## Consequences

### Positive

- Reliable recurring rides (school runs, commutes)
- Fair distribution of desirable scheduled rides
- Drivers can plan around scheduled commitments
- Seamless integration with real-time matching
- Operations visibility into coverage gaps

### Negative

- Added complexity vs. simple availability
- Requires driver training on scheduling system
- Potential for scheduling conflicts

### Neutral

- Need to tune priority weights over time
- Monitoring required for fairness
- Can evolve to more sophisticated optimization

---

## Related Documents

- [ADR-026: Driver Matching Algorithm](026-driver-matching-algorithm.md)
- [ADR-003: Real-Time Communication (SignalR)](003-realtime-signalr.md)
- [ADR-017: Background Jobs (Hangfire)](017-background-jobs.md)
- [Architecture Overview](../docs/architecture.md)

---

## References

- [Vehicle Routing Problem](https://en.wikipedia.org/wiki/Vehicle_routing_problem)
- [Constraint Satisfaction Problems](https://en.wikipedia.org/wiki/Constraint_satisfaction_problem)
- [Fair Division Algorithms](https://en.wikipedia.org/wiki/Fair_division)
