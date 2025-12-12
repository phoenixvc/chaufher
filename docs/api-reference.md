# ChaufHER API Reference

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Base URL:** `https://api.chaufher.co.za/v1`

---

## Overview

The ChaufHER API is a RESTful API that provides access to the ride-hailing platform functionality. All endpoints require authentication unless otherwise noted.

### API Conventions

| Convention | Description |
|------------|-------------|
| **Base URL** | `https://api.chaufher.co.za/v1` |
| **Format** | JSON (application/json) |
| **Authentication** | Bearer token (JWT) |
| **Pagination** | `?page=1&limit=20` |
| **Dates** | ISO 8601 format (UTC) |
| **IDs** | UUID v4 |
| **Errors** | RFC 7807 Problem Details |

### Common Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid>  # Optional, for tracing
```

### Error Response Format

```json
{
  "type": "https://api.chaufher.co.za/errors/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "instance": "/api/v1/rides",
  "errors": {
    "pickup_location": ["Pickup location is required"]
  },
  "traceId": "00-abc123-def456-00"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Authentication

### POST /auth/login

Initiate phone-based login with OTP.

**Request:**
```json
{
  "phone": "+27821234567"
}
```

**Response:** `200 OK`
```json
{
  "message": "OTP sent successfully",
  "expires_in": 300,
  "masked_phone": "+27***4567"
}
```

**Rate Limit:** 3 requests per 5 minutes per phone number

---

### POST /auth/verify

Verify OTP and receive tokens.

**Request:**
```json
{
  "phone": "+27821234567",
  "otp": "123456"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJl...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "+27821234567",
    "first_name": "Sarah",
    "last_name": "Johnson",
    "role": "rider",
    "is_new_user": false
  }
}
```

---

### POST /auth/refresh

Refresh access token.

**Request:**
```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJl..."
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "expires_in": 900
}
```

---

### POST /auth/logout

Invalidate current session.

**Response:** `204 No Content`

---

## Users

### GET /users/me

Get current user profile.

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "phone": "+27821234567",
  "email": "sarah@example.com",
  "first_name": "Sarah",
  "last_name": "Johnson",
  "profile_photo_url": "https://storage.chaufher.co.za/photos/abc123.jpg",
  "role": "rider",
  "status": "active",
  "created_at": "2025-01-15T10:30:00Z",
  "rider_profile": {
    "default_payment_method_id": "pm_123",
    "emergency_contact_name": "John Johnson",
    "emergency_contact_phone": "+27829876543"
  }
}
```

---

### PUT /users/me

Update current user profile.

**Request:**
```json
{
  "first_name": "Sarah",
  "last_name": "Johnson-Smith",
  "email": "sarah.new@example.com"
}
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Sarah",
  "last_name": "Johnson-Smith",
  "email": "sarah.new@example.com",
  "updated_at": "2025-12-12T15:00:00Z"
}
```

---

### POST /users/me/photo

Upload profile photo.

**Request:** `multipart/form-data`
```
photo: <binary file>
```

**Response:** `200 OK`
```json
{
  "profile_photo_url": "https://storage.chaufher.co.za/photos/new123.jpg"
}
```

---

### DELETE /users/me

Delete account (soft delete with data anonymization).

**Response:** `204 No Content`

---

## Rides

### POST /rides/estimate

Get fare estimate for a ride.

**Request:**
```json
{
  "pickup": {
    "latitude": -26.2041,
    "longitude": 28.0473,
    "address": "123 Main Street, Sandton"
  },
  "dropoff": {
    "latitude": -26.1076,
    "longitude": 28.0567,
    "address": "456 Oak Avenue, Rosebank"
  },
  "ride_type": "standard"
}
```

**Response:** `200 OK`
```json
{
  "estimate": {
    "fare_min": 85.00,
    "fare_max": 105.00,
    "currency": "ZAR",
    "distance_km": 8.5,
    "duration_min": 18,
    "surge_multiplier": 1.0
  },
  "pickup": {
    "latitude": -26.2041,
    "longitude": 28.0473,
    "address": "123 Main Street, Sandton",
    "place_id": "ChIJ..."
  },
  "dropoff": {
    "latitude": -26.1076,
    "longitude": 28.0567,
    "address": "456 Oak Avenue, Rosebank",
    "place_id": "ChIJ..."
  },
  "available_types": [
    {
      "type": "standard",
      "name": "ChaufHER",
      "fare_min": 85.00,
      "fare_max": 105.00,
      "eta_min": 5
    },
    {
      "type": "premium",
      "name": "ChaufHER Premium",
      "fare_min": 120.00,
      "fare_max": 145.00,
      "eta_min": 8
    }
  ]
}
```

---

### POST /rides

Request a new ride.

**Request:**
```json
{
  "pickup": {
    "latitude": -26.2041,
    "longitude": 28.0473,
    "address": "123 Main Street, Sandton",
    "place_id": "ChIJ..."
  },
  "dropoff": {
    "latitude": -26.1076,
    "longitude": 28.0567,
    "address": "456 Oak Avenue, Rosebank",
    "place_id": "ChIJ..."
  },
  "ride_type": "standard",
  "payment_method_id": "pm_123",
  "scheduled_at": null,
  "notes": "Please call when arriving"
}
```

**Response:** `201 Created`
```json
{
  "id": "ride_550e8400-e29b-41d4-a716-446655440000",
  "status": "requested",
  "type": "standard",
  "pickup": {
    "latitude": -26.2041,
    "longitude": 28.0473,
    "address": "123 Main Street, Sandton"
  },
  "dropoff": {
    "latitude": -26.1076,
    "longitude": 28.0567,
    "address": "456 Oak Avenue, Rosebank"
  },
  "estimated_fare": 95.00,
  "currency": "ZAR",
  "requested_at": "2025-12-12T15:30:00Z",
  "driver": null,
  "vehicle": null
}
```

---

### GET /rides/{id}

Get ride details.

**Response:** `200 OK`
```json
{
  "id": "ride_550e8400-e29b-41d4-a716-446655440000",
  "status": "in_progress",
  "type": "standard",
  "pickup": {
    "latitude": -26.2041,
    "longitude": 28.0473,
    "address": "123 Main Street, Sandton"
  },
  "dropoff": {
    "latitude": -26.1076,
    "longitude": 28.0567,
    "address": "456 Oak Avenue, Rosebank"
  },
  "estimated_fare": 95.00,
  "currency": "ZAR",
  "requested_at": "2025-12-12T15:30:00Z",
  "accepted_at": "2025-12-12T15:31:00Z",
  "started_at": "2025-12-12T15:38:00Z",
  "driver": {
    "id": "drv_123",
    "first_name": "Nomsa",
    "profile_photo_url": "https://storage.chaufher.co.za/photos/nomsa.jpg",
    "rating": 4.92,
    "phone": "+27831234567"
  },
  "vehicle": {
    "make": "Toyota",
    "model": "Corolla",
    "color": "White",
    "registration": "ABC 123 GP"
  },
  "current_location": {
    "latitude": -26.1523,
    "longitude": 28.0512
  },
  "eta_minutes": 8
}
```

---

### GET /rides

List rider's ride history.

**Query Parameters:**
- `status` - Filter by status (completed, cancelled)
- `from` - Start date (ISO 8601)
- `to` - End date (ISO 8601)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "ride_123",
      "status": "completed",
      "type": "standard",
      "pickup_address": "123 Main Street, Sandton",
      "dropoff_address": "456 Oak Avenue, Rosebank",
      "final_fare": 92.50,
      "completed_at": "2025-12-12T16:05:00Z",
      "driver": {
        "first_name": "Nomsa",
        "rating": 4.92
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

### PUT /rides/{id}/cancel

Cancel a ride.

**Request:**
```json
{
  "reason": "Changed plans"
}
```

**Response:** `200 OK`
```json
{
  "id": "ride_123",
  "status": "cancelled",
  "cancelled_at": "2025-12-12T15:32:00Z",
  "cancellation_fee": 15.00
}
```

---

### POST /rides/{id}/rate

Rate a completed ride.

**Request:**
```json
{
  "rating": 5,
  "comment": "Great driver, very professional!",
  "tags": ["safe_driving", "friendly", "clean_car"]
}
```

**Response:** `200 OK`
```json
{
  "message": "Rating submitted successfully"
}
```

---

## Drivers

### POST /drivers/apply

Submit driver application.

**Request:**
```json
{
  "id_number": "9001015800086",
  "license_number": "ABC123456",
  "pdp_number": "PDP987654",
  "vehicle": {
    "registration": "ABC 123 GP",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "color": "White",
    "type": "sedan"
  }
}
```

**Response:** `201 Created`
```json
{
  "application_id": "app_123",
  "status": "pending",
  "next_steps": [
    "Upload driver's license photo",
    "Upload ID document",
    "Upload PDP",
    "Upload vehicle photos",
    "Complete background check"
  ]
}
```

---

### GET /drivers/me

Get current driver profile (driver role required).

**Response:** `200 OK`
```json
{
  "id": "drv_123",
  "status": "active",
  "rating": 4.92,
  "total_rides": 1523,
  "acceptance_rate": 94.5,
  "is_online": true,
  "current_location": {
    "latitude": -26.2041,
    "longitude": 28.0473
  },
  "vehicles": [
    {
      "id": "veh_123",
      "registration": "ABC 123 GP",
      "make": "Toyota",
      "model": "Corolla",
      "is_primary": true,
      "status": "active"
    }
  ],
  "documents": {
    "license": { "status": "verified", "expiry": "2027-03-15" },
    "id_document": { "status": "verified" },
    "pdp": { "status": "verified", "expiry": "2026-08-20" }
  },
  "earnings": {
    "today": 450.00,
    "this_week": 3250.00,
    "pending_payout": 2800.00
  }
}
```

---

### PUT /drivers/me/status

Toggle driver online/offline status.

**Request:**
```json
{
  "is_online": true,
  "vehicle_id": "veh_123"
}
```

**Response:** `200 OK`
```json
{
  "is_online": true,
  "went_online_at": "2025-12-12T08:00:00Z"
}
```

---

### PUT /drivers/me/location

Update driver location (called frequently when online).

**Request:**
```json
{
  "latitude": -26.2041,
  "longitude": 28.0473,
  "heading": 180.5,
  "speed": 45.2
}
```

**Response:** `204 No Content`

**Rate Limit:** 1 request per second

---

### GET /drivers/rides/current

Get driver's current active ride.

**Response:** `200 OK`
```json
{
  "id": "ride_123",
  "status": "driver_assigned",
  "rider": {
    "first_name": "Sarah",
    "rating": 4.85,
    "phone": "+27821234567"
  },
  "pickup": {
    "latitude": -26.2041,
    "longitude": 28.0473,
    "address": "123 Main Street, Sandton"
  },
  "dropoff": {
    "latitude": -26.1076,
    "longitude": 28.0567,
    "address": "456 Oak Avenue, Rosebank"
  },
  "notes": "Please call when arriving",
  "estimated_fare": 95.00
}
```

---

### PUT /drivers/rides/{id}/accept

Accept a ride offer.

**Response:** `200 OK`
```json
{
  "id": "ride_123",
  "status": "driver_assigned",
  "eta_to_pickup": 5
}
```

---

### PUT /drivers/rides/{id}/arrived

Mark arrival at pickup.

**Response:** `200 OK`
```json
{
  "id": "ride_123",
  "status": "driver_arrived",
  "arrived_at": "2025-12-12T15:38:00Z"
}
```

---

### PUT /drivers/rides/{id}/start

Start the ride.

**Request:**
```json
{
  "verification_code": "1234"
}
```

**Response:** `200 OK`
```json
{
  "id": "ride_123",
  "status": "in_progress",
  "started_at": "2025-12-12T15:40:00Z"
}
```

---

### PUT /drivers/rides/{id}/complete

Complete the ride.

**Request:**
```json
{
  "end_location": {
    "latitude": -26.1076,
    "longitude": 28.0567
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "ride_123",
  "status": "completed",
  "completed_at": "2025-12-12T16:05:00Z",
  "final_fare": 92.50,
  "distance_km": 8.2,
  "duration_min": 25,
  "driver_earnings": 74.00
}
```

---

### GET /drivers/earnings

Get driver earnings summary.

**Query Parameters:**
- `period` - today, this_week, this_month, custom
- `from` - Start date (for custom period)
- `to` - End date (for custom period)

**Response:** `200 OK`
```json
{
  "period": {
    "from": "2025-12-09",
    "to": "2025-12-15"
  },
  "summary": {
    "gross_earnings": 4250.00,
    "commission": 637.50,
    "net_earnings": 3612.50,
    "tips": 180.00,
    "total": 3792.50,
    "ride_count": 52,
    "online_hours": 42.5
  },
  "daily_breakdown": [
    {
      "date": "2025-12-12",
      "gross": 650.00,
      "net": 552.50,
      "rides": 8
    }
  ]
}
```

---

## Payments

### GET /payments/methods

List user's payment methods.

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "pm_123",
      "type": "card",
      "provider": "payfast",
      "last_four": "4242",
      "brand": "visa",
      "is_default": true
    },
    {
      "id": "pm_456",
      "type": "wallet",
      "provider": "snapscan",
      "is_default": false
    }
  ]
}
```

---

### POST /payments/methods

Add a payment method.

**Request:**
```json
{
  "type": "card",
  "return_url": "https://app.chaufher.co.za/payment/callback"
}
```

**Response:** `200 OK`
```json
{
  "redirect_url": "https://www.payfast.co.za/eng/process?...",
  "session_id": "sess_123"
}
```

---

### DELETE /payments/methods/{id}

Remove a payment method.

**Response:** `204 No Content`

---

### GET /payments/history

Get payment history.

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "pay_123",
      "ride_id": "ride_123",
      "amount": 92.50,
      "currency": "ZAR",
      "status": "completed",
      "payment_method": {
        "type": "card",
        "last_four": "4242"
      },
      "paid_at": "2025-12-12T16:05:30Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

---

## Saved Places

### GET /places

List user's saved places.

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "place_123",
      "name": "Home",
      "address": "123 Main Street, Sandton",
      "latitude": -26.2041,
      "longitude": 28.0473,
      "type": "home"
    },
    {
      "id": "place_456",
      "name": "Work",
      "address": "456 Office Park, Rosebank",
      "latitude": -26.1076,
      "longitude": 28.0567,
      "type": "work"
    }
  ]
}
```

---

### POST /places

Add a saved place.

**Request:**
```json
{
  "name": "Gym",
  "address": "789 Fitness Ave, Sandton",
  "latitude": -26.1890,
  "longitude": 28.0523,
  "type": "other"
}
```

**Response:** `201 Created`
```json
{
  "id": "place_789",
  "name": "Gym",
  "address": "789 Fitness Ave, Sandton",
  "type": "other"
}
```

---

## Notifications

### GET /notifications

List user notifications.

**Query Parameters:**
- `unread_only` - true/false
- `page` - Page number
- `limit` - Items per page

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "notif_123",
      "type": "ride_completed",
      "title": "Ride Completed",
      "body": "Your ride to Rosebank has been completed. Fare: R92.50",
      "read_at": null,
      "created_at": "2025-12-12T16:05:30Z",
      "data": {
        "ride_id": "ride_123"
      }
    }
  ],
  "unread_count": 3
}
```

---

### PUT /notifications/{id}/read

Mark notification as read.

**Response:** `204 No Content`

---

### PUT /notifications/read-all

Mark all notifications as read.

**Response:** `204 No Content`

---

## Feature Flags

### GET /feature-flags

Get feature flags for current user.

**Response:** `200 OK`
```json
{
  "new_booking_flow": true,
  "school_run_feature": true,
  "premium_rides": false,
  "driver_tips": true,
  "scheduled_rides": true
}
```

---

## WebSocket / SignalR

### Connection

Connect to SignalR hub for real-time updates.

**URL:** `wss://api.chaufher.co.za/hubs/ride`

**Authentication:** Pass JWT token as query parameter or in headers.

### Events (Server → Client)

#### RideStatusChanged
```json
{
  "type": "RideStatusChanged",
  "data": {
    "ride_id": "ride_123",
    "status": "driver_assigned",
    "driver": { ... },
    "eta_minutes": 5
  }
}
```

#### DriverLocationUpdated
```json
{
  "type": "DriverLocationUpdated",
  "data": {
    "ride_id": "ride_123",
    "location": {
      "latitude": -26.1890,
      "longitude": 28.0523
    },
    "eta_minutes": 3
  }
}
```

#### RideOffer (Driver)
```json
{
  "type": "RideOffer",
  "data": {
    "ride_id": "ride_123",
    "pickup": { ... },
    "dropoff": { ... },
    "estimated_fare": 95.00,
    "expires_in": 15
  }
}
```

---

## Admin Endpoints

*Requires admin role*

### GET /admin/dashboard

Get dashboard metrics.

**Response:** `200 OK`
```json
{
  "today": {
    "rides_completed": 1250,
    "rides_cancelled": 45,
    "revenue": 125000.00,
    "active_drivers": 89,
    "active_riders": 2340
  },
  "comparison": {
    "rides_change_percent": 12.5,
    "revenue_change_percent": 8.2
  }
}
```

### GET /admin/drivers

List all drivers with filters.

### GET /admin/rides

List all rides with filters.

### PUT /admin/drivers/{id}/verify

Verify a driver.

### PUT /admin/drivers/{id}/suspend

Suspend a driver.

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 3 | 5 min |
| POST /auth/verify | 5 | 5 min |
| POST /rides/estimate | 30 | 1 min |
| POST /rides | 10 | 1 min |
| PUT /drivers/me/location | 60 | 1 min |
| General | 1000 | 1 min |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 998
X-RateLimit-Reset: 1702396800
```

---

## Versioning

The API uses URL-based versioning (`/v1/`). Breaking changes will be introduced in new versions with deprecation notices for old versions.

---

## SDKs & Tools

- **OpenAPI Spec:** `https://api.chaufher.co.za/swagger/v1/swagger.json`
- **Postman Collection:** Available in repository
- **TypeScript Types:** Generated from OpenAPI

---

## Related Documents

- [Data Model](data-model.md)
- [Architecture Overview](architecture.md)
- [ADR-009: Backend Framework (.NET 9)](../adr/009-backend-framework-dotnet.md)
