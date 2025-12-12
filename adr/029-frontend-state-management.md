# ADR-029: Frontend State Management – Zustand

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering
**Technical Story:** State management solution for the React PWA client application

---

## Context

The ChaufHER PWA requires state management for:

- User authentication state (logged in, tokens)
- Ride booking flow (pickup, dropoff, fare estimate)
- Real-time ride tracking (driver location, status updates)
- User profile and preferences
- Notification state
- Form states across multi-step flows
- Cached data (ride history, saved places)

The state management solution must:
- Work well with React 18+
- Support TypeScript
- Handle real-time updates from SignalR
- Be performant on mobile devices
- Support offline-first patterns
- Be easy to learn and maintain
- Have good developer tooling

---

## Decision Drivers

1. **Simplicity** – Easy to learn and use
2. **TypeScript Support** – First-class type safety
3. **Performance** – Minimal re-renders, efficient updates
4. **Bundle Size** – Small footprint for PWA
5. **React Integration** – Works with React 18 features
6. **DevTools** – Good debugging experience
7. **Async Support** – Handle API calls, SignalR updates
8. **Persistence** – Support for local storage/IndexedDB
9. **Learning Curve** – Team productivity
10. **Community** – Documentation, examples, support

---

## Options Considered

### Option A: Zustand

Lightweight state management with hooks API.

**Pros:**
- Extremely lightweight (~1KB)
- Simple, intuitive API
- Excellent TypeScript support
- No boilerplate
- Works with React DevTools
- Built-in persistence middleware
- No providers needed

**Cons:**
- Less structured than Redux
- Smaller community than Redux
- Less middleware ecosystem

### Option B: Redux Toolkit

Modern Redux with improved DX.

**Pros:**
- Industry standard
- Huge ecosystem
- Excellent DevTools
- RTK Query for data fetching
- Structured patterns

**Cons:**
- More boilerplate
- Larger bundle size (~10KB)
- Steeper learning curve
- Can be overkill for smaller apps

### Option C: Jotai

Primitive and flexible state management.

**Pros:**
- Atomic state model
- Very small (~2KB)
- Suspense support
- No boilerplate

**Cons:**
- Different mental model
- Less structure for large apps
- Newer, smaller community

### Option D: React Query + Context

Server state with React Query, client state with Context.

**Pros:**
- Excellent for server state
- Caching built-in
- Optimistic updates
- Stale-while-revalidate

**Cons:**
- Doesn't handle client state well
- Need Context for local state
- Two different patterns to learn

### Option E: MobX

Observable-based state management.

**Pros:**
- Automatic reactivity
- Less boilerplate
- Good for complex state

**Cons:**
- Different paradigm (observables)
- Larger bundle size
- Can be magical/implicit
- Decorator syntax

---

## Weighted Evaluation Matrix

| Criterion | Weight | Zustand | Redux TK | Jotai | RQ+Context | MobX |
|-----------|--------|---------|----------|-------|------------|------|
| **Simplicity** | 20% | 5 | 3 | 4 | 3 | 3 |
| **TypeScript** | 15% | 5 | 5 | 5 | 4 | 4 |
| **Performance** | 15% | 5 | 4 | 5 | 5 | 4 |
| **Bundle Size** | 12% | 5 | 3 | 5 | 4 | 3 |
| **React Integration** | 10% | 5 | 4 | 5 | 5 | 3 |
| **DevTools** | 8% | 4 | 5 | 3 | 4 | 4 |
| **Async Support** | 8% | 4 | 5 | 4 | 5 | 4 |
| **Persistence** | 5% | 5 | 4 | 4 | 3 | 3 |
| **Learning Curve** | 4% | 5 | 3 | 4 | 3 | 3 |
| **Community** | 3% | 4 | 5 | 3 | 5 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Zustand** | (5×.20)+(5×.15)+(5×.15)+(5×.12)+(5×.10)+(4×.08)+(4×.08)+(5×.05)+(5×.04)+(4×.03) | **4.81** |
| **Redux Toolkit** | (3×.20)+(5×.15)+(4×.15)+(3×.12)+(4×.10)+(5×.08)+(5×.08)+(4×.05)+(3×.04)+(5×.03) | **3.98** |
| **Jotai** | (4×.20)+(5×.15)+(5×.15)+(5×.12)+(5×.10)+(3×.08)+(4×.08)+(4×.05)+(4×.04)+(3×.03) | **4.45** |
| **RQ+Context** | (3×.20)+(4×.15)+(5×.15)+(4×.12)+(5×.10)+(4×.08)+(5×.08)+(3×.05)+(3×.04)+(5×.03) | **4.06** |
| **MobX** | (3×.20)+(4×.15)+(4×.15)+(3×.12)+(3×.10)+(4×.08)+(4×.08)+(3×.05)+(3×.04)+(4×.03) | **3.52** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Zustand** | 4.81 |
| 2 | Jotai | 4.45 |
| 3 | React Query + Context | 4.06 |
| 4 | Redux Toolkit | 3.98 |
| 5 | MobX | 3.52 |

---

## Decision

**Selected: Zustand** for client state + **React Query** for server state

### Store Architecture

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

### Store Structure

```
stores/
├── auth.store.ts          # Authentication state
├── ride.store.ts          # Current ride booking state
├── tracking.store.ts      # Real-time ride tracking
├── notifications.store.ts # Notification state
├── ui.store.ts            # UI state (modals, toasts)
└── index.ts               # Export all stores
```

### Ride Store Example

```typescript
// stores/ride.store.ts
import { create } from 'zustand';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface RideState {
  // Booking flow state
  pickup: Location | null;
  dropoff: Location | null;
  fareEstimate: number | null;
  selectedVehicleType: VehicleType;

  // Active ride state
  activeRide: Ride | null;
  driverLocation: Location | null;
  rideStatus: RideStatus;

  // Actions
  setPickup: (location: Location) => void;
  setDropoff: (location: Location) => void;
  setFareEstimate: (fare: number) => void;
  setActiveRide: (ride: Ride) => void;
  updateDriverLocation: (location: Location) => void;
  updateRideStatus: (status: RideStatus) => void;
  clearRide: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  pickup: null,
  dropoff: null,
  fareEstimate: null,
  selectedVehicleType: 'standard',
  activeRide: null,
  driverLocation: null,
  rideStatus: 'idle',

  setPickup: (location) => set({ pickup: location }),
  setDropoff: (location) => set({ dropoff: location }),
  setFareEstimate: (fare) => set({ fareEstimate: fare }),
  setActiveRide: (ride) => set({ activeRide: ride, rideStatus: 'active' }),
  updateDriverLocation: (location) => set({ driverLocation: location }),
  updateRideStatus: (status) => set({ rideStatus: status }),
  clearRide: () => set({
    pickup: null,
    dropoff: null,
    fareEstimate: null,
    activeRide: null,
    driverLocation: null,
    rideStatus: 'idle',
  }),
}));
```

### SignalR Integration

```typescript
// hooks/useRideTracking.ts
import { useEffect } from 'react';
import { useRideStore } from '../stores/ride.store';
import { signalRConnection } from '../services/signalr';

export function useRideTracking(rideId: string) {
  const updateDriverLocation = useRideStore((s) => s.updateDriverLocation);
  const updateRideStatus = useRideStore((s) => s.updateRideStatus);

  useEffect(() => {
    // Subscribe to real-time updates
    signalRConnection.on('DriverLocationUpdate', (location) => {
      updateDriverLocation(location);
    });

    signalRConnection.on('RideStatusUpdate', (status) => {
      updateRideStatus(status);
    });

    // Join ride group
    signalRConnection.invoke('JoinRideGroup', rideId);

    return () => {
      signalRConnection.off('DriverLocationUpdate');
      signalRConnection.off('RideStatusUpdate');
      signalRConnection.invoke('LeaveRideGroup', rideId);
    };
  }, [rideId, updateDriverLocation, updateRideStatus]);
}
```

### React Query for Server State

```typescript
// hooks/useRideHistory.ts
import { useQuery } from '@tanstack/react-query';
import { getRideHistory } from '../api/rides';

export function useRideHistory() {
  return useQuery({
    queryKey: ['rideHistory'],
    queryFn: getRideHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// hooks/useFareEstimate.ts
import { useQuery } from '@tanstack/react-query';
import { getFareEstimate } from '../api/rides';
import { useRideStore } from '../stores/ride.store';

export function useFareEstimate() {
  const pickup = useRideStore((s) => s.pickup);
  const dropoff = useRideStore((s) => s.dropoff);
  const setFareEstimate = useRideStore((s) => s.setFareEstimate);

  return useQuery({
    queryKey: ['fareEstimate', pickup, dropoff],
    queryFn: () => getFareEstimate(pickup!, dropoff!),
    enabled: !!pickup && !!dropoff,
    onSuccess: (data) => setFareEstimate(data.estimate),
  });
}
```

### DevTools Integration

```typescript
// stores/index.ts
import { devtools } from 'zustand/middleware';

// Enable devtools in development
export const useRideStore = create<RideState>()(
  devtools(
    (set) => ({
      // ... store implementation
    }),
    { name: 'RideStore' }
  )
);
```

---

## Consequences

### Positive

- Minimal bundle size impact (~1KB)
- Simple, intuitive API reduces learning curve
- Excellent TypeScript inference
- No provider wrappers needed
- Easy to test stores in isolation
- React Query handles server state caching

### Negative

- Less structured than Redux (no enforced patterns)
- Smaller ecosystem than Redux
- Need to combine with React Query for full solution

### Neutral

- Team learns Zustand patterns
- DevTools experience slightly different from Redux
- Can migrate to Redux if needed for scale

---

## Related Documents

- [ADR-001: Client Technology (PWA)](001-client-technology-flutter-vs-pwa.md)
- [ADR-003: Real-Time Communication (SignalR)](003-realtime-signalr.md)
- [Architecture Overview](../docs/architecture.md)

---

## References

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Middleware](https://github.com/pmndrs/zustand#middleware)
- [State Management Comparison](https://docs.pmnd.rs/zustand/getting-started/comparison)
