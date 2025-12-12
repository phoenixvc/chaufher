# ADR-016: Maps & Geolocation – Google Maps vs Alternatives

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Product
**Technical Story:** Maps and geolocation services for routing, ETAs, and location display

---

## Context

ChaufHER requires maps and geolocation services for:
- Address autocomplete (pickup/dropoff selection)
- Route calculation and distance estimation
- ETA calculations for driver arrival
- Fare estimation based on distance/time
- Map display for ride tracking (Phase 2)
- Geocoding (address to coordinates)
- Reverse geocoding (coordinates to address)

The platform must:
- Provide accurate South African address data
- Calculate realistic ETAs considering traffic
- Support offline-capable geocoding
- Integrate with PWA and .NET backend
- Be cost-effective at scale
- Handle township and informal settlement addresses

---

## Decision Drivers

1. **South Africa Coverage** – Address data quality, POI coverage
2. **Traffic Data** – Real-time traffic for accurate ETAs
3. **Cost** – Per-request pricing at scale
4. **Accuracy** – Route and ETA precision
5. **Integration** – JavaScript SDK, .NET API
6. **Address Autocomplete** – SA address quality
7. **Offline Support** – Fallback capabilities
8. **Performance** – Response times
9. **Township Coverage** – Informal settlement addresses
10. **API Limits** – Rate limits, quotas

---

## Options Considered

### Option A: Google Maps Platform

Industry-leading maps service.

**Pros:**
- Best global coverage and accuracy
- Excellent South Africa data
- Real-time traffic data
- Superior address autocomplete
- Best-in-class JavaScript SDK
- Comprehensive API (Directions, Places, Geocoding)
- Township and informal settlement coverage
- Widely trusted brand
- Extensive documentation

**Cons:**
- Most expensive option
- Complex pricing model
- $200 monthly credit (helps but limited)
- Costs scale quickly with usage
- Terms restrict caching
- Requires credit card

### Option B: Azure Maps

Microsoft's mapping service.

**Pros:**
- Native Azure integration
- Single vendor billing
- Competitive pricing
- Good global coverage
- .NET SDK excellent
- Traffic data included
- Managed identity auth
- No minimum commitment

**Cons:**
- SA coverage not as good as Google
- Address autocomplete weaker
- Township data less complete
- Newer service, less mature
- Fewer POIs in SA
- Community smaller

### Option C: Mapbox

Developer-focused mapping platform.

**Pros:**
- Beautiful, customizable maps
- Good developer experience
- Competitive pricing
- Open-source map styles
- Good JavaScript SDK
- Navigation SDK available
- 50,000 free requests/month

**Cons:**
- SA traffic data limited
- Address autocomplete less accurate for SA
- Township coverage gaps
- POI data from OpenStreetMap (variable quality)
- Fewer SA-specific features

### Option D: HERE Maps

Nokia/Audi/BMW mapping platform.

**Pros:**
- Strong automotive heritage
- Good traffic data
- Enterprise-grade
- Global coverage
- Fleet management features
- Offline maps support

**Cons:**
- SA coverage variable
- Developer experience dated
- Pricing less transparent
- API less modern
- Smaller developer community
- Documentation complex

### Option E: OpenStreetMap + Nominatim

Open-source mapping stack.

**Pros:**
- Free, open data
- No vendor lock-in
- Community-maintained
- Self-hosted option
- Privacy-friendly

**Cons:**
- SA data quality variable
- No traffic data
- Self-hosting complexity
- Address autocomplete poor
- Township coverage inconsistent
- Requires significant infrastructure

---

## Weighted Evaluation Matrix

| Criterion | Weight | Google Maps | Azure Maps | Mapbox | HERE | OSM |
|-----------|--------|-------------|------------|--------|------|-----|
| **SA Coverage** | 20% | 5 | 3 | 3 | 3 | 2 |
| **Traffic Data** | 15% | 5 | 4 | 3 | 4 | 1 |
| **Cost** | 12% | 2 | 4 | 4 | 3 | 5 |
| **Accuracy** | 12% | 5 | 4 | 4 | 4 | 3 |
| **Integration** | 10% | 5 | 5 | 5 | 3 | 2 |
| **Address Autocomplete** | 10% | 5 | 3 | 3 | 3 | 2 |
| **Offline Support** | 8% | 3 | 3 | 4 | 4 | 5 |
| **Performance** | 5% | 5 | 4 | 5 | 4 | 3 |
| **Township Coverage** | 5% | 5 | 2 | 2 | 2 | 3 |
| **API Limits** | 3% | 3 | 4 | 4 | 4 | 5 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Google Maps** | (5×.20)+(5×.15)+(2×.12)+(5×.12)+(5×.10)+(5×.10)+(3×.08)+(5×.05)+(5×.05)+(3×.03) | **4.42** |
| **Azure Maps** | (3×.20)+(4×.15)+(4×.12)+(4×.12)+(5×.10)+(3×.10)+(3×.08)+(4×.05)+(2×.05)+(4×.03) | **3.62** |
| **Mapbox** | (3×.20)+(3×.15)+(4×.12)+(4×.12)+(5×.10)+(3×.10)+(4×.08)+(5×.05)+(2×.05)+(4×.03) | **3.60** |
| **HERE** | (3×.20)+(4×.15)+(3×.12)+(4×.12)+(3×.10)+(3×.10)+(4×.08)+(4×.05)+(2×.05)+(4×.03) | **3.38** |
| **OSM** | (2×.20)+(1×.15)+(5×.12)+(3×.12)+(2×.10)+(2×.10)+(5×.08)+(3×.05)+(3×.05)+(5×.03) | **2.76** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Google Maps Platform** | 4.42 |
| 2 | Azure Maps | 3.62 |
| 3 | Mapbox | 3.60 |
| 4 | HERE Maps | 3.38 |
| 5 | OpenStreetMap | 2.76 |

---

## Analysis

### Why Google Maps Wins for ChaufHER

1. **South Africa Data Quality**: Google has invested heavily in SA:
   - Street View coverage in major cities
   - Township and informal settlement mapping
   - Local business POI data
   - Accurate address parsing (street, suburb, city)

2. **Traffic-Aware ETAs**: Critical for ride-hailing:
   - Real-time traffic data
   - Historical traffic patterns
   - Accurate arrival predictions
   - Customers trust Google ETAs

3. **Address Autocomplete**: Best-in-class for SA:
   - Understands SA address formats
   - Suggests suburbs correctly
   - Handles informal addresses
   - POI search (landmarks, businesses)

4. **User Trust**: Riders and drivers know Google Maps:
   - Familiar interface
   - Proven accuracy
   - Confidence in directions

5. **$200 Monthly Credit**: Helps offset costs:
   - Covers ~28,000 geocoding requests
   - Or ~10,000 directions requests
   - Sufficient for MVP scale

### Cost Management Strategy

Google Maps is expensive, but manageable with optimization:

```
Cost Optimization Tactics:
1. Cache geocoded addresses (within ToS)
2. Use Distance Matrix for batch calculations
3. Client-side SDK where possible ($7 vs $5 per 1000)
4. Throttle autocomplete (debounce typing)
5. Store route geometry (don't re-request)
```

### Azure Maps Fallback

For backend operations where SA precision is less critical:
- Batch geocoding
- Route storage/analysis
- Cost reduction for non-customer-facing

### When to Reconsider

Consider alternatives if:
- Costs exceed budget significantly
- Azure Maps SA coverage improves
- Mapbox adds better SA traffic data
- HERE offers competitive pricing

---

## Decision

**Selected: Google Maps Platform** (primary) + **Azure Maps** (backend fallback)

### API Usage Matrix

| Use Case | Service | API |
|----------|---------|-----|
| Address autocomplete (PWA) | Google | Places Autocomplete |
| Pickup/dropoff geocoding | Google | Geocoding API |
| Route calculation | Google | Directions API |
| ETA estimation | Google | Distance Matrix API |
| Map display (Phase 2) | Google | Maps JavaScript API |
| Batch geocoding | Azure | Azure Maps Geocoding |
| Analytics/reporting | Azure | Azure Maps Route |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PWA Client                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │ Places Autocomplete│     │ Maps JavaScript   │                  │
│  │ (Address Search)  │     │ (Map Display)     │                  │
│  └────────┬─────────┘     └────────┬─────────┘                  │
│           │                        │                             │
└───────────┼────────────────────────┼─────────────────────────────┘
            │                        │
            ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       .NET API Backend                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │ Google Directions │     │ Google Distance   │                  │
│  │ API (Routes)      │     │ Matrix (ETAs)    │                  │
│  └──────────────────┘     └──────────────────┘                  │
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │ Azure Maps       │     │ Address Cache    │                  │
│  │ (Batch/Fallback) │     │ (Redis)          │                  │
│  └──────────────────┘     └──────────────────┘                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Configuration

```csharp
// appsettings.json
{
  "GoogleMaps": {
    "ApiKey": "xxx",
    "Region": "za",
    "Language": "en"
  },
  "AzureMaps": {
    "SubscriptionKey": "xxx",
    "Region": "southafricanorth"
  }
}
```

### Cost Estimate (MVP)

| API | Requests/Month | Cost |
|-----|----------------|------|
| Places Autocomplete | 10,000 | $28.40 |
| Geocoding | 5,000 | $25.00 |
| Directions | 3,000 | $15.00 |
| Distance Matrix | 5,000 | $25.00 |
| **Subtotal** | | $93.40 |
| **Less $200 credit** | | -$93.40 |
| **Total** | | **$0** |

*At MVP scale, $200 credit likely covers usage.*

### Caching Strategy

```csharp
// Cache geocoded addresses for 30 days
public async Task<GeocodingResult> GeocodeAddressAsync(string address)
{
    var cacheKey = $"geocode:{address.ToLowerInvariant().GetHashCode()}";

    var cached = await _cache.GetAsync<GeocodingResult>(cacheKey);
    if (cached != null) return cached;

    var result = await _googleMaps.GeocodeAsync(address);
    await _cache.SetAsync(cacheKey, result, TimeSpan.FromDays(30));

    return result;
}
```

---

## Consequences

### Positive

- Best SA address and traffic data
- Users trust Google Maps accuracy
- Township coverage critical for equity
- $200 credit covers MVP usage
- Comprehensive SDK/API ecosystem

### Negative

- Most expensive at scale
- Vendor lock-in to Google
- Caching restrictions in ToS
- Costs unpredictable with growth

### Neutral

- Team uses familiar Google Maps
- Azure Maps available as fallback
- Can optimize costs with caching

---

## Related Documents

- [ADR-001: Client Technology (PWA)](001-client-technology-flutter-vs-pwa.md)
- [ADR-004: Caching Strategy (Redis)](004-caching-redis.md)
- [ADR-008: Cloud Provider (Azure)](008-cloud-provider-azure.md)

---

## References

- [Google Maps Platform](https://developers.google.com/maps)
- [Google Maps Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
- [Azure Maps Documentation](https://docs.microsoft.com/azure/azure-maps/)
- [Maps Platform Best Practices](https://developers.google.com/maps/optimization-guide)
