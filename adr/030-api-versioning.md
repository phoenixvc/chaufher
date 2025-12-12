# ADR-030: API Versioning Strategy – URL Path Versioning

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering
**Technical Story:** API versioning strategy for backward compatibility as the platform evolves

---

## Context

ChaufHER's API will evolve over time with:

- New features and endpoints
- Changes to existing endpoint behavior
- Breaking changes to request/response schemas
- Deprecation of old endpoints

The platform needs a versioning strategy that:
- Allows backward-compatible API evolution
- Supports multiple client versions (PWA, future mobile apps)
- Provides clear deprecation path
- Is easy for developers to understand and implement
- Works with OpenAPI documentation
- Integrates well with .NET 9

---

## Decision Drivers

1. **Clarity** – Easy to understand which version is being used
2. **Backward Compatibility** – Old clients continue working
3. **Developer Experience** – Simple to implement and consume
4. **Discoverability** – Versions obvious in documentation
5. **Caching** – Works well with CDN/caching layers
6. **Routing** – Simple routing implementation
7. **Testing** – Easy to test multiple versions
8. **Deprecation** – Clear path for retiring old versions
9. **Industry Standard** – Follows common patterns
10. **Mobile Compatibility** – Works for future native apps

---

## Options Considered

### Option A: URL Path Versioning

Version in the URL path: `/api/v1/rides`, `/api/v2/rides`

**Pros:**
- Most explicit and visible
- Easy to understand
- Works with any HTTP client
- CDN/cache-friendly
- Simple routing
- Clear in documentation

**Cons:**
- URL structure changes per version
- Can lead to code duplication
- Need to maintain multiple controllers

### Option B: Header Versioning

Version via custom header: `X-API-Version: 2`

**Pros:**
- Clean URLs
- Resource-oriented (same URL, different representation)
- More RESTful in theory

**Cons:**
- Not visible in browser/URLs
- Easy to forget header
- Harder to test casually
- Documentation less clear
- CDN caching more complex

### Option C: Query Parameter Versioning

Version via query param: `/api/rides?version=2`

**Pros:**
- Easy to implement
- Visible in URLs
- Simple to switch versions

**Cons:**
- Clutters query string
- Less explicit than path
- Can conflict with other parameters
- Feels like an afterthought

### Option D: Accept Header / Media Type

Version via Accept header: `Accept: application/vnd.chaufher.v2+json`

**Pros:**
- Most RESTful approach
- Content negotiation pattern
- Resource-centric

**Cons:**
- Complex for clients
- Hard to test
- Poor tooling support
- Documentation challenging
- Overkill for most APIs

---

## Weighted Evaluation Matrix

| Criterion | Weight | URL Path | Header | Query Param | Media Type |
|-----------|--------|----------|--------|-------------|------------|
| **Clarity** | 20% | 5 | 3 | 4 | 2 |
| **Backward Compat** | 15% | 5 | 5 | 5 | 5 |
| **Developer Experience** | 15% | 5 | 3 | 4 | 2 |
| **Discoverability** | 12% | 5 | 2 | 4 | 2 |
| **Caching** | 10% | 5 | 3 | 4 | 3 |
| **Routing** | 10% | 5 | 4 | 4 | 3 |
| **Testing** | 8% | 5 | 3 | 4 | 2 |
| **Deprecation** | 5% | 4 | 4 | 4 | 4 |
| **Industry Standard** | 3% | 5 | 3 | 4 | 3 |
| **Mobile Compat** | 2% | 5 | 4 | 5 | 3 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **URL Path** | (5×.20)+(5×.15)+(5×.15)+(5×.12)+(5×.10)+(5×.10)+(5×.08)+(4×.05)+(5×.03)+(5×.02) | **4.95** |
| **Query Param** | (4×.20)+(5×.15)+(4×.15)+(4×.12)+(4×.10)+(4×.10)+(4×.08)+(4×.05)+(4×.03)+(5×.02) | **4.17** |
| **Header** | (3×.20)+(5×.15)+(3×.15)+(2×.12)+(3×.10)+(4×.10)+(3×.08)+(4×.05)+(3×.03)+(4×.02) | **3.37** |
| **Media Type** | (2×.20)+(5×.15)+(2×.15)+(2×.12)+(3×.10)+(3×.10)+(2×.08)+(4×.05)+(3×.03)+(3×.02) | **2.86** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **URL Path Versioning** | 4.95 |
| 2 | Query Parameter | 4.17 |
| 3 | Header Versioning | 3.37 |
| 4 | Media Type | 2.86 |

---

## Decision

**Selected: URL Path Versioning** with `/api/v{n}/` prefix

### URL Structure

```
Base URL: https://api.chaufher.co.za

Versioned endpoints:
  /api/v1/rides
  /api/v1/rides/{id}
  /api/v1/users/me
  /api/v1/drivers/{id}/location

Future version:
  /api/v2/rides
```

### Implementation in .NET 9

```csharp
// Program.cs
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});

builder.Services.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});
```

### Controller Versioning

```csharp
// Controllers/v1/RidesController.cs
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/rides")]
public class RidesController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<RideDto>>> GetRides()
    {
        // v1 implementation
    }

    [HttpPost]
    public async Task<ActionResult<RideDto>> CreateRide(CreateRideRequest request)
    {
        // v1 implementation
    }
}

// Controllers/v2/RidesController.cs
[ApiController]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/rides")]
public class RidesV2Controller : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<RideV2Dto>>> GetRides()
    {
        // v2 implementation with enhanced response
    }

    [HttpPost]
    public async Task<ActionResult<RideV2Dto>> CreateRide(CreateRideV2Request request)
    {
        // v2 implementation with new fields
    }
}
```

### Shared Logic Pattern

```csharp
// Services/RideService.cs (version-agnostic business logic)
public class RideService : IRideService
{
    public async Task<Ride> CreateRideAsync(CreateRideCommand command)
    {
        // Shared business logic
    }
}

// Controllers/v1/RidesController.cs
[HttpPost]
public async Task<ActionResult<RideDto>> CreateRide(CreateRideRequest request)
{
    var command = _mapper.Map<CreateRideCommand>(request);
    var ride = await _rideService.CreateRideAsync(command);
    return Ok(_mapper.Map<RideDto>(ride));
}

// Controllers/v2/RidesController.cs
[HttpPost]
public async Task<ActionResult<RideV2Dto>> CreateRide(CreateRideV2Request request)
{
    var command = _mapper.Map<CreateRideCommand>(request);
    var ride = await _rideService.CreateRideAsync(command);
    return Ok(_mapper.Map<RideV2Dto>(ride));
}
```

### OpenAPI/Swagger Setup

```csharp
// Program.cs
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ChaufHER API",
        Version = "v1",
        Description = "ChaufHER ride-hailing API - Version 1"
    });

    options.SwaggerDoc("v2", new OpenApiInfo
    {
        Title = "ChaufHER API",
        Version = "v2",
        Description = "ChaufHER ride-hailing API - Version 2"
    });
});

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ChaufHER API v1");
    options.SwaggerEndpoint("/swagger/v2/swagger.json", "ChaufHER API v2");
});
```

### Version Lifecycle

| Phase | Duration | Actions |
|-------|----------|---------|
| **Current** | Active | Full support, new features |
| **Deprecated** | 6 months | Sunset header, no new features |
| **Retired** | - | Returns 410 Gone |

### Deprecation Headers

```csharp
// Middleware/DeprecationMiddleware.cs
public class DeprecationMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var apiVersion = context.GetRequestedApiVersion();

        if (apiVersion?.MajorVersion == 1)
        {
            context.Response.Headers.Add("Deprecation", "true");
            context.Response.Headers.Add("Sunset", "2026-06-01");
            context.Response.Headers.Add("Link",
                "</api/v2/>; rel=\"successor-version\"");
        }

        await next(context);
    }
}
```

### Client Configuration

```typescript
// api/client.ts
const API_VERSION = 'v1';
const BASE_URL = `https://api.chaufher.co.za/api/${API_VERSION}`;

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Future version upgrade
// const API_VERSION = 'v2';
```

---

## Versioning Policy

### When to Create a New Version

| Change Type | New Version? | Example |
|-------------|--------------|---------|
| New endpoint | No | Add `/api/v1/scheduled-rides` |
| New optional field | No | Add `notes` to response |
| New required field | **Yes** | Require `vehicleType` in request |
| Remove field | **Yes** | Remove `legacyField` from response |
| Change field type | **Yes** | Change `fare` from string to number |
| Rename endpoint | **Yes** | `/rides` → `/bookings` |
| Change behavior | **Yes** | Different sorting default |

### Supported Versions

| Version | Status | Sunset Date |
|---------|--------|-------------|
| v1 | Current | - |
| v2 | Future | - |

---

## Consequences

### Positive

- Explicit, visible versioning in URLs
- Easy to test and debug
- Cache-friendly (different URLs = different cache keys)
- Clear documentation with separate OpenAPI specs per version
- Simple client configuration

### Negative

- URL changes between versions
- Potential code duplication for similar endpoints
- Need to maintain multiple controller versions

### Neutral

- Standard pattern, widely understood
- Can use shared services to minimize duplication
- Future mobile apps use same versioning

---

## Related Documents

- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)
- [ADR-023: Networking & API Gateway](023-networking-api-gateway.md)
- [API Reference](../docs/api-reference.md)

---

## References

- [Microsoft API Versioning](https://github.com/dotnet/aspnet-api-versioning)
- [REST API Versioning Best Practices](https://restfulapi.net/versioning/)
- [Stripe API Versioning](https://stripe.com/docs/api/versioning)
- [OpenAPI Versioning](https://swagger.io/docs/specification/api-host-and-base-path/)
