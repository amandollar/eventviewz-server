# Payment Processing API

## Overview
The Payment Processing API handles Razorpay integration for event registrations, including order creation, payment verification, and webhook processing.

**Base URL:** `/api/v1/payments`

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Endpoints

### 1. Create Payment Order
**POST** `/api/v1/payments/create-order`

Create a payment order for event registration.

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
  "message": "Payment order created successfully",
  "order": {
    "id": "string",
    "amount": "number",
    "currency": "string",
    "receipt": "string"
  },
  "registration": {
    "id": "string",
    "status": "pending",
    "ticketType": "string",
    "amount": "number"
  },
  "razorpayKeyId": "string"
}
```

**Error Responses:**
- `400 Bad Request`: "Event ID and ticket type are required" or "registrationNumber, phoneNumber, college, department and yearOfStudy are required" or "Tickets not available" or "Already registered for this event"
- `404 Not Found`: "Event not found" or "Ticket type not found"
- `500 Internal Server Error`: "Failed to create payment order"

### 2. Razorpay Webhook
**POST** `/api/v1/payments/webhook`

Handle Razorpay webhook events (no authentication required).

**Headers:**
- `x-razorpay-signature`: Webhook signature for verification

**Request Body:**
```json
{
  "event": "payment.captured|payment.failed",
  "payload": {
    "payment": {
      "entity": {
        "id": "string",
        "order_id": "string"
      }
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
- `400 Bad Request`: "Invalid webhook signature"
- `500 Internal Server Error`: Webhook processing failed

### 3. Get Payment Status
**GET** `/api/v1/payments/status/:registrationId`

Get payment status for a registration.

**Response (200 OK):**
```json
{
  "success": true,
  "registration": {
    "id": "string",
    "status": "string",
    "ticketType": "string",
    "amount": "number",
    "paymentOrderId": "string",
    "paymentId": "string",
    "paymentVerifiedAt": "date",
    "confirmedAt": "date",
    "hallTicket": "string",
    "event": {
      "title": "string",
      "date": "date",
      "venue": "string"
    },
    "user": {
      "name": "string",
      "email": "string"
    }
  }
}
```

**Error Responses:**
- `403 Forbidden`: "Access denied"
- `404 Not Found`: "Registration not found"
- `500 Internal Server Error`: "Failed to get payment status"

### 4. Cancel Payment Order
**DELETE** `/api/v1/payments/cancel/:registrationId`

Cancel a payment order.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment order cancelled successfully",
  "registration": {
    "id": "string",
    "status": "cancelled",
    "cancelledAt": "date"
  }
}
```

**Error Responses:**
- `400 Bad Request`: "Cannot cancel confirmed registration"
- `403 Forbidden`: "Access denied"
- `404 Not Found`: "Registration not found"
- `500 Internal Server Error`: "Failed to cancel payment order"

### 5. Get Payment History
**GET** `/api/v1/payments/history`

Get user's payment history.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "registrations": [
    {
      "id": "string",
      "status": "string",
      "ticketType": "string",
      "amount": "number",
      "paymentOrderId": "string",
      "paymentId": "string",
      "paymentVerifiedAt": "date",
      "confirmedAt": "date",
      "cancelledAt": "date",
      "hallTicket": "string",
      "event": {
        "title": "string",
        "date": "date",
        "venue": "string",
        "image": "string"
      },
      "registeredAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to get payment history"

## Data Models

### Payment Order
```typescript
interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    eventId: string;
    userId: string;
    ticketType: string;
    eventTitle: string;
  };
}
```

### Registration (Payment)
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
  "error": "Error message description"
}
```

## Security Features

1. **Webhook Verification**: HMAC SHA256 signature verification
2. **Authentication Required**: All endpoints (except webhook) require JWT
3. **Ownership Validation**: Users can only access their own payments
4. **Payment Security**: Razorpay handles payment processing
5. **Status Tracking**: Comprehensive payment status management

## Business Logic

1. **Order Creation**: Creates Razorpay order and pending registration
2. **Webhook Processing**: Automatically confirms registrations on payment success
3. **Status Updates**: Registration status changes based on payment events
4. **Side Effects**: Automatic participant count and ticket updates
5. **Cancellation**: Prevents cancellation of confirmed registrations

## Webhook Events

### Payment Captured
- Updates registration status to "confirmed"
- Sets payment verification timestamp
- Applies registration side effects
- Generates hall ticket

### Payment Failed
- Updates registration status to "failed"
- Maintains pending state for retry

## Testing Examples

### Create Payment Order
```bash
curl -X POST /api/v1/payments/create-order \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "ticketType": "Premium",
    "registrationNumber": "REG001",
    "phoneNumber": "+1234567890",
    "college": "MIT",
    "department": "Computer Science",
    "yearOfStudy": "3rd Year"
  }'
```

### Get Payment Status
```bash
curl -X GET /api/v1/payments/status/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer <token>"
```

### Cancel Payment Order
```bash
curl -X DELETE /api/v1/payments/cancel/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer <token>"
```

### Get Payment History
```bash
curl -X GET "/api/v1/payments/history?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```
