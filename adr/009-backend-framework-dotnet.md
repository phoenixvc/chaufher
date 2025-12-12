# ADR-009: Backend Framework – .NET 9

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering
**Technical Story:** Backend framework selection for ChaufHER API services

---

## Context

ChaufHER requires a backend framework for:
- RESTful API for ride scheduling, user management, payments
- Real-time communication (SignalR hubs)
- Background job processing (notifications, matching)
- Database access (PostgreSQL via ORM)
- Authentication/authorization integration
- Third-party integrations (payments, SMS, maps)

The framework must:
- Support high-performance, low-latency APIs
- Integrate with Azure services
- Enable rapid development with small team
- Provide strong typing for maintainability
- Scale from MVP to production workloads
- Have mature ecosystem and tooling

---

## Decision Drivers

1. **Performance** – Low latency, high throughput for real-time operations
2. **Azure Integration** – Native support for Azure services
3. **Developer Productivity** – Rapid development, good tooling
4. **Type Safety** – Compile-time checks, refactoring support
5. **Ecosystem** – Libraries, packages, community support
6. **Scalability** – Handle growth without major rewrites
7. **Maintainability** – Clean architecture, testability
8. **Team Expertise** – Learning curve consideration
9. **Long-term Support** – LTS versions, vendor commitment
10. **Cost** – Licensing, hosting, development costs

---

## Options Considered

### Option A: .NET 9 (ASP.NET Core)

Microsoft's modern, cross-platform framework for building web APIs.

**Pros:**
- Excellent performance (TechEmpower benchmarks leader)
- Native Azure integration (App Service, Functions, etc.)
- Strong typing with C# (compile-time safety)
- Minimal APIs for rapid development
- SignalR built-in
- Entity Framework Core for database
- Mature ecosystem (NuGet packages)
- Long-term support versions
- Cross-platform (Linux hosting)
- Excellent tooling (Visual Studio, Rider)

**Cons:**
- C# learning curve for JS/Python teams
- Larger runtime footprint than Go
- Less "trendy" than Node.js/Rust
- Startup time slightly slower than Go (but fast enough)

### Option B: Node.js (Express/NestJS)

JavaScript/TypeScript runtime for server-side applications.

**Pros:**
- Same language as frontend (JavaScript/TypeScript)
- Large ecosystem (npm packages)
- Fast development iteration
- NestJS provides structure (Angular-like)
- Good for I/O-bound operations
- Large talent pool

**Cons:**
- Single-threaded (event loop limitations)
- Performance ceiling for CPU-bound work
- Type safety requires TypeScript discipline
- Callback/Promise complexity
- Less native Azure integration than .NET
- No built-in SignalR (Socket.IO alternative)

### Option C: Go (Gin/Echo)

Google's compiled language designed for simplicity and performance.

**Pros:**
- Excellent performance (compiled, concurrent)
- Small binary sizes, fast startup
- Simple language (quick to learn)
- Built-in concurrency (goroutines)
- Growing ecosystem

**Cons:**
- Smaller ecosystem than .NET/Node.js
- Less mature ORM options
- No equivalent to SignalR
- Verbose error handling
- Limited generics (improved in recent versions)
- Less Azure-native tooling

### Option D: Python (FastAPI/Django)

Python web frameworks for API development.

**Pros:**
- Rapid prototyping
- FastAPI is modern, async-first
- Good for ML/data science integration
- Large community
- Readable, beginner-friendly

**Cons:**
- Performance limitations (GIL)
- Type hints optional (runtime errors)
- Scaling requires careful architecture
- Less suitable for real-time (async complexity)
- Azure integration not as native

### Option E: Java (Spring Boot)

Enterprise Java framework for web applications.

**Pros:**
- Mature, battle-tested
- Excellent enterprise features
- Strong typing (Java)
- Large ecosystem (Maven/Gradle)
- Good performance with JIT

**Cons:**
- Verbose compared to modern alternatives
- Slower startup (JVM warmup)
- Higher memory footprint
- Complex configuration (Spring magic)
- Less Azure-native than .NET

---

## Weighted Evaluation Matrix

| Criterion | Weight | .NET 9 | Node.js | Go | Python | Java |
|-----------|--------|--------|---------|-----|--------|------|
| **Performance** | 18% | 5 | 3 | 5 | 2 | 4 |
| **Azure Integration** | 15% | 5 | 3 | 3 | 3 | 4 |
| **Developer Productivity** | 15% | 5 | 5 | 3 | 5 | 3 |
| **Type Safety** | 12% | 5 | 4 | 4 | 3 | 5 |
| **Ecosystem** | 10% | 5 | 5 | 3 | 5 | 5 |
| **Scalability** | 10% | 5 | 4 | 5 | 3 | 5 |
| **Maintainability** | 8% | 5 | 4 | 4 | 3 | 4 |
| **Team Expertise** | 5% | 4 | 4 | 3 | 4 | 3 |
| **Long-term Support** | 4% | 5 | 4 | 4 | 4 | 5 |
| **Cost** | 3% | 5 | 5 | 5 | 5 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **.NET 9** | (5×.18)+(5×.15)+(5×.15)+(5×.12)+(5×.10)+(5×.10)+(5×.08)+(4×.05)+(5×.04)+(5×.03) | **4.95** |
| **Node.js** | (3×.18)+(3×.15)+(5×.15)+(4×.12)+(5×.10)+(4×.10)+(4×.08)+(4×.05)+(4×.04)+(5×.03) | **3.95** |
| **Java** | (4×.18)+(4×.15)+(3×.15)+(5×.12)+(5×.10)+(5×.10)+(4×.08)+(3×.05)+(5×.04)+(4×.03) | **4.16** |
| **Go** | (5×.18)+(3×.15)+(3×.15)+(4×.12)+(3×.10)+(5×.10)+(4×.08)+(3×.05)+(4×.04)+(5×.03) | **3.86** |
| **Python** | (2×.18)+(3×.15)+(5×.15)+(3×.12)+(5×.10)+(3×.10)+(3×.08)+(4×.05)+(4×.04)+(5×.03) | **3.47** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **.NET 9** | 4.95 |
| 2 | Java (Spring Boot) | 4.16 |
| 3 | Node.js (NestJS) | 3.95 |
| 4 | Go | 3.86 |
| 5 | Python (FastAPI) | 3.47 |

---

## Analysis

### Why .NET 9 Wins for ChaufHER

1. **Top-Tier Performance**: ASP.NET Core consistently ranks in TechEmpower benchmarks. For ride-hailing with real-time updates, performance matters.

2. **Azure Ecosystem Synergy**:
   - Native Azure App Service support
   - Azure Functions for serverless
   - SignalR Service integration
   - Entity Framework + PostgreSQL
   - Azure SDK first-class support

3. **Modern Development Model**:
   - Minimal APIs reduce boilerplate
   - Source generators eliminate reflection
   - Hot reload for rapid iteration
   - Excellent debugging experience

4. **SignalR Built-In**: Real-time communication is a first-class citizen, not an add-on. Hub-based programming model is intuitive.

5. **Strong Typing**: C# catches errors at compile time:
   - Refactoring with confidence
   - IntelliSense everywhere
   - Nullable reference types prevent nulls

6. **Long-Term Support**: .NET 9 is LTS with 3+ years of support. Microsoft's commitment to .NET is unwavering.

### Architecture Approach

**Minimal APIs** for simple endpoints:
```csharp
app.MapGet("/api/rides/{id}", async (Guid id, IRideService service) =>
    await service.GetByIdAsync(id) is Ride ride
        ? Results.Ok(ride)
        : Results.NotFound());
```

**Controllers** for complex flows:
```csharp
[ApiController]
[Route("api/[controller]")]
public class RidesController : ControllerBase
{
    // Complex ride operations with validation, etc.
}
```

### When to Reconsider

Consider alternatives if:
- Team has deep Node.js/Go expertise and no C# experience
- Microservices architecture favors polyglot (different services, different languages)
- Serverless-first strategy emerges (Go/Python may be better for cold starts)

---

## Decision

**Selected: .NET 9 with ASP.NET Core**

### Project Structure

```
src/
├── ChaufHER.Api/           # API host, endpoints, middleware
│   ├── Endpoints/          # Minimal API endpoint groups
│   ├── Hubs/               # SignalR hubs
│   └── Program.cs          # Application entry
├── ChaufHER.Application/   # Business logic (CQRS)
│   ├── Commands/           # Write operations
│   ├── Queries/            # Read operations
│   └── Services/           # Domain services
├── ChaufHER.Domain/        # Entities, value objects
│   ├── Entities/           # Ride, User, Driver, etc.
│   └── Interfaces/         # Repository contracts
├── ChaufHER.Infrastructure/# Data access, external services
│   ├── Persistence/        # EF Core, repositories
│   └── Services/           # External integrations
```

### Key Packages

| Package | Purpose |
|---------|---------|
| `Npgsql.EntityFrameworkCore.PostgreSQL` | PostgreSQL provider |
| `Microsoft.AspNetCore.SignalR` | Real-time communication |
| `Microsoft.Identity.Web` | Azure AD B2C integration |
| `StackExchange.Redis` | Redis caching |
| `FluentValidation` | Request validation |
| `Mapster` | Object mapping |
| `Serilog` | Structured logging |

### Performance Optimizations

- **Response Compression**: Brotli/Gzip
- **Output Caching**: Endpoint-level caching
- **Object Pooling**: Reduce allocations
- **Async Everywhere**: Non-blocking I/O
- **Minimal APIs**: Lower overhead than MVC

---

## Consequences

### Positive

- Excellent performance for real-time ride updates
- Native Azure integration simplifies deployment
- Strong typing catches bugs early
- SignalR built-in eliminates additional dependencies
- Mature ecosystem with proven patterns

### Negative

- C# learning curve for non-.NET developers
- Slightly larger runtime than Go
- Microsoft ecosystem dependency

### Neutral

- Team builds .NET expertise (valuable skill)
- Architecture is portable (clean separation)
- Can introduce microservices in other languages if needed

---

## Related Documents

- [ADR-002: Database Selection (PostgreSQL)](002-database-postgresql.md)
- [ADR-003: Real-Time Communication (SignalR)](003-realtime-signalr.md)
- [ADR-008: Cloud Provider Selection (Azure)](008-cloud-provider-azure.md)

---

## References

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core/)
- [.NET 9 Release Notes](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9)
- [Minimal APIs Overview](https://docs.microsoft.com/aspnet/core/fundamentals/minimal-apis)
- [TechEmpower Benchmarks](https://www.techempower.com/benchmarks/)
