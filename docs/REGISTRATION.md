# Event Registration API

## Overview
The Event Registration API manages the complete lifecycle of event registrations including registration, status updates, cancellation, and hall ticket generation.

**Base URL:** `/api/v1/registrations`

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Endpoints

### 1. Register for Event
**POST** `/api/v1/registrations`

Register for an event (free events only, paid events require payment flow).

**Request Body:**
```json
{
  "eventId": "string (required)",
  "ticketType": "string (required)",
  "registrationNumber": "string (required)",
  "phoneNumber": "string (required)",
  "college": "string (required)",
  "department": "string (required)",
  "yearOfStudy": "string (required)",
  "dietaryPreferences": "string (optional)",
  "specialRequirements": "string (optional)",
  "emergencyContact": {
    "name": "string (required)",
    "phone": "string (required)",
    "relationship": "string (required)"
  },
  "tshirtSize": "string (optional)",
  "notes": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": {
    "_id": "string",
    "user": "string",
    "event": "string",
    "status": "confirmed",
    "ticketType": "string",
    "registrationNumber": "string",
    "phoneNumber": "string",
    "college": "string",
    "department": "string",
    "yearOfStudy": "string",
    "dietaryPreferences": "string",
    "specialRequirements": "string",
    "emergencyContact": {
      "name": "string",
      "phone": "string",
      "relationship": "string"
    },
    "tshirtSize": "string",
    "notes": "string",
    "registeredAt": "date",
    "confirmedAt": "date",
    "hallTicket": "string"
  },
  "hallTicket": "string"
}
```

**Error Responses:**
- `400 Bad Request`: "Event is not active" or "You are already registered for this event" or "Event is full" or "This is a paid event. Please create a payment order and complete payment to confirm registration."
- `404 Not Found`: "Event not found"
- `500 Internal Server Error`: "Failed to register for event"

### 2. Update Registration
**PUT** `/api/v1/registrations`

Update registration details.

**Request Body:**
```json
{
  "ticketType": "string (optional)",
  "phoneNumber": "string (optional)",
  "college": "string (optional)",
  "department": "string (optional)",
  "yearOfStudy": "string (optional)",
  "dietaryPreferences": "string (optional)",
  "specialRequirements": "string (optional)",
  "emergencyContact": {
    "name": "string (required)",
    "phone": "string (required)",
    "relationship": "string (required)"
  },
  "tshirtSize": "string (optional)",
  "notes": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration updated successfully",
  "data": {
    "_id": "string",
    "user": "string",
    "event": {
      "title": "string",
      "date": "date"
    },
    "status": "string",
    "ticketType": "string",
    "phoneNumber": "string",
    "college": "string",
    "department": "string",
    "yearOfStudy": "string",
    "dietaryPreferences": "string",
    "specialRequirements": "string",
    "emergencyContact": {
      "name": "string",
      "phone": "string",
      "relationship": "string"
    },
    "tshirtSize": "string",
    "notes": "string",
    "registeredAt": "date"
  }
}
```

**Error Responses:**
- `400 Bad Request`: "Cannot update registration that has been cancelled, failed, or refunded"
- `404 Not Found`: "No registration found for this user"
- `500 Internal Server Error`: "Failed to update registration"

### 3. Get User Registrations
**GET** `/api/v1/registrations`

Get current user's registrations.

**Query Parameters:**
- `status` (optional): Filter by status

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registrations fetched successfully",
  "data": [
    {
      "_id": "string",
      "user": {
        "name": "string",
        "email": "string",
        "image": "string"
      },
      "event": {
        "title": "string",
        "date": "date",
        "startTime": "string",
        "endTime": "string",
        "venue": "string",
        "location": "string",
        "category": "string"
      },
      "status": "string",
      "ticketType": "string",
      "registrationNumber": "string",
      "phoneNumber": "string",
      "college": "string",
      "department": "string",
      "yearOfStudy": "string",
      "dietaryPreferences": "string",
      "specialRequirements": "string",
      "emergencyContact": {
        "name": "string",
        "phone": "string",
        "relationship": "string"
      },
      "tshirtSize": "string",
      "notes": "string",
      "registeredAt": "date"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to fetch registrations"

### 4. Get Event Registrations
**GET** `/api/v1/registrations/event/:eventId`

Get all registrations for a specific event (admin/organizer only).

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event registrations fetched successfully",
  "data": [
    {
      "_id": "string",
      "user": {
        "name": "string",
        "email": "string",
        "image": "string",
        "role": "string"
      },
      "event": {
        "title": "string",
        "date": "date",
        "startTime": "string",
        "endTime": "string",
        "venue": "string"
      },
      "status": "string",
      "ticketType": "string",
      "registrationNumber": "string",
      "phoneNumber": "string",
      "college": "string",
      "department": "string",
      "yearOfStudy": "string",
      "dietaryPreferences": "string",
      "specialRequirements": "string",
      "emergencyContact": {
        "name": "string",
        "phone": "string",
        "relationship": "string"
      },
      "tshirtSize": "string",
      "notes": "string",
      "registeredAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to fetch event registrations"

### 5. Update Registration Status
**PUT** `/api/v1/registrations/:registrationId/status`

Update registration status (admin/organizer only).

**Request Body:**
```json
{
  "status": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration status updated successfully",
  "data": {
    "_id": "string",
    "user": {
      "name": "string",
      "email": "string",
      "image": "string"
    },
    "event": {
      "title": "string",
      "date": "date",
      "startTime": "string",
      "endTime": "string",
      "venue": "string",
      "location": "string"
    },
    "status": "string",
    "ticketType": "string",
    "registrationNumber": "string",
    "phoneNumber": "string",
    "college": "string",
    "department": "string",
    "yearOfStudy": "string",
    "dietaryPreferences": "string",
    "specialRequirements": "string",
    "emergencyContact": {
      "name": "string",
      "phone": "string",
      "relationship": "string"
    },
    "tshirtSize": "string",
    "notes": "string",
    "registeredAt": "date"
  }
}
```

**Error Responses:**
- `403 Forbidden`: "You don't have permission to update this registration"
- `404 Not Found`: "Registration not found"
- `500 Internal Server Error`: "Failed to update registration status"

### 6. Cancel Registration
**DELETE** `/api/v1/registrations/:registrationId`

Cancel a registration.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

**Error Responses:**
- `400 Bad Request`: "Cannot cancel registration for an event that has already started"
- `403 Forbidden`: "You can only cancel your own registration"
- `404 Not Found`: "Registration not found"
- `500 Internal Server Error`: "Failed to cancel registration"

### 7. Get Hall Ticket
**GET** `/api/v1/registrations/:registrationId/hall-ticket`

Get hall ticket for a registration.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Hall ticket generated successfully",
  "data": {
    "registration": {
      "_id": "string",
      "user": {
        "name": "string",
        "email": "string",
        "image": "string"
      },
      "event": {
        "title": "string",
        "date": "date",
        "startTime": "string",
        "endTime": "string",
        "venue": "string",
        "location": "string",
        "category": "string"
      },
      "status": "string",
      "ticketType": "string",
      "registrationNumber": "string",
      "phoneNumber": "string",
      "college": "string",
      "department": "string",
      "yearOfStudy": "string",
      "dietaryPreferences": "string",
      "specialRequirements": "string",
      "emergencyContact": {
        "name": "string",
        "phone": "string",
        "relationship": "string"
      },
      "tshirtSize": "string",
      "notes": "string",
      "registeredAt": "date"
    },
    "hallTicket": "string"
  }
}
```

**Error Responses:**
- `403 Forbidden`: "You can only view your own hall ticket"
- `404 Not Found`: "Registration not found"
- `500 Internal Server Error`: "Failed to generate hall ticket"

### 8. Get Hall Ticket for User
**GET** `/api/v1/registrations/user/:userId/event/:eventId/hall-ticket`

Get hall ticket for any user (admin/organizer only).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Hall ticket generated successfully",
  "data": {
    "registration": {
      "_id": "string",
      "user": {
        "name": "string",
        "email": "string",
        "image": "string"
      },
      "event": {
        "title": "string",
        "date": "date",
        "startTime": "string",
        "endTime": "string",
        "venue": "string",
        "location": "string",
        "category": "string"
      },
      "status": "string",
      "ticketType": "string",
      "registrationNumber": "string",
      "phoneNumber": "string",
      "college": "string",
      "department": "string",
      "yearOfStudy": "string",
      "dietaryPreferences": "string",
      "specialRequirements": "string",
      "emergencyContact": {
        "name": "string",
        "phone": "string",
        "relationship": "string"
      },
      "tshirtSize": "string",
      "notes": "string",
      "registeredAt": "date"
    },
    "hallTicket": "string"
  }
}
```

**Error Responses:**
- `403 Forbidden`: "Only admins and organizers can access this endpoint"
- `404 Not Found`: "Registration not found for this user and event"
- `500 Internal Server Error`: "Failed to generate hall ticket"

### 9. Get All Event Hall Tickets
**GET** `/api/v1/registrations/event/:eventId/hall-tickets`

Get all hall tickets for an event (admin/organizer only).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All hall tickets generated successfully",
  "data": [
    {
      "registration": {
        "_id": "string",
        "user": {
          "name": "string",
          "email": "string",
          "image": "string"
        },
        "event": {
          "title": "string",
          "date": "date",
          "startTime": "string",
          "endTime": "string",
          "venue": "string",
          "location": "string",
          "category": "string"
        },
        "status": "string",
        "ticketType": "string",
        "registrationNumber": "string",
        "phoneNumber": "string",
        "college": "string",
        "department": "string",
        "yearOfStudy": "string",
        "dietaryPreferences": "string",
        "specialRequirements": "string",
        "emergencyContact": {
          "name": "string",
          "phone": "string",
          "relationship": "string"
        },
        "tshirtSize": "string",
        "notes": "string",
        "registeredAt": "date"
      },
      "hallTicket": "string"
    }
  ],
  "count": 25
}
```

**Error Responses:**
- `403 Forbidden`: "Only admins and organizers can access this endpoint"
- `500 Internal Server Error`: "Failed to generate hall tickets"

## Data Models

### Registration
```typescript
interface Registration {
  _id: ObjectId;
  user: ObjectId;
  event: ObjectId;
  status: "pending" | "confirmed" | "cancelled" | "failed" | "refunded";
  ticketType: string;
  paymentOrderId?: string;
  amount?: number;
  paymentId?: string;
  paymentVerifiedAt?: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  registrationNumber: string;
  phoneNumber: string;
  college: string;
  department: string;
  yearOfStudy: string;
  dietaryPreferences?: string;
  specialRequirements?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  tshirtSize?: string;
  notes?: string;
  registeredAt: Date;
  hallTicket?: string;
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message description",
  "error": "Error details"
}
```

## Security Features

1. **Authentication Required**: All endpoints require valid JWT token
2. **Role-Based Access**: Admin/organizer endpoints restricted to appropriate users
3. **Ownership Validation**: Users can only access their own registrations
4. **Business Logic**: Prevents cancellation of started events
5. **Payment Integration**: Paid events require payment flow

## Business Logic

1. **Free Events**: Direct registration with confirmed status
2. **Paid Events**: Require payment order creation and completion
3. **Status Management**: Automatic status updates based on payment
4. **Side Effects**: Automatic participant count and ticket updates
5. **Hall Ticket Generation**: Available for confirmed registrations

## Testing Examples

### Register for Event
```bash
curl -X POST /api/v1/registrations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "ticketType": "Student",
    "registrationNumber": "REG001",
    "phoneNumber": "+1234567890",
    "college": "MIT",
    "department": "Computer Science",
    "yearOfStudy": "3rd Year"
  }'
```

### Get User Registrations
```bash
curl -X GET /api/v1/registrations \
  -H "Authorization: Bearer <token>"
```

### Cancel Registration
```bash
curl -X DELETE /api/v1/registrations/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer <token>"
```

### Get Hall Ticket
```bash
curl -X GET /api/v1/registrations/64f1a2b3c4d5e6f7g8h9i0j1/hall-ticket \
  -H "Authorization: Bearer <token>"
```
