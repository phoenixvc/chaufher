# ADR-004: Caching Strategy – Redis

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Backend Team
**Technical Story:** Caching layer selection for performance and session management

---

## Context

ChaufHER requires a caching layer for:
- Session state management (user sessions across requests)
- API response caching (reduce database load)
- Rate limiting (protect API from abuse)
- Distributed locking (prevent race conditions in booking)
- Real-time data caching (driver locations, availability status)
- Queue-like operations (ride matching, notifications)

The solution must:
- Support distributed deployment (multiple API instances)
- Provide low-latency access (<5ms)
- Handle cache invalidation reliably
- Integrate with .NET backend
- Scale with traffic growth

---

## Decision Drivers

1. **Performance** – Sub-millisecond read latency
2. **Distributed Support** – Shared state across multiple API instances
3. **Azure Native** – Managed service for operational simplicity
4. **.NET Integration** – Strong client libraries and patterns
5. **Data Structures** – Support for strings, hashes, lists, sets, sorted sets
6. **Persistence** – Optional durability for critical data
7. **Cost** – Predictable pricing within budget
8. **High Availability** – Clustering and replication options
9. **Operational Simplicity** – Managed service preferred
10. **Feature Set** – Pub/sub, Lua scripting, transactions

---

## Options Considered

### Option A: Azure Cache for Redis

Fully managed Redis service on Azure with built-in HA, clustering, and geo-replication.

**Pros:**
- Native Redis protocol compatibility
- Fully managed with automatic patching
- Built-in clustering for horizontal scaling
- Geo-replication for disaster recovery
- Private endpoint support (VNet integration)
- Azure AD authentication option
- Multiple tiers (Basic, Standard, Premium, Enterprise)
- Strong .NET support via StackExchange.Redis

**Cons:**
- Higher cost than self-managed Redis
- Limited to Redis feature set (no modules in lower tiers)
- Premium tier required for clustering
- Enterprise tier needed for Redis modules

### Option B: Azure Cosmos DB (as cache)

Using Cosmos DB's low-latency reads as a caching layer.

**Pros:**
- Multi-region replication built-in
- Guaranteed low latency (<10ms)
- Automatic scaling (serverless option)
- Already evaluated for primary database

**Cons:**
- Higher cost per operation than Redis
- Not designed as a cache (overkill)
- No native cache patterns (TTL via document expiry)
- RU-based pricing unpredictable for cache workloads
- Missing Redis data structures

### Option C: Memcached (Azure or self-hosted)

Simple, high-performance distributed caching system.

**Pros:**
- Extremely fast for simple key-value
- Multi-threaded (good CPU utilization)
- Simple protocol, low overhead
- Lower memory footprint than Redis

**Cons:**
- No managed Azure service
- Limited data types (strings only)
- No persistence or replication
- No pub/sub or advanced features
- Requires self-management on VMs or containers

### Option D: NCache

.NET-native distributed caching solution.

**Pros:**
- Built specifically for .NET
- Strong ASP.NET Core integration
- SQL-like querying of cached data
- Object caching without serialization overhead

**Cons:**
- Smaller community than Redis
- Licensing costs (enterprise features)
- Less ecosystem support
- Limited Azure marketplace presence
- Team unfamiliar with product

### Option E: In-Memory Caching (IMemoryCache)

Built-in ASP.NET Core in-process caching.

**Pros:**
- Zero additional infrastructure
- Fastest possible access (in-process)
- No serialization overhead
- Built into .NET

**Cons:**
- Not distributed (each instance has separate cache)
- Lost on app restart
- Doesn't scale with multiple instances
- No persistence
- Limited for production distributed systems

---

## Weighted Evaluation Matrix

| Criterion | Weight | Azure Redis | Cosmos DB | Memcached | NCache | IMemoryCache |
|-----------|--------|-------------|-----------|-----------|--------|--------------|
| **Performance** | 18% | 5 | 4 | 5 | 5 | 5 |
| **Distributed Support** | 15% | 5 | 5 | 4 | 5 | 1 |
| **Azure Native** | 15% | 5 | 5 | 2 | 3 | 5 |
| **.NET Integration** | 12% | 5 | 4 | 4 | 5 | 5 |
| **Data Structures** | 10% | 5 | 3 | 2 | 4 | 3 |
| **Persistence** | 8% | 5 | 5 | 1 | 5 | 1 |
| **Cost** | 8% | 3 | 2 | 4 | 3 | 5 |
| **High Availability** | 6% | 5 | 5 | 2 | 4 | 1 |
| **Operational Simplicity** | 5% | 5 | 5 | 2 | 3 | 5 |
| **Feature Set** | 3% | 5 | 3 | 2 | 4 | 2 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure Redis** | (5×.18)+(5×.15)+(5×.15)+(5×.12)+(5×.10)+(5×.08)+(3×.08)+(5×.06)+(5×.05)+(5×.03) | **4.84** |
| **Cosmos DB** | (4×.18)+(5×.15)+(5×.15)+(4×.12)+(3×.10)+(5×.08)+(2×.08)+(5×.06)+(5×.05)+(3×.03) | **4.20** |
| **NCache** | (5×.18)+(5×.15)+(3×.15)+(5×.12)+(4×.10)+(5×.08)+(3×.08)+(4×.06)+(3×.05)+(4×.03) | **4.25** |
| **Memcached** | (5×.18)+(4×.15)+(2×.15)+(4×.12)+(2×.10)+(1×.08)+(4×.08)+(2×.06)+(2×.05)+(2×.03) | **3.16** |
| **IMemoryCache** | (5×.18)+(1×.15)+(5×.15)+(5×.12)+(3×.10)+(1×.08)+(5×.08)+(1×.06)+(5×.05)+(2×.03) | **3.55** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Azure Cache for Redis** | 4.84 |
| 2 | NCache | 4.25 |
| 3 | Cosmos DB | 4.20 |
| 4 | IMemoryCache | 3.55 |
| 5 | Memcached | 3.16 |

---

## Analysis

### Why Azure Cache for Redis Wins for ChaufHER

1. **Industry Standard**: Redis is the de facto standard for distributed caching. Massive community, documentation, and proven patterns.

2. **Rich Data Structures**: ChaufHER can leverage:
   - **Hashes**: Store driver availability states
   - **Sorted Sets**: Leaderboards, proximity-based driver matching
   - **Lists**: Notification queues
   - **Sets**: Track active rides, online drivers
   - **Pub/Sub**: Real-time event distribution

3. **Distributed Locking**: Redis `SETNX` pattern prevents double-booking:
   ```
   SETNX ride:{rideId}:lock {driverId} EX 30
   ```

4. **Session Management**: Distributed session state across API instances without sticky sessions.

5. **Rate Limiting**: Token bucket or sliding window algorithms easily implemented with Redis.

6. **Strong .NET Support**: StackExchange.Redis is mature and well-maintained. Built-in support in ASP.NET Core.

### Tier Recommendation

| Environment | Tier | Size | HA | Price (approx.) |
|-------------|------|------|-----|-----------------|
| Development | Basic C0 | 250 MB | No | ~$16/month |
| Staging | Standard C1 | 1 GB | Yes | ~$80/month |
| Production | Standard C2 | 2.5 GB | Yes | ~$160/month |

**Note**: Start with Standard tier for production to get replication. Upgrade to Premium if clustering needed.

### When to Reconsider

Consider alternatives if:
- Cost becomes prohibitive (evaluate self-managed Redis on VMs)
- Multi-region active-active caching needed (Premium with geo-replication)
- Advanced Redis modules required (Enterprise tier)
- .NET-specific features needed (evaluate NCache)

---

## Decision

**Selected: Azure Cache for Redis (Standard Tier)**

### Use Cases

| Use Case | Redis Pattern | TTL |
|----------|---------------|-----|
| User session | Hash | 24 hours |
| API response cache | String (JSON) | 5 minutes |
| Rate limiting | Sorted Set | Rolling window |
| Driver availability | Hash | No TTL (explicit update) |
| Ride lock | String + SETNX | 30 seconds |
| Notification queue | List | N/A (processed) |

### Configuration

```csharp
// appsettings.json
{
  "Redis": {
    "ConnectionString": "chaufher-{env}-redis.redis.cache.windows.net:6380,password=...,ssl=True,abortConnect=False",
    "InstanceName": "ChaufHER_",
    "DefaultDatabase": 0
  }
}

// Startup.cs
services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = config["Redis:ConnectionString"];
    options.InstanceName = config["Redis:InstanceName"];
});
```

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   API Instance  │────▶│  Azure Cache     │◀────│   API Instance  │
│       #1        │◀────│    for Redis     │────▶│       #2        │
└─────────────────┘     │   (Standard)     │     └─────────────────┘
                        │                  │
                        │  ┌────────────┐  │
                        │  │  Replica   │  │
                        │  │  (Auto HA) │  │
                        │  └────────────┘  │
                        └──────────────────┘
```

---

## Consequences

### Positive

- Industry-standard caching with rich data structures
- Fully managed with automatic failover
- Sub-millisecond latency for cached operations
- Excellent .NET integration via StackExchange.Redis
- Patterns for session, rate limiting, locking well-documented

### Negative

- Additional cost (~$80-160/month for production)
- Another service to monitor and manage
- Requires cache invalidation strategy (complexity)
- Premium tier needed for advanced features (geo-replication)

### Neutral

- Builds Redis expertise (valuable skill)
- Can migrate to self-hosted Redis if cost becomes issue
- Cache-aside pattern requires careful implementation

---

## Related Documents

- [ADR-002: Database Selection (PostgreSQL)](002-database-postgresql.md)
- [ADR-003: Real-Time Communication (SignalR)](003-realtime-signalr.md)
- [ADR-008: Cloud Provider Selection](008-cloud-provider-azure.md)

---

## References

- [Azure Cache for Redis Documentation](https://docs.microsoft.com/azure/azure-cache-for-redis/)
- [StackExchange.Redis Documentation](https://stackexchange.github.io/StackExchange.Redis/)
- [Redis Data Structures](https://redis.io/docs/data-types/)
- [Distributed Caching in ASP.NET Core](https://docs.microsoft.com/aspnet/core/performance/caching/distributed)
