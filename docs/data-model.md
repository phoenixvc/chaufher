# ChaufHER Data Model

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben

---

## Overview

This document defines the data model for the ChaufHER platform, including entity relationships, field definitions, and database design decisions.

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CHAUFHER DATA MODEL (ERD)                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│        USER          │          │       DRIVER         │          │       VEHICLE        │
├──────────────────────┤          ├──────────────────────┤          ├──────────────────────┤
│ PK id: uuid          │          │ PK id: uuid          │          │ PK id: uuid          │
│    external_id: str  │          │ FK user_id: uuid     │──────────│ FK driver_id: uuid   │
│    phone: str        │          │    status: enum      │          │    registration: str │
│    email: str?       │          │    rating: decimal   │          │    make: str         │
│    first_name: str   │          │    total_rides: int  │          │    model: str        │
│    last_name: str    │          │    acceptance_rate:  │          │    year: int         │
│    profile_photo: str│          │      decimal         │          │    color: str        │
│    role: enum        │          │    joined_at: ts     │          │    type: enum        │
│    status: enum      │          │    verified_at: ts?  │          │    status: enum      │
│    created_at: ts    │          │    home_location:    │          │    verified_at: ts?  │
│    updated_at: ts    │          │      geography       │          │    created_at: ts    │
│    deleted_at: ts?   │          │    created_at: ts    │          └──────────┬───────────┘
└──────────┬───────────┘          └──────────┬───────────┘                     │
           │                                 │                                  │
           │ 1:1                             │ 1:N                              │
           │                                 │                                  │
           ▼                                 ▼                                  ▼
┌──────────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│    RIDER_PROFILE     │          │   DRIVER_DOCUMENT    │          │   VEHICLE_PHOTO      │
├──────────────────────┤          ├──────────────────────┤          ├──────────────────────┤
│ PK id: uuid          │          │ PK id: uuid          │          │ PK id: uuid          │
│ FK user_id: uuid     │          │ FK driver_id: uuid   │          │ FK vehicle_id: uuid  │
│    default_payment:  │          │    type: enum        │          │    type: enum        │
│      uuid?           │          │    file_url: str     │          │    file_url: str     │
│    emergency_contact:│          │    status: enum      │          │    uploaded_at: ts   │
│      str?            │          │    expiry_date: date?│          └──────────────────────┘
│    emergency_phone:  │          │    verified_at: ts?  │
│      str?            │          │    verified_by: uuid?│
│    created_at: ts    │          │    uploaded_at: ts   │
└──────────────────────┘          └──────────────────────┘


┌──────────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│        RIDE          │          │    RIDE_TRACKING     │          │    RIDE_RATING       │
├──────────────────────┤          ├──────────────────────┤          ├──────────────────────┤
│ PK id: uuid          │          │ PK id: uuid          │          │ PK id: uuid          │
│ FK rider_id: uuid    │◀─────────│ FK ride_id: uuid     │          │ FK ride_id: uuid     │
│ FK driver_id: uuid?  │          │    location:         │          │    rider_rating: int │
│ FK vehicle_id: uuid? │          │      geography       │          │    rider_comment: str│
│    status: enum      │          │    speed: decimal?   │          │    driver_rating: int│
│    type: enum        │          │    heading: decimal? │          │    driver_comment:str│
│    pickup_location:  │          │    recorded_at: ts   │          │    created_at: ts    │
│      geography       │          └──────────────────────┘          └──────────────────────┘
│    pickup_address:str│
│    dropoff_location: │
│      geography       │          ┌──────────────────────┐          ┌──────────────────────┐
│    dropoff_address:  │          │      PAYMENT         │          │   PAYMENT_METHOD     │
│      str             │          ├──────────────────────┤          ├──────────────────────┤
│    scheduled_at: ts? │          │ PK id: uuid          │          │ PK id: uuid          │
│    requested_at: ts  │          │ FK ride_id: uuid     │◀─────────│ FK user_id: uuid     │
│    accepted_at: ts?  │◀─────────│ FK payment_method_id:│          │    type: enum        │
│    started_at: ts?   │          │      uuid?           │          │    provider: enum    │
│    completed_at: ts? │          │    amount: decimal   │          │    token: str?       │
│    cancelled_at: ts? │          │    currency: str     │          │    last_four: str?   │
│    estimated_fare:   │          │    status: enum      │          │    is_default: bool  │
│      decimal         │          │    provider_ref: str?│          │    created_at: ts    │
│    final_fare:       │          │    paid_at: ts?      │          └──────────────────────┘
│      decimal?        │          │    created_at: ts    │
│    distance_km:      │          └──────────────────────┘
│      decimal?        │
│    duration_min: int?│
│    cancellation_     │          ┌──────────────────────┐          ┌──────────────────────┐
│      reason: str?    │          │   DRIVER_PAYOUT      │          │   SAVED_PLACE        │
│    created_at: ts    │          ├──────────────────────┤          ├──────────────────────┤
│    updated_at: ts    │          │ PK id: uuid          │          │ PK id: uuid          │
└──────────────────────┘          │ FK driver_id: uuid   │          │ FK user_id: uuid     │
                                  │    period_start: date│          │    name: str         │
                                  │    period_end: date  │          │    address: str      │
┌──────────────────────┐          │    gross_amount:     │          │    location:         │
│   RECURRING_RIDE     │          │      decimal         │          │      geography       │
├──────────────────────┤          │    commission:decimal│          │    type: enum        │
│ PK id: uuid          │          │    net_amount:decimal│          │    created_at: ts    │
│ FK rider_id: uuid    │          │    status: enum      │          └──────────────────────┘
│ FK driver_id: uuid?  │          │    paid_at: ts?      │
│    schedule: jsonb   │          │    reference: str?   │
│    pickup_location:  │          │    created_at: ts    │          ┌──────────────────────┐
│      geography       │          └──────────────────────┘          │  RIDER_PREFERENCE    │
│    pickup_address:str│                                            ├──────────────────────┤
│    dropoff_location: │                                            │ PK id: uuid          │
│      geography       │          ┌──────────────────────┐          │ FK rider_id: uuid    │
│    dropoff_address:  │          │   DRIVER_AVAILABILITY│          │ FK preferred_driver: │
│      str             │          ├──────────────────────┤          │      uuid?           │
│    type: enum        │          │ PK id: uuid          │          │    blocked_drivers:  │
│    status: enum      │          │ FK driver_id: uuid   │          │      uuid[]          │
│    start_date: date  │          │    day_of_week: int  │          │    vehicle_pref: enum│
│    end_date: date?   │          │    start_time: time  │          │    created_at: ts    │
│    created_at: ts    │          │    end_time: time    │          │    updated_at: ts    │
└──────────────────────┘          │    is_preferred: bool│          └──────────────────────┘
                                  │    created_at: ts    │
                                  └──────────────────────┘

┌──────────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│    NOTIFICATION      │          │     AUDIT_LOG        │          │   SUPPORT_TICKET     │
├──────────────────────┤          ├──────────────────────┤          ├──────────────────────┤
│ PK id: uuid          │          │ PK id: uuid          │          │ PK id: uuid          │
│ FK user_id: uuid     │          │ FK user_id: uuid?    │          │ FK user_id: uuid     │
│    type: enum        │          │    action: str       │          │ FK ride_id: uuid?    │
│    title: str        │          │    resource: str     │          │    type: enum        │
│    body: str         │          │    resource_id: uuid?│          │    subject: str      │
│    data: jsonb?      │          │    old_values: jsonb?│          │    description: str  │
│    read_at: ts?      │          │    new_values: jsonb?│          │    status: enum      │
│    sent_at: ts       │          │    ip_address: str?  │          │    priority: enum    │
│    channel: enum     │          │    user_agent: str?  │          │    assigned_to: uuid?│
│    created_at: ts    │          │    created_at: ts    │          │    resolved_at: ts?  │
└──────────────────────┘          └──────────────────────┘          │    created_at: ts    │
                                                                    └──────────────────────┘
```

---

## Entity Definitions

### Core Entities

#### User

The base identity for all platform users (riders, drivers, admins).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `external_id` | VARCHAR(255) | UNIQUE | Azure AD B2C object ID |
| `phone` | VARCHAR(20) | UNIQUE, NOT NULL | Phone number (E.164 format) |
| `email` | VARCHAR(255) | UNIQUE | Email address (optional) |
| `first_name` | VARCHAR(100) | NOT NULL | First name |
| `last_name` | VARCHAR(100) | NOT NULL | Last name |
| `profile_photo_url` | VARCHAR(500) | | Blob storage URL |
| `role` | ENUM | NOT NULL | rider, driver, admin, support |
| `status` | ENUM | NOT NULL | active, suspended, deleted |
| `created_at` | TIMESTAMP | NOT NULL | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL | Last update time |
| `deleted_at` | TIMESTAMP | | Soft delete timestamp |

**Indexes:**
- `idx_user_phone` on `phone`
- `idx_user_email` on `email`
- `idx_user_external_id` on `external_id`

---

#### Driver

Extended profile for users who are drivers.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `user_id` | UUID | FK → User, UNIQUE | Link to User |
| `status` | ENUM | NOT NULL | pending, verified, active, inactive, suspended |
| `rating` | DECIMAL(3,2) | | Average rating (1.00-5.00) |
| `total_rides` | INTEGER | DEFAULT 0 | Completed rides count |
| `total_ratings` | INTEGER | DEFAULT 0 | Number of ratings received |
| `acceptance_rate` | DECIMAL(5,2) | | Ride acceptance percentage |
| `cancellation_rate` | DECIMAL(5,2) | | Cancellation percentage |
| `joined_at` | TIMESTAMP | NOT NULL | Platform join date |
| `verified_at` | TIMESTAMP | | Verification completion date |
| `home_location` | GEOGRAPHY(Point) | | Driver's home location |
| `current_location` | GEOGRAPHY(Point) | | Last known location (cached in Redis) |
| `is_online` | BOOLEAN | DEFAULT false | Currently accepting rides |
| `created_at` | TIMESTAMP | NOT NULL | Record creation time |

**Indexes:**
- `idx_driver_user_id` on `user_id`
- `idx_driver_status` on `status`
- `idx_driver_location` GIST on `home_location`

---

#### Vehicle

Vehicles registered by drivers.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `driver_id` | UUID | FK → Driver | Owner driver |
| `registration_number` | VARCHAR(20) | NOT NULL | License plate |
| `make` | VARCHAR(50) | NOT NULL | Manufacturer |
| `model` | VARCHAR(50) | NOT NULL | Model name |
| `year` | INTEGER | NOT NULL | Manufacturing year |
| `color` | VARCHAR(30) | NOT NULL | Vehicle color |
| `type` | ENUM | NOT NULL | sedan, suv, minivan |
| `seats` | INTEGER | NOT NULL | Passenger capacity |
| `status` | ENUM | NOT NULL | pending, verified, active, inactive |
| `verified_at` | TIMESTAMP | | Verification date |
| `is_primary` | BOOLEAN | DEFAULT false | Primary vehicle for driver |
| `created_at` | TIMESTAMP | NOT NULL | Record creation time |

**Indexes:**
- `idx_vehicle_driver_id` on `driver_id`
- `idx_vehicle_registration` on `registration_number`

---

#### Ride

Core ride entity tracking the full lifecycle.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `rider_id` | UUID | FK → User, NOT NULL | Requesting rider |
| `driver_id` | UUID | FK → Driver | Assigned driver |
| `vehicle_id` | UUID | FK → Vehicle | Vehicle used |
| `status` | ENUM | NOT NULL | See status enum below |
| `type` | ENUM | NOT NULL | standard, premium, school_run, corporate |
| `pickup_location` | GEOGRAPHY(Point) | NOT NULL | Pickup coordinates |
| `pickup_address` | VARCHAR(500) | NOT NULL | Pickup address text |
| `pickup_place_id` | VARCHAR(100) | | Google Place ID |
| `dropoff_location` | GEOGRAPHY(Point) | NOT NULL | Dropoff coordinates |
| `dropoff_address` | VARCHAR(500) | NOT NULL | Dropoff address text |
| `dropoff_place_id` | VARCHAR(100) | | Google Place ID |
| `scheduled_at` | TIMESTAMP | | For advance bookings |
| `requested_at` | TIMESTAMP | NOT NULL | Ride request time |
| `accepted_at` | TIMESTAMP | | Driver acceptance time |
| `arrived_at` | TIMESTAMP | | Driver arrival at pickup |
| `started_at` | TIMESTAMP | | Ride start time |
| `completed_at` | TIMESTAMP | | Ride completion time |
| `cancelled_at` | TIMESTAMP | | Cancellation time |
| `cancelled_by` | ENUM | | rider, driver, system |
| `cancellation_reason` | VARCHAR(500) | | Cancellation reason |
| `estimated_fare` | DECIMAL(10,2) | NOT NULL | Initial fare estimate |
| `final_fare` | DECIMAL(10,2) | | Actual fare charged |
| `estimated_distance_km` | DECIMAL(8,2) | | Estimated distance |
| `actual_distance_km` | DECIMAL(8,2) | | Actual distance traveled |
| `estimated_duration_min` | INTEGER | | Estimated duration |
| `actual_duration_min` | INTEGER | | Actual duration |
| `surge_multiplier` | DECIMAL(3,2) | DEFAULT 1.00 | Surge pricing factor |
| `promo_code` | VARCHAR(50) | | Applied promo code |
| `discount_amount` | DECIMAL(10,2) | | Discount applied |
| `notes` | VARCHAR(500) | | Rider notes to driver |
| `created_at` | TIMESTAMP | NOT NULL | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_ride_rider_id` on `rider_id`
- `idx_ride_driver_id` on `driver_id`
- `idx_ride_status` on `status`
- `idx_ride_requested_at` on `requested_at`
- `idx_ride_pickup_location` GIST on `pickup_location`

**Ride Status Enum:**
```
requested      → Initial request, finding driver
driver_assigned → Driver accepted, en route to pickup
driver_arrived → Driver at pickup location
in_progress    → Ride started, en route to dropoff
completed      → Ride finished successfully
cancelled      → Ride cancelled
no_drivers     → No drivers available (expired)
```

---

#### Payment

Payment transactions for rides.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `ride_id` | UUID | FK → Ride, NOT NULL | Associated ride |
| `payment_method_id` | UUID | FK → PaymentMethod | Payment method used |
| `amount` | DECIMAL(10,2) | NOT NULL | Payment amount |
| `currency` | VARCHAR(3) | DEFAULT 'ZAR' | Currency code |
| `status` | ENUM | NOT NULL | pending, processing, completed, failed, refunded |
| `provider` | ENUM | NOT NULL | payfast, card, cash |
| `provider_reference` | VARCHAR(255) | | PayFast transaction ID |
| `provider_response` | JSONB | | Raw provider response |
| `failure_reason` | VARCHAR(500) | | Failure description |
| `paid_at` | TIMESTAMP | | Payment completion time |
| `refunded_at` | TIMESTAMP | | Refund time |
| `refund_amount` | DECIMAL(10,2) | | Refund amount |
| `created_at` | TIMESTAMP | NOT NULL | Record creation time |

**Indexes:**
- `idx_payment_ride_id` on `ride_id`
- `idx_payment_status` on `status`
- `idx_payment_provider_ref` on `provider_reference`

---

### Supporting Entities

#### Driver Document

Documents uploaded by drivers for verification.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `driver_id` | UUID | FK → Driver | Owner driver |
| `type` | ENUM | NOT NULL | license, id_document, pdp, vehicle_registration, background_check |
| `file_url` | VARCHAR(500) | NOT NULL | Blob storage URL |
| `file_name` | VARCHAR(255) | NOT NULL | Original filename |
| `file_size` | INTEGER | | File size in bytes |
| `status` | ENUM | NOT NULL | pending, verified, rejected, expired |
| `expiry_date` | DATE | | Document expiry date |
| `verified_at` | TIMESTAMP | | Verification time |
| `verified_by` | UUID | FK → User | Admin who verified |
| `rejection_reason` | VARCHAR(500) | | Rejection reason |
| `uploaded_at` | TIMESTAMP | NOT NULL | Upload time |

---

#### Recurring Ride

Scheduled recurring rides (school runs, commutes).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `rider_id` | UUID | FK → User | Requesting rider |
| `driver_id` | UUID | FK → Driver | Assigned driver |
| `schedule` | JSONB | NOT NULL | Schedule definition |
| `pickup_location` | GEOGRAPHY(Point) | NOT NULL | Pickup coordinates |
| `pickup_address` | VARCHAR(500) | NOT NULL | Pickup address |
| `dropoff_location` | GEOGRAPHY(Point) | NOT NULL | Dropoff coordinates |
| `dropoff_address` | VARCHAR(500) | NOT NULL | Dropoff address |
| `type` | ENUM | NOT NULL | school_run, commute, custom |
| `status` | ENUM | NOT NULL | active, paused, cancelled |
| `start_date` | DATE | NOT NULL | Schedule start date |
| `end_date` | DATE | | Schedule end date |
| `notes` | VARCHAR(500) | | Special instructions |
| `created_at` | TIMESTAMP | NOT NULL | Record creation time |

**Schedule JSONB Structure:**
```json
{
  "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "time": "07:30",
  "return_trip": {
    "enabled": true,
    "time": "14:00"
  },
  "exceptions": ["2025-12-25", "2025-12-26"]
}
```

---

#### Driver Availability

Driver working hours and preferences.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `driver_id` | UUID | FK → Driver | Driver |
| `day_of_week` | INTEGER | NOT NULL | 0=Sunday, 6=Saturday |
| `start_time` | TIME | NOT NULL | Shift start time |
| `end_time` | TIME | NOT NULL | Shift end time |
| `is_preferred` | BOOLEAN | DEFAULT false | Preferred hours |
| `created_at` | TIMESTAMP | NOT NULL | Record creation time |

---

#### Driver Payout

Weekly payouts to drivers.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `driver_id` | UUID | FK → Driver | Driver |
| `period_start` | DATE | NOT NULL | Payout period start |
| `period_end` | DATE | NOT NULL | Payout period end |
| `gross_amount` | DECIMAL(10,2) | NOT NULL | Total earnings |
| `commission_amount` | DECIMAL(10,2) | NOT NULL | Platform commission |
| `net_amount` | DECIMAL(10,2) | NOT NULL | Net payout |
| `ride_count` | INTEGER | NOT NULL | Rides in period |
| `status` | ENUM | NOT NULL | pending, processing, paid, failed |
| `bank_reference` | VARCHAR(100) | | Bank transfer reference |
| `paid_at` | TIMESTAMP | | Payment time |
| `created_at` | TIMESTAMP | NOT NULL | Record creation time |

---

## Enumerations

### User Role
```sql
CREATE TYPE user_role AS ENUM ('rider', 'driver', 'admin', 'support');
```

### User Status
```sql
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
```

### Driver Status
```sql
CREATE TYPE driver_status AS ENUM ('pending', 'verified', 'active', 'inactive', 'suspended');
```

### Vehicle Type
```sql
CREATE TYPE vehicle_type AS ENUM ('sedan', 'suv', 'minivan');
```

### Ride Status
```sql
CREATE TYPE ride_status AS ENUM (
  'requested', 'driver_assigned', 'driver_arrived',
  'in_progress', 'completed', 'cancelled', 'no_drivers'
);
```

### Ride Type
```sql
CREATE TYPE ride_type AS ENUM ('standard', 'premium', 'school_run', 'corporate', 'scheduled');
```

### Payment Status
```sql
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
```

### Document Type
```sql
CREATE TYPE document_type AS ENUM (
  'license', 'id_document', 'pdp', 'vehicle_registration',
  'background_check', 'insurance'
);
```

### Document Status
```sql
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
```

---

## Relationships Summary

```
User (1) ──────────────── (0..1) Driver
User (1) ──────────────── (0..1) RiderProfile
User (1) ──────────────── (N) Ride (as rider)
User (1) ──────────────── (N) PaymentMethod
User (1) ──────────────── (N) SavedPlace
User (1) ──────────────── (N) Notification

Driver (1) ─────────────── (N) Vehicle
Driver (1) ─────────────── (N) DriverDocument
Driver (1) ─────────────── (N) DriverAvailability
Driver (1) ─────────────── (N) Ride (as driver)
Driver (1) ─────────────── (N) DriverPayout
Driver (1) ─────────────── (N) RecurringRide

Ride (1) ──────────────── (1) Payment
Ride (1) ──────────────── (N) RideTracking
Ride (1) ──────────────── (0..1) RideRating
Ride (1) ──────────────── (0..1) SupportTicket

Vehicle (1) ────────────── (N) VehiclePhoto
```

---

## Database Design Decisions

### PostgreSQL Extensions

```sql
-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "postgis";         -- Geospatial support
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Text search
```

### Soft Deletes

All user-facing entities use soft deletes:
```sql
deleted_at TIMESTAMP NULL
```

Queries should filter: `WHERE deleted_at IS NULL`

### Timestamps

All tables include:
```sql
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP NOT NULL DEFAULT NOW()
```

With trigger:
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Geospatial Queries

Location queries use PostGIS:
```sql
-- Find drivers within 5km
SELECT d.* FROM driver d
WHERE ST_DWithin(
  d.current_location::geography,
  ST_SetSRID(ST_MakePoint(-26.2041, 28.0473), 4326)::geography,
  5000  -- meters
)
AND d.is_online = true
AND d.status = 'active';
```

### JSONB Usage

Used for flexible structures:
- `recurring_ride.schedule` - Complex schedule definitions
- `payment.provider_response` - External API responses
- `notification.data` - Variable notification payloads

---

## Migration Strategy

### Initial Schema

```sql
-- Example: Create rides table
CREATE TABLE ride (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES "user"(id),
  driver_id UUID REFERENCES driver(id),
  vehicle_id UUID REFERENCES vehicle(id),
  status ride_status NOT NULL DEFAULT 'requested',
  type ride_type NOT NULL DEFAULT 'standard',
  pickup_location GEOGRAPHY(Point, 4326) NOT NULL,
  pickup_address VARCHAR(500) NOT NULL,
  dropoff_location GEOGRAPHY(Point, 4326) NOT NULL,
  dropoff_address VARCHAR(500) NOT NULL,
  scheduled_at TIMESTAMP,
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  estimated_fare DECIMAL(10,2) NOT NULL,
  final_fare DECIMAL(10,2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ride_rider_id ON ride(rider_id);
CREATE INDEX idx_ride_driver_id ON ride(driver_id);
CREATE INDEX idx_ride_status ON ride(status);
CREATE INDEX idx_ride_pickup_location ON ride USING GIST(pickup_location);
```

---

## Related Documents

- [Architecture Overview](architecture.md)
- [API Reference](api-reference.md)
- [ADR-002: Database (PostgreSQL)](../adr/002-database-postgresql.md)

---

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)
