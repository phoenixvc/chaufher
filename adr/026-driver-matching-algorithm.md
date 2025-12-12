# ADR-026: Driver Matching Algorithm

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Product
**Technical Story:** Algorithm for matching riders with available drivers efficiently and fairly

---

## Context

ChaufHER's core function is connecting riders (women and families) with vetted women drivers. The matching algorithm must:

- Find the nearest available driver quickly
- Minimize rider wait times (ETA)
- Ensure fair ride distribution among drivers
- Consider driver preferences and ratings
- Handle variable demand (rush hours, events)
- Support scheduled rides and recurring bookings
- Account for ChaufHER-specific factors (driver-rider trust, school runs)

### Unique ChaufHER Considerations

| Factor | Impact on Matching |
|--------|-------------------|
| **Women-only** | Smaller driver pool than general ride-hail |
| **Trust-focused** | Rider may prefer known drivers |
| **School runs** | Recurring routes, same driver preferred |
| **Safety** | Higher weight on driver rating/verification |
| **Community** | Riders may prefer drivers from their network |

---

## Decision Drivers

1. **Rider Wait Time** – Minimize ETA
2. **Driver Fairness** – Equitable ride distribution
3. **Match Quality** – Rider satisfaction with assigned driver
4. **System Efficiency** – Optimize overall utilization
5. **Scalability** – Handle growth without degradation
6. **Simplicity** – Maintainable algorithm
7. **Flexibility** – Support various ride types
8. **Safety** – Prioritize verified, high-rated drivers
9. **Cost** – Computational efficiency
10. **Transparency** – Explainable matching decisions

---

## Options Considered

### Option A: Nearest Driver (Simple)

Assign the closest available driver.

**Pros:**
- Simplest to implement
- Lowest ETA
- Easy to understand
- Fast computation

**Cons:**
- Unfair to distant drivers (never get rides)
- Ignores driver ratings
- No preference handling
- Can cause driver clustering

### Option B: Weighted Multi-Factor Scoring

Score drivers on multiple factors, assign highest score.

**Pros:**
- Balances multiple objectives
- Considers quality factors
- Flexible weighting
- Fairer distribution

**Cons:**
- More complex to tune
- Harder to explain
- Potential for edge cases
- Requires ongoing optimization

### Option C: Auction/Bidding System

Drivers bid on rides, lowest ETA or highest acceptance wins.

**Pros:**
- Market-driven pricing
- Driver autonomy
- Natural supply/demand balance

**Cons:**
- Slower matching (wait for bids)
- Complex UX
- May disadvantage newer drivers
- Not suitable for safety-focused platform

### Option D: Zone-Based Assignment

Divide city into zones, assign drivers to zones.

**Pros:**
- Predictable coverage
- Easier demand forecasting
- Driver knows their area

**Cons:**
- Rigid boundaries
- Inefficient at zone edges
- Doesn't adapt to real-time demand
- Artificial constraints

### Option E: Machine Learning Optimization

ML model predicts best match based on historical data.

**Pros:**
- Learns optimal matching
- Adapts over time
- Can discover non-obvious patterns

**Cons:**
- Requires significant data
- Black box decisions
- Cold start problem
- Overkill for MVP

---

## Weighted Evaluation Matrix

| Criterion | Weight | Nearest | Multi-Factor | Auction | Zone-Based | ML |
|-----------|--------|---------|--------------|---------|------------|-----|
| **Rider Wait Time** | 20% | 5 | 4 | 3 | 3 | 4 |
| **Driver Fairness** | 15% | 2 | 5 | 3 | 4 | 4 |
| **Match Quality** | 15% | 2 | 5 | 4 | 3 | 5 |
| **System Efficiency** | 12% | 3 | 4 | 4 | 3 | 5 |
| **Scalability** | 10% | 5 | 4 | 3 | 4 | 3 |
| **Simplicity** | 10% | 5 | 3 | 2 | 4 | 1 |
| **Flexibility** | 8% | 2 | 5 | 3 | 2 | 5 |
| **Safety** | 5% | 2 | 5 | 3 | 3 | 4 |
| **Cost** | 3% | 5 | 4 | 3 | 4 | 2 |
| **Transparency** | 2% | 5 | 4 | 3 | 4 | 1 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Multi-Factor** | (4×.20)+(5×.15)+(5×.15)+(4×.12)+(4×.10)+(3×.10)+(5×.08)+(5×.05)+(4×.03)+(4×.02) | **4.29** |
| **Nearest** | (5×.20)+(2×.15)+(2×.15)+(3×.12)+(5×.10)+(5×.10)+(2×.08)+(2×.05)+(5×.03)+(5×.02) | **3.43** |
| **Zone-Based** | (3×.20)+(4×.15)+(3×.15)+(3×.12)+(4×.10)+(4×.10)+(2×.08)+(3×.05)+(4×.03)+(4×.02) | **3.37** |
| **ML** | (4×.20)+(4×.15)+(5×.15)+(5×.12)+(3×.10)+(1×.10)+(5×.08)+(4×.05)+(2×.03)+(1×.02) | **3.69** |
| **Auction** | (3×.20)+(3×.15)+(4×.15)+(4×.12)+(3×.10)+(2×.10)+(3×.08)+(3×.05)+(3×.03)+(3×.02) | **3.18** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Weighted Multi-Factor Scoring** | 4.29 |
| 2 | Machine Learning | 3.69 |
| 3 | Nearest Driver | 3.43 |
| 4 | Zone-Based | 3.37 |
| 5 | Auction/Bidding | 3.18 |

---

## Decision

**Selected: Weighted Multi-Factor Scoring** with configurable weights

### Algorithm Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DRIVER MATCHING FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐     ┌─────────────────┐     ┌─────────────────────────┐   │
│  │ Ride        │────▶│ Filter          │────▶│ Score Remaining         │   │
│  │ Request     │     │ Available       │     │ Drivers                 │   │
│  │             │     │ Drivers         │     │                         │   │
│  └─────────────┘     └─────────────────┘     └───────────┬─────────────┘   │
│                                                          │                  │
│  Filters:                                                │                  │
│  - Online status                         Score factors:  │                  │
│  - Within radius                         - Distance      │                  │
│  - Vehicle type match                    - Rating        │                  │
│  - Not in active ride                    - Acceptance    │                  │
│  - Meets rider preferences               - Recency       │                  │
│                                          - Preference    │                  │
│                                                          │                  │
│                      ┌───────────────────────────────────┘                  │
│                      │                                                      │
│                      ▼                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      RANKING & SELECTION                             │   │
│  │                                                                      │   │
│  │   Driver A: 87.3   Driver B: 82.1   Driver C: 79.5   Driver D: 76.2 │   │
│  │      ↓                                                               │   │
│  │   [SELECTED]                                                         │   │
│  │                                                                      │   │
│  │   If declined → Offer to Driver B                                    │   │
│  │   If all decline → Expand search radius                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Scoring Formula

```
Score = (W_distance × S_distance) +
        (W_rating × S_rating) +
        (W_acceptance × S_acceptance) +
        (W_recency × S_recency) +
        (W_preference × S_preference) +
        (W_fairness × S_fairness)

Where:
- W = Weight (configurable, sum to 1.0)
- S = Normalized score (0-100)
```

### Default Weights

| Factor | Weight | Description |
|--------|--------|-------------|
| **Distance** | 35% | Proximity to pickup (inverse of ETA) |
| **Rating** | 20% | Driver's average rating (4.0-5.0 scale) |
| **Acceptance Rate** | 15% | Historical ride acceptance % |
| **Recency** | 10% | Time since last completed ride |
| **Preference Match** | 10% | Rider's preferred driver match |
| **Fairness** | 10% | Rides today vs. daily average |

### Score Components

#### Distance Score (35%)

```csharp
public double CalculateDistanceScore(double distanceKm, double maxRadiusKm)
{
    // Inverse relationship: closer = higher score
    // Score drops off with distance
    if (distanceKm >= maxRadiusKm)
        return 0;

    // Exponential decay: 1km = 95, 2km = 85, 5km = 60
    return 100 * Math.Exp(-0.15 * distanceKm);
}
```

#### Rating Score (20%)

```csharp
public double CalculateRatingScore(double rating, int totalRatings)
{
    // Minimum ratings threshold for full weight
    const int MIN_RATINGS = 10;
    const double MIN_RATING = 4.0;

    if (totalRatings < MIN_RATINGS)
    {
        // New drivers get benefit of doubt
        return 80;
    }

    // Scale 4.0-5.0 to 0-100
    return Math.Max(0, (rating - MIN_RATING) * 100);
}
```

#### Acceptance Rate Score (15%)

```csharp
public double CalculateAcceptanceScore(double acceptanceRate)
{
    // High acceptance rate rewards reliability
    // Scale 70-100% to 0-100 score
    const double MIN_ACCEPTABLE = 0.70;

    if (acceptanceRate < MIN_ACCEPTABLE)
        return (acceptanceRate / MIN_ACCEPTABLE) * 50; // Penalty

    return 50 + ((acceptanceRate - MIN_ACCEPTABLE) / 0.30) * 50;
}
```

#### Recency Score (10%)

```csharp
public double CalculateRecencyScore(TimeSpan timeSinceLastRide)
{
    // Favor drivers who haven't had a ride recently
    // Prevents ride concentration

    var hours = timeSinceLastRide.TotalHours;

    if (hours < 0.5) return 20;  // Just completed a ride
    if (hours < 1) return 50;
    if (hours < 2) return 75;
    return 100;  // 2+ hours since last ride
}
```

#### Preference Match Score (10%)

```csharp
public double CalculatePreferenceScore(Guid driverId, RiderPreferences prefs)
{
    double score = 50; // Base score

    // Preferred driver (from previous rides)
    if (prefs.PreferredDriverIds.Contains(driverId))
        score += 40;

    // Same driver for recurring rides (school runs)
    if (prefs.RecurringDriverId == driverId)
        score += 50;

    // Blocked driver
    if (prefs.BlockedDriverIds.Contains(driverId))
        return 0;

    return Math.Min(100, score);
}
```

#### Fairness Score (10%)

```csharp
public double CalculateFairnessScore(int ridesToday, double dailyAverage)
{
    // Prevent ride hoarding by top drivers
    // Favor drivers below their daily average

    if (dailyAverage == 0)
        return 100; // New driver

    var ratio = ridesToday / dailyAverage;

    if (ratio < 0.5) return 100;  // Way below average
    if (ratio < 0.8) return 80;
    if (ratio < 1.0) return 60;
    if (ratio < 1.2) return 40;
    return 20;  // Above average, lower priority
}
```

### Complete Matching Service

```csharp
public class DriverMatchingService : IDriverMatchingService
{
    private readonly IDriverLocationService _locationService;
    private readonly IDriverRepository _driverRepository;
    private readonly IRiderPreferencesRepository _preferencesRepository;
    private readonly MatchingWeights _weights;

    public async Task<MatchingResult> FindBestDriverAsync(RideRequest request)
    {
        // Step 1: Get available drivers within radius
        var availableDrivers = await _locationService.GetAvailableDriversAsync(
            request.PickupLocation,
            request.MaxRadiusKm ?? 10.0
        );

        if (!availableDrivers.Any())
        {
            return MatchingResult.NoDriversAvailable();
        }

        // Step 2: Apply filters
        var eligibleDrivers = availableDrivers
            .Where(d => d.IsVerified)
            .Where(d => d.VehicleType == request.VehicleType || request.VehicleType == null)
            .Where(d => !d.IsInActiveRide)
            .ToList();

        if (!eligibleDrivers.Any())
        {
            return MatchingResult.NoEligibleDrivers();
        }

        // Step 3: Get rider preferences
        var preferences = await _preferencesRepository.GetAsync(request.RiderId);

        // Step 4: Score each driver
        var scoredDrivers = new List<ScoredDriver>();

        foreach (var driver in eligibleDrivers)
        {
            var score = CalculateScore(driver, request, preferences);
            scoredDrivers.Add(new ScoredDriver(driver, score));
        }

        // Step 5: Rank by score
        var rankedDrivers = scoredDrivers
            .OrderByDescending(d => d.TotalScore)
            .Take(5) // Keep top 5 for fallback
            .ToList();

        return MatchingResult.Success(rankedDrivers);
    }

    private DriverScore CalculateScore(
        AvailableDriver driver,
        RideRequest request,
        RiderPreferences preferences)
    {
        var scores = new DriverScore
        {
            DistanceScore = CalculateDistanceScore(
                driver.DistanceKm,
                request.MaxRadiusKm ?? 10.0
            ),
            RatingScore = CalculateRatingScore(
                driver.Rating,
                driver.TotalRatings
            ),
            AcceptanceScore = CalculateAcceptanceScore(
                driver.AcceptanceRate
            ),
            RecencyScore = CalculateRecencyScore(
                driver.TimeSinceLastRide
            ),
            PreferenceScore = CalculatePreferenceScore(
                driver.Id,
                preferences
            ),
            FairnessScore = CalculateFairnessScore(
                driver.RidesToday,
                driver.DailyAverageRides
            )
        };

        scores.TotalScore =
            (_weights.Distance * scores.DistanceScore) +
            (_weights.Rating * scores.RatingScore) +
            (_weights.Acceptance * scores.AcceptanceScore) +
            (_weights.Recency * scores.RecencyScore) +
            (_weights.Preference * scores.PreferenceScore) +
            (_weights.Fairness * scores.FairnessScore);

        return scores;
    }
}
```

### Ride Type Variations

| Ride Type | Weight Adjustments |
|-----------|-------------------|
| **Standard** | Default weights |
| **School Run** | Preference +20%, Distance -10% |
| **Premium** | Rating +10%, Fairness -10% |
| **Scheduled** | Acceptance +10%, Recency -10% |
| **Emergency** | Distance +20%, Rating -10% |

```csharp
public MatchingWeights GetWeightsForRideType(RideType type)
{
    return type switch
    {
        RideType.SchoolRun => new MatchingWeights
        {
            Distance = 0.25,
            Rating = 0.20,
            Acceptance = 0.15,
            Recency = 0.10,
            Preference = 0.30,  // Higher for school runs
            Fairness = 0.00    // Less important
        },
        RideType.Emergency => new MatchingWeights
        {
            Distance = 0.55,   // Fastest pickup
            Rating = 0.10,
            Acceptance = 0.20,
            Recency = 0.05,
            Preference = 0.05,
            Fairness = 0.05
        },
        _ => _defaultWeights
    };
}
```

### Driver Location Caching

```csharp
public class DriverLocationService : IDriverLocationService
{
    private readonly IRedisCache _redis;
    private const string GEO_KEY = "driver:locations";

    public async Task UpdateLocationAsync(Guid driverId, GeoLocation location)
    {
        // Store in Redis Geo Set for fast radius queries
        await _redis.GeoAddAsync(GEO_KEY, new GeoEntry
        {
            Longitude = location.Longitude,
            Latitude = location.Latitude,
            Member = driverId.ToString()
        });

        // Set TTL for automatic cleanup of stale locations
        await _redis.KeyExpireAsync($"driver:{driverId}:location", TimeSpan.FromMinutes(5));
    }

    public async Task<List<DriverDistance>> GetDriversInRadiusAsync(
        GeoLocation center,
        double radiusKm)
    {
        // Redis GEORADIUS is O(N+log(M))
        var results = await _redis.GeoRadiusAsync(
            GEO_KEY,
            center.Longitude,
            center.Latitude,
            radiusKm,
            GeoUnit.Kilometers,
            order: Order.Ascending // Nearest first
        );

        return results.Select(r => new DriverDistance
        {
            DriverId = Guid.Parse(r.Member),
            DistanceKm = r.Distance ?? 0
        }).ToList();
    }
}
```

### Dispatch Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Rider     │     │  Matching    │     │   Driver 1   │     │   Driver 2   │
│     App      │     │   Service    │     │              │     │  (Fallback)  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ 1. Request Ride    │                    │                    │
       │───────────────────▶│                    │                    │
       │                    │                    │                    │
       │                    │ 2. Score Drivers   │                    │
       │                    │    (Top 5)         │                    │
       │                    │                    │                    │
       │                    │ 3. Offer to #1     │                    │
       │                    │───────────────────▶│                    │
       │                    │                    │                    │
       │ 4. "Finding        │    15 sec timeout  │                    │
       │    driver..."      │                    │                    │
       │◀───────────────────│                    │                    │
       │                    │                    │                    │
       │                    │ 5. Accept/Decline  │                    │
       │                    │◀───────────────────│                    │
       │                    │                    │                    │
       │                    │ [If Declined]      │                    │
       │                    │ 6. Offer to #2     │                    │
       │                    │────────────────────────────────────────▶│
       │                    │                    │                    │
       │                    │ 7. Accept          │                    │
       │                    │◀────────────────────────────────────────│
       │                    │                    │                    │
       │ 8. Driver Assigned │                    │                    │
       │◀───────────────────│                    │                    │
```

### Timeout & Fallback Configuration

| Stage | Timeout | Action |
|-------|---------|--------|
| Driver Response | 15 seconds | Offer to next driver |
| All Drivers Decline | N/A | Expand radius by 50% |
| Expanded Search Fail | 30 seconds | Notify rider, suggest later |
| Max Attempts | 3 rounds | Cancel with apology |

---

## Performance Considerations

### Benchmarks

| Operation | Target | Method |
|-----------|--------|--------|
| Get drivers in radius | < 10ms | Redis GEORADIUS |
| Score 50 drivers | < 50ms | Parallel scoring |
| Total matching time | < 100ms | Cached metadata |

### Optimization Strategies

1. **Cache driver metadata**: Rating, acceptance rate in Redis
2. **Geo-index**: Redis Geo Set for O(log N) radius queries
3. **Batch scoring**: Parallel score calculation
4. **Pre-filter**: Early elimination of ineligible drivers

---

## Monitoring & Analytics

### Matching Metrics

| Metric | Target | Alert |
|--------|--------|-------|
| Average match time | < 30 seconds | > 60 seconds |
| First driver acceptance | > 70% | < 50% |
| Rider cancellation (no driver) | < 5% | > 10% |
| Driver utilization variance | < 20% | > 40% |

### A/B Testing

```csharp
// Feature flag for weight experiments
if (await _featureManager.IsEnabledAsync("MatchingExperiment_HighFairness"))
{
    weights.Fairness = 0.20;
    weights.Distance = 0.25;
}
```

---

## Consequences

### Positive

- Balances ETA with driver quality
- Fair ride distribution
- Supports ChaufHER-specific needs (school runs, preferences)
- Configurable and tunable
- Transparent scoring

### Negative

- More complex than simple nearest-driver
- Requires weight tuning over time
- May result in slightly longer ETAs initially

### Neutral

- Weights need periodic review
- Monitoring required for fairness
- Can evolve to ML-based in future

---

## Related Documents

- [ADR-003: Real-Time Communication (SignalR)](003-realtime-signalr.md)
- [ADR-004: Caching Strategy (Redis)](004-caching-redis.md)
- [ADR-016: Maps & Geolocation](016-maps-geolocation.md)
- [Architecture Overview](../docs/architecture.md)

---

## References

- [Uber's Matching Algorithm](https://www.uber.com/blog/engineering/)
- [Redis Geo Commands](https://redis.io/docs/data-types/geospatial/)
- [Ride-Hailing Optimization Research](https://arxiv.org/abs/1910.04716)
