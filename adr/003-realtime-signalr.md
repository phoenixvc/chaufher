# ADR-003: Real-Time Communication – SignalR

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Backend Team
**Technical Story:** Real-time communication for ride status updates and notifications

---

## Context

ChaufHER requires real-time communication for:
- Ride status updates (driver assigned, en route, arrived, completed)
- Push notifications to riders and drivers
- Live location updates (Phase 2: driver tracking)
- Admin dashboard real-time monitoring
- Driver availability status changes

The solution must:
- Support web clients (PWA) and potentially future native apps
- Scale with user growth
- Integrate with .NET backend
- Handle connection drops gracefully
- Work within Azure infrastructure

---

## Decision Drivers

1. **.NET Integration** – Seamless integration with ASP.NET Core backend
2. **Scalability** – Handle thousands of concurrent connections
3. **Azure Native** – Managed service preferred for operational simplicity
4. **Client Support** – JavaScript client for PWA, future native SDKs
5. **Reliability** – Automatic reconnection, message delivery guarantees
6. **Cost** – Predictable pricing for startup budget
7. **Developer Experience** – Strong tooling, documentation, debugging
8. **Fallback Support** – Graceful degradation for older browsers
9. **Security** – Authentication integration, transport encryption
10. **Latency** – Sub-second message delivery for real-time UX

---

## Options Considered

### Option A: Azure SignalR Service

Fully managed SignalR service that handles connection management, scaling, and infrastructure.

**Pros:**
- Native .NET/ASP.NET Core integration (first-party Microsoft)
- Fully managed—no server infrastructure to manage
- Auto-scaling from 0 to millions of connections
- Built-in authentication integration (Azure AD, JWT)
- Automatic fallback (WebSocket → Server-Sent Events → Long Polling)
- Serverless mode for event-driven scenarios
- Hub-based programming model (familiar to .NET developers)
- Strong client libraries (JavaScript, .NET, Java)

**Cons:**
- Azure-specific (vendor lock-in)
- Pricing based on units (can be complex to predict)
- Less control over underlying infrastructure
- Not suitable for non-Azure deployments

### Option B: Socket.IO

Popular JavaScript library for real-time bidirectional event-based communication.

**Pros:**
- Large ecosystem and community
- Automatic transport fallback
- Room/namespace support for grouping
- Language-agnostic (many server implementations)
- Open source, no vendor lock-in

**Cons:**
- Node.js native—requires separate service or interop for .NET
- Self-managed infrastructure (scaling, load balancing)
- No managed service option on Azure
- Fragmented .NET implementations
- Additional operational complexity

### Option C: Pusher

Third-party real-time messaging service.

**Pros:**
- Fully managed, easy to integrate
- Presence channels for user tracking
- Good client libraries across platforms
- Simple pricing model
- Quick to prototype

**Cons:**
- Third-party vendor dependency
- Not Azure-native (additional latency possible)
- Limited customization options
- Cost scales with connections and messages
- Less .NET-native than SignalR

### Option D: Firebase Realtime Database / Firestore

Google's real-time database solutions with built-in sync.

**Pros:**
- Real-time sync built into database
- Excellent mobile SDK support
- Serverless, auto-scaling
- Offline support with sync

**Cons:**
- Google ecosystem, not Azure-native
- Data model tightly coupled to real-time sync
- Limited query capabilities vs. dedicated databases
- Cost can be unpredictable at scale
- Not ideal for .NET-first architecture

### Option E: Custom WebSocket Implementation

Self-implemented WebSocket server with ASP.NET Core.

**Pros:**
- Full control over implementation
- No vendor lock-in
- No per-message/connection costs
- Can optimize for specific use cases

**Cons:**
- Significant development effort
- Must handle scaling, load balancing, failover
- Reconnection logic is complex
- Fallback transports need manual implementation
- Ongoing maintenance burden

---

## Weighted Evaluation Matrix

| Criterion | Weight | SignalR | Socket.IO | Pusher | Firebase | Custom WS |
|-----------|--------|---------|-----------|--------|----------|-----------|
| **.NET Integration** | 20% | 5 | 2 | 3 | 2 | 4 |
| **Scalability** | 15% | 5 | 3 | 5 | 5 | 2 |
| **Azure Native** | 15% | 5 | 2 | 2 | 1 | 3 |
| **Client Support** | 10% | 5 | 5 | 4 | 4 | 3 |
| **Reliability** | 10% | 5 | 4 | 5 | 5 | 3 |
| **Cost** | 10% | 4 | 3 | 3 | 3 | 5 |
| **Developer Experience** | 8% | 5 | 4 | 4 | 4 | 2 |
| **Fallback Support** | 5% | 5 | 5 | 4 | 4 | 2 |
| **Security** | 4% | 5 | 4 | 4 | 4 | 4 |
| **Latency** | 3% | 5 | 4 | 4 | 4 | 5 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure SignalR** | (5×.20)+(5×.15)+(5×.15)+(5×.10)+(5×.10)+(4×.10)+(5×.08)+(5×.05)+(5×.04)+(5×.03) | **4.90** |
| **Pusher** | (3×.20)+(5×.15)+(2×.15)+(4×.10)+(5×.10)+(3×.10)+(4×.08)+(4×.05)+(4×.04)+(4×.03) | **3.65** |
| **Firebase** | (2×.20)+(5×.15)+(1×.15)+(4×.10)+(5×.10)+(3×.10)+(4×.08)+(4×.05)+(4×.04)+(4×.03) | **3.30** |
| **Socket.IO** | (2×.20)+(3×.15)+(2×.15)+(5×.10)+(4×.10)+(3×.10)+(4×.08)+(5×.05)+(4×.04)+(4×.03) | **3.20** |
| **Custom WS** | (4×.20)+(2×.15)+(3×.15)+(3×.10)+(3×.10)+(5×.10)+(2×.08)+(2×.05)+(4×.04)+(5×.03) | **3.22** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Azure SignalR Service** | 4.90 |
| 2 | Pusher | 3.65 |
| 3 | Firebase | 3.30 |
| 4 | Custom WebSocket | 3.22 |
| 5 | Socket.IO | 3.20 |

---

## Analysis

### Why Azure SignalR Service Wins for ChaufHER

1. **Native .NET Integration**: SignalR is a first-party Microsoft technology. ASP.NET Core has built-in SignalR support with strongly-typed hubs, making development straightforward.

2. **Fully Managed**: No infrastructure to manage. Azure handles connection scaling, load balancing, and failover automatically.

3. **Azure Ecosystem Fit**: Integrates seamlessly with:
   - Azure AD B2C for authentication
   - Azure App Service for hosting
   - Azure Functions for serverless handlers
   - Application Insights for monitoring

4. **Automatic Fallback**: Handles transport negotiation automatically:
   ```
   WebSocket (preferred) → Server-Sent Events → Long Polling
   ```
   Critical for PWA clients across various browsers.

5. **Hub-Based Model**: Logical grouping of connections by functionality:
   - `RideStatusHub` – Ride updates
   - `DriverLocationHub` – Live tracking (Phase 2)
   - `NotificationHub` – Push notifications

6. **Serverless Option**: Can use Azure Functions with SignalR bindings for event-driven scenarios, reducing costs during low-traffic periods.

### Cost Considerations

| Tier | Included | Price (approx.) |
|------|----------|-----------------|
| Free | 20 concurrent connections, 20K messages/day | $0 |
| Standard (Unit 1) | 1K concurrent, unlimited messages | ~$50/month |
| Standard (Unit 10) | 10K concurrent, unlimited messages | ~$500/month |

For MVP, Free tier is sufficient. Standard Unit 1 handles production pilot.

### When to Reconsider

Consider alternatives if:
- Multi-cloud deployment becomes a requirement
- Cost at scale exceeds third-party alternatives
- Specific Socket.IO features are needed
- Team has strong Node.js expertise and prefers Socket.IO ecosystem

---

## Decision

**Selected: Azure SignalR Service**

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   PWA Client    │────▶│ Azure SignalR    │◀────│  .NET Backend   │
│   (JS Client)   │◀────│    Service       │────▶│   (Hub Logic)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  Azure Functions │
                        │ (Event handlers) │
                        └──────────────────┘
```

### Hub Design

| Hub | Purpose | Events |
|-----|---------|--------|
| `RideHub` | Ride lifecycle | `RideCreated`, `DriverAssigned`, `RideStarted`, `RideCompleted` |
| `DriverHub` | Driver status | `AvailabilityChanged`, `LocationUpdated` |
| `NotificationHub` | Push notifications | `NotificationReceived`, `AlertTriggered` |

### Client Integration

```javascript
// PWA SignalR client setup
const connection = new signalR.HubConnectionBuilder()
  .withUrl('/hubs/ride', { accessTokenFactory: () => getAccessToken() })
  .withAutomaticReconnect()
  .build();

connection.on('RideStatusChanged', (rideId, status) => {
  // Update UI
});
```

---

## Consequences

### Positive

- Seamless integration with .NET backend (strongly-typed hubs)
- No infrastructure management overhead
- Automatic scaling and high availability
- Built-in authentication support
- Excellent monitoring via Application Insights

### Negative

- Azure vendor lock-in for real-time infrastructure
- Unit-based pricing can be complex at scale
- Less flexibility than self-hosted solutions
- Learning curve for SignalR-specific patterns

### Neutral

- Builds SignalR expertise (Microsoft ecosystem skill)
- Client library adds ~50KB to PWA bundle (acceptable)
- Fallback transports increase reliability but add complexity

---

## Related Documents

- [ADR-001: Client Technology Selection](001-client-technology-flutter-vs-pwa.md)
- [ADR-008: Cloud Provider Selection](008-cloud-provider-azure.md)
- [Product Requirements Document](../docs/PRD.md)

---

## References

- [Azure SignalR Service Documentation](https://docs.microsoft.com/azure/azure-signalr/)
- [ASP.NET Core SignalR Documentation](https://docs.microsoft.com/aspnet/core/signalr/)
- [SignalR JavaScript Client](https://docs.microsoft.com/aspnet/core/signalr/javascript-client)
- [SignalR Pricing](https://azure.microsoft.com/pricing/details/signalr-service/)
