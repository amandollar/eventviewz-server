# 📚 EventViewz API Documentation

> **Complete API reference for the EventViewz event management platform**

## 📋 Table of Contents

- [🔗 Base Information](#-base-information)
- [🔐 Authentication](#-authentication)
- [📅 Events API](#-events-api)
- [🎫 Registrations API](#-registrations-api)
- [💳 Payments API](#-payments-api)
- [👥 Users API](#-users-api)
- [📢 Announcements API](#-announcements-api)
- [💰 Sponsors API](#-sponsors-api)
- [🎪 Organizer Applications API](#-organizer-applications-api)
- [🛡️ Rate Limiting](#️-rate-limiting)
- [📊 Response Formats](#-response-formats)
- [❌ Error Handling](#-error-handling)
- [🧪 Testing Examples](#-testing-examples)

## 🔗 Base Information

### **Base URL**
```
http://localhost:5000/api/v1
```

### **Content Types**
- **JSON**: `application/json`
- **Form Data**: `multipart/form-data` (for file uploads)

### **Authentication Header**
```http
Authorization: Bearer <access_token>
```

## 🔐 Authentication

EventViewz supports two authentication methods: **Normal Authentication (Email/Password)** and **Google OAuth 2.0**.

### **Normal Authentication (Email/Password)**

#### **1. User Registration**
```http
POST /auth/register
```

**Content-Type:** `multipart/form-data`

**Body (Form Data):**
- `name` (required): User's full name
- `email` (required): User's email address
- `password` (required): Strong password
- `image` (optional): Profile picture file

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*(),.?":{}|<>)

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "user": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://res.cloudinary.com/...",
    "role": "student",
    "isEmailVerified": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **2. User Login**
```http
POST /auth/login
```

**Content-Type:** `application/json`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://res.cloudinary.com/...",
    "role": "student",
    "isEmailVerified": true,
    "lastLogin": "2024-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Google OAuth 2.0**

#### **1. Initiate OAuth**
```http
GET /auth/google
```

**Response**: Redirects to Google OAuth consent screen

#### **2. OAuth Callback**
```http
GET /auth/google/callback?code=<authorization_code>
```

**Response**: Redirects to frontend with access token
```
http://localhost:3000/auth/success?accessToken=<jwt_token>
```

### **Token Management**

#### **1. Refresh Token**
```http
POST /auth/refresh
```

**Headers:**
```http
Cookie: refreshToken=<refresh_token>
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **2. Get Current User**
```http
GET /auth/user
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "_id": "user_id_here",
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://res.cloudinary.com/...",
  "role": "student",
  "isEmailVerified": true,
  "lastLogin": "2024-01-15T10:30:00.000Z"
}
```

#### **3. Update User Profile**
```http
PUT /auth/user
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
- `name` (optional): New name
- `image` (optional): New profile picture file

**Response:**
```json
{
  "_id": "user_id_here",
  "name": "John Smith",
  "email": "john@example.com",
  "image": "https://res.cloudinary.com/...",
  "role": "student",
  "isEmailVerified": true,
  "lastLogin": "2024-01-15T10:30:00.000Z"
}
```

#### **4. Logout**
```http
POST /auth/logout
```

**Response:**
```json
{
  "message": "Logged out"
}
```

#### **5. Delete User Account**
```http
DELETE /auth/user
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## 📅 Events API

### **List All Events**
```http
GET /events
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in title/description
- `date` (optional): Filter by date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "message": "Events fetched successfully",
  "events": [
    {
      "_id": "event_id_here",
      "title": "Tech Conference 2024",
      "description": "Annual technology conference",
      "image": "https://res.cloudinary.com/...",
      "date": "2024-12-25T00:00:00.000Z",
      "startTime": "14:00",
      "endTime": "16:00",
      "venue": "Main Auditorium",
      "category": "conference",
      "maxParticipants": 200,
      "currentParticipants": 45,
      "isActive": true,
      "createdBy": "user_id_here",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
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

### **Get Event by ID**
```http
GET /events/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Event fetched successfully",
  "event": {
    "_id": "event_id_here",
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "image": "https://res.cloudinary.com/...",
    "date": "2024-12-25T00:00:00.000Z",
    "startTime": "14:00",
    "endTime": "16:00",
    "venue": "Main Auditorium",
    "category": "conference",
    "maxParticipants": 200,
    "currentParticipants": 45,
    "isActive": true,
    "createdBy": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "participants": [
      {
        "_id": "participant_id",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ],
    "tickets": [
      {
        "type": "VIP",
        "price": 100,
        "available": 50
      },
      {
        "type": "General",
        "price": 50,
        "available": 150
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### **Create Event**
```http
POST /events
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference",
  "date": "2024-12-25",
  "startTime": "14:00",
  "endTime": "16:00",
  "venue": "Main Auditorium",
  "location": "123 Tech Street, City",
  "category": "conference",
  "maxParticipants": 200,
  "image": "<file>",
  "tickets": [
    {
      "type": "VIP",
      "price": 100,
      "available": 50
    },
    {
      "type": "General", 
      "price": 50,
      "available": 150
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "_id": "new_event_id",
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "image": "https://res.cloudinary.com/...",
    "date": "2024-12-25T00:00:00.000Z",
    "startTime": "14:00",
    "endTime": "16:00",
    "venue": "Main Auditorium",
    "category": "conference",
    "maxParticipants": 200,
    "currentParticipants": 0,
    "isActive": true,
    "createdBy": "user_id_here",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### **Update Event**
```http
PUT /events/:id
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "title": "Updated Tech Conference 2024",
  "description": "Updated description",
  "maxParticipants": 250
}
```

### **Delete Event**
```http
DELETE /events/:id
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

## 🎫 Registrations API

### **Register for Event (Free tickets only)**
```http
POST /registrations/register
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "eventId": "event_id_here",
  "ticketType": "General",
  "registrationNumber": "REG-2024-001",
  "phoneNumber": "+911234567890",
  "college": "ABC Institute",
  "department": "CSE",
  "yearOfStudy": "3rd Year",
  "dietaryPreferences": "Vegetarian",
  "specialRequirements": "Wheelchair access",
  "emergencyContact": {"name": "Parent Name", "phone": "+91111222333", "relationship": "Parent"},
  "tshirtSize": "M",
  "notes": "N/A"
}
```

**Behavior:**
- If the selected `ticketType` has a price > 0, this endpoint returns `400` with a message to use the payment flow.
- For free tickets, creates a `confirmed` registration, decrements ticket availability, updates participants, and returns a hall ticket.

**Response (free ticket):**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": {
    "_id": "registration_id",
    "status": "confirmed",
    "ticketType": "General",
    "hallTicket": "..."
  },
  "hallTicket": "..."
}
```

### **Get My Registrations**
```http
GET /registrations/user
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by registration status

**Response:**
```json
{
  "success": true,
  "message": "User registrations fetched successfully",
  "registrations": [
    {
      "_id": "registration_id",
      "event": {
        "_id": "event_id",
        "title": "Tech Conference 2024",
        "date": "2024-12-25T00:00:00.000Z",
        "venue": "Main Auditorium"
      },
      "status": "confirmed",
      "registeredAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### **Get Event Registrations**
```http
GET /registrations/event/:eventId
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Event registrations fetched successfully",
  "registrations": [
    {
      "_id": "registration_id",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "confirmed",
      "registeredAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### **Get Hall Ticket**
```http
GET /registrations/ticket/:registrationId
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:** PDF or image file download

### **Cancel Registration**
```http
DELETE /registrations/cancel/:registrationId
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

## 💳 Payments API

### **Create Payment Order**
```http
POST /payments/create-order
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "eventId": "event_id_here",
  "ticketType": "VIP",
  "registrationNumber": "REG-2024-001",
  "phoneNumber": "+911234567890",
  "college": "ABC Institute",
  "department": "CSE",
  "yearOfStudy": "3rd Year",
  "dietaryPreferences": "Vegetarian",
  "specialRequirements": "Wheelchair access",
  "emergencyContact": {"name": "Parent Name", "phone": "+91111222333", "relationship": "Parent"},
  "tshirtSize": "M",
  "notes": "N/A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "order": {
    "id": "order_razorpay_id",
    "amount": 10000,
    "currency": "INR",
    "receipt": "event_eventid_user_userid_timestamp"
  },
  "registration": {
    "id": "registration_id",
    "status": "pending",
    "ticketType": "VIP",
    "amount": 100,
    "paymentOrderId": "order_razorpay_id"
  }
}
```

### **Verify Payment**
```http
POST /payments/verify
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "razorpay_order_id": "order_razorpay_id",
  "razorpay_payment_id": "pay_razorpay_id",
  "razorpay_signature": "payment_signature",
  "registrationId": "registration_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and registration confirmed",
  "registration": {
    "id": "registration_id",
    "status": "confirmed",
    "ticketType": "VIP",
    "amount": 100,
    "hallTicket": "ticket_url_here",
    "confirmedAt": "2024-01-15T10:30:00.000Z"
  },
  "event": {
    "title": "Tech Conference 2024",
    "date": "2024-12-25T00:00:00.000Z",
    "venue": "Main Auditorium",
    "currentParticipants": 46
  }
}
```

### **Get Payment Status**
```http
GET /payments/status/:registrationId
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payment status retrieved successfully",
  "registration": {
    "id": "registration_id",
    "status": "confirmed",
    "ticketType": "VIP",
    "amount": 100,
    "paymentOrderId": "order_razorpay_id",
    "paymentId": "pay_razorpay_id",
    "paymentVerifiedAt": "2024-01-15T10:30:00.000Z",
    "confirmedAt": "2024-01-15T10:30:00.000Z",
    "hallTicket": "ticket_url_here",
    "event": {
      "_id": "event_id",
      "title": "Tech Conference 2024",
      "date": "2024-12-25T00:00:00.000Z",
      "venue": "Main Auditorium"
    },
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### **Cancel Payment Order**
```http
POST /payments/cancel/:registrationId
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payment order cancelled successfully",
  "registration": {
    "id": "registration_id",
    "status": "cancelled",
    "cancelledAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### **Get Payment History**
```http
GET /payments/history
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Payment history retrieved successfully",
  "registrations": [
    {
      "id": "registration_id",
      "status": "confirmed",
      "ticketType": "VIP",
      "amount": 100,
      "paymentOrderId": "order_razorpay_id",
      "paymentId": "pay_razorpay_id",
      "paymentVerifiedAt": "2024-01-15T10:30:00.000Z",
      "confirmedAt": "2024-01-15T10:30:00.000Z",
      "hallTicket": "ticket_url_here",
      "event": {
        "_id": "event_id",
        "title": "Tech Conference 2024",
        "date": "2024-12-25T00:00:00.000Z",
        "venue": "Main Auditorium",
        "image": "https://res.cloudinary.com/..."
      },
      "registeredAt": "2024-01-15T10:30:00.000Z"
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

## 🎪 Organizer Applications API

### **Submit Organizer Application**
```http
POST /organizer-applications
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "organizationName": "Tech Events Inc",
  "phoneNumber": "+1234567890",
  "description": "We organize technology conferences and workshops",
  "organizationImage": "<file>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organizer application submitted successfully",
  "application": {
    "id": "application_id",
    "organizationName": "Tech Events Inc",
    "phoneNumber": "+1234567890",
    "organizationImage": "https://res.cloudinary.com/...",
    "description": "We organize technology conferences and workshops",
    "status": "pending",
    "appliedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### **Get My Application**
```http
GET /organizer-applications/my-application
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Application retrieved successfully",
  "application": {
    "id": "application_id",
    "organizationName": "Tech Events Inc",
    "phoneNumber": "+1234567890",
    "organizationImage": "https://res.cloudinary.com/...",
    "description": "We organize technology conferences and workshops",
    "status": "pending",
    "adminNotes": null,
    "appliedAt": "2024-01-15T10:30:00.000Z",
    "reviewedAt": null,
    "reviewedBy": null
  }
}
```

### **Update Application**
```http
PUT /organizer-applications
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "organizationName": "Updated Tech Events Inc",
  "phoneNumber": "+1234567890",
  "description": "Updated description"
}
```

### **Admin: Get All Applications**
```http
GET /organizer-applications
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, approved, rejected)

**Response:**
```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "applications": [
    {
      "id": "application_id",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "organizationName": "Tech Events Inc",
      "phoneNumber": "+1234567890",
      "organizationImage": "https://res.cloudinary.com/...",
      "description": "We organize technology conferences and workshops",
      "status": "pending",
      "adminNotes": null,
      "appliedAt": "2024-01-15T10:30:00.000Z",
      "reviewedAt": null,
      "reviewedBy": null
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

### **Admin: Get Application Statistics**
```http
GET /organizer-applications/stats
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Application statistics retrieved successfully",
  "stats": {
    "pending": 15,
    "approved": 45,
    "rejected": 10,
    "total": 70
  }
}
```

### **Admin: Get Application by ID**
```http
GET /organizer-applications/:id
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Application retrieved successfully",
  "application": {
    "id": "application_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://example.com/avatar.jpg",
      "role": "student"
    },
    "organizationName": "Tech Events Inc",
    "phoneNumber": "+1234567890",
    "organizationImage": "https://res.cloudinary.com/...",
    "description": "We organize technology conferences and workshops",
    "status": "pending",
    "adminNotes": null,
    "appliedAt": "2024-01-15T10:30:00.000Z",
    "reviewedAt": null,
    "reviewedBy": null
  }
}
```

### **Admin: Approve Application**
```http
POST /organizer-applications/:id/approve
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "adminNotes": "Application approved. Organization looks legitimate."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "application": {
    "id": "application_id",
    "status": "approved",
    "adminNotes": "Application approved. Organization looks legitimate.",
    "reviewedAt": "2024-01-15T11:00:00.000Z",
    "reviewedBy": "admin_id"
  }
}
```

### **Admin: Reject Application**
```http
POST /organizer-applications/:id/reject
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "adminNotes": "Application rejected. Insufficient organization details provided."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application rejected successfully",
  "application": {
    "id": "application_id",
    "status": "rejected",
    "adminNotes": "Application rejected. Insufficient organization details provided.",
    "reviewedAt": "2024-01-15T11:00:00.000Z",
    "reviewedBy": "admin_id"
  }
}
```

## 👥 Users API

### **Get All Users (Admin Only)**
```http
GET /users
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `role` (optional): Filter by role
- `search` (optional): Search by name/email

### **Get User by ID**
```http
GET /users/:id
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

### **Update User Role (Admin Only)**
```http
PUT /users/:id/role
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "role": "organizer"
}
```

### **Delete User**
```http
DELETE /users/:id
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

## 📢 Announcements API

### **Get All Announcements**
```http
GET /announcements
```

**Response:**
```json
{
  "success": true,
  "message": "Announcements fetched successfully",
  "announcements": [
    {
      "_id": "announcement_id",
      "title": "System Maintenance",
      "content": "Server will be down for maintenance",
      "type": "holiday",
      "createdBy": "admin_id",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### **Get Announcement by ID**
```http
GET /announcements/:id
```

### **Create Announcement (Admin Only)**
```http
POST /announcements
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "New Announcement",
  "content": "Announcement content here",
  "type": "holiday"
}
```

### **Update Announcement (Admin Only)**
```http
PUT /announcements/:id
```

### **Delete Announcement (Admin Only)**
```http
DELETE /announcements/:id
```

## 💰 Sponsors API

### **Get All Sponsors**
```http
GET /sponsors
```

**Response:**
```json
{
  "success": true,
  "message": "Sponsors fetched successfully",
  "sponsors": [
    {
      "_id": "sponsor_id",
      "name": "Tech Corp",
      "image": "https://res.cloudinary.com/...",
      "expiryDate": "2024-12-31T00:00:00.000Z",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### **Get Carousel Sponsors**
```http
GET /sponsors/carousel
```

**Response:** Returns only active, non-expired sponsors

### **Create Sponsor (Admin Only)**
```http
POST /sponsors
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "name": "Tech Corp",
  "image": "<file>",
  "expiryDate": "2024-12-31"
}
```

## 🎪 Organizer Applications API

### **Submit Organizer Application**
```http
POST /organizer-applications
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "organizationName": "Tech Events Inc",
  "phoneNumber": "+1234567890",
  "description": "We organize technology conferences and workshops",
  "organizationImage": "<file>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organizer application submitted successfully",
  "application": {
    "id": "application_id",
    "organizationName": "Tech Events Inc",
    "phoneNumber": "+1234567890",
    "organizationImage": "https://res.cloudinary.com/...",
    "description": "We organize technology conferences and workshops",
    "status": "pending",
    "appliedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### **Admin: Approve Application**
```http
POST /organizer-applications/:id/approve
```

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "adminNotes": "Application approved. Organization looks legitimate."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "application": {
    "id": "application_id",
    "status": "approved",
    "adminNotes": "Application approved. Organization looks legitimate.",
    "reviewedAt": "2024-01-15T11:00:00.000Z",
    "reviewedBy": "admin_id"
  }
}
```

## 🛡️ Rate Limiting

### **Rate Limit Headers**
All API responses include rate limiting information:

```http
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1234567890
```

### **Rate Limit Configuration**

| Endpoint Type | Limit | Time Window |
|---------------|-------|-------------|
| **Global** | 100 requests | 15 minutes |
| **Authentication** | 5 requests | 15 minutes |
| **File Uploads** | 10 uploads | 1 hour |
| **Event Creation** | 20 events | 1 hour |
| **Registrations** | 30 registrations | 15 minutes |
| **Payments** | 10 operations | 15 minutes |
| **Organizer Applications** | 5 applications | 15 minutes |

### **Rate Limit Exceeded Response**
```json
{
  "error": "Too many requests from this IP, please try again after 15 minutes.",
  "retryAfter": "15 minutes",
  "limit": 100,
  "remaining": 0,
  "resetTime": 1234567890
}
```

**HTTP Status:** `429 Too Many Requests`

## 📊 Response Formats

### **Success Response**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "Error message here",
  "details": "Additional error details"
}
```

### **Pagination Response**
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## ❌ Error Handling

### **HTTP Status Codes**

| Status | Description | Example |
|--------|-------------|---------|
| `200` | Success | Request completed successfully |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |

### **Common Error Messages**

#### **Authentication Errors**
```json
{
  "error": "No token provided"
}
```

```json
{
  "error": "Invalid token"
}
```

```json
{
  "error": "Token expired"
}
```

```json
{
  "error": "Invalid credentials"
}
```

```json
{
  "error": "User with this email already exists"
}
```

#### **Password Validation Errors**
```json
{
  "error": "Password is too weak",
  "details": [
    "Password must be at least 8 characters long",
    "Password must contain at least one uppercase letter",
    "Password must contain at least one number",
    "Password must contain at least one special character"
  ]
}
```

#### **Validation Errors**
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "body.email",
      "message": "Invalid email format"
    }
  ]
}
```

#### **Permission Errors**
```json
{
  "error": "Insufficient permissions",
  "requiredRole": "admin"
}
```

#### **Payment Errors**
```json
{
  "error": "Invalid payment signature"
}
```

```json
{
  "error": "Payment already verified"
}
```

```json
{
  "error": "Tickets not available"
}
```

#### **Organizer Application Errors**
```json
{
  "error": "You already have a pending application"
}
```

```json
{
  "error": "You are already an organizer or admin"
}
```

```json
{
  "error": "Admin notes are required for rejection"
}
```

## 🧪 Testing Examples

### **Using cURL**

#### **Test Normal Authentication**
```bash
# 1. Register new user
curl -X POST \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "password=TestPass123!" \
  -F "image=@/path/to/avatar.jpg" \
  http://localhost:5000/api/v1/auth/register

# 2. Login with user
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}' \
  http://localhost:5000/api/v1/auth/login

# 3. Update profile with image
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Updated Name" \
  -F "image=@/path/to/new-avatar.jpg" \
  http://localhost:5000/api/v1/auth/user
```

#### **Test Health Check**
```bash
curl http://localhost:5000/
```

#### **Test Rate Limiting**
```bash
# Make multiple requests to test rate limiting
for i in {1..15}; do 
  curl http://localhost:5000/api/v1/events
  echo "Request $i completed"
done
```

#### **Test Authentication**
```bash
# Get user profile with token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/auth/user
```

#### **Create Event**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Event" \
  -F "description=Test Description" \
  -F "date=2024-12-25" \
  -F "startTime=14:00" \
  -F "endTime=16:00" \
  -F "venue=Test Venue" \
  -F "category=workshop" \
  -F "image=@/path/to/image.jpg" \
  http://localhost:5000/api/v1/events
```

#### **Test Payment Flow**
```bash
# 1. Create payment order
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventId":"event_id","ticketType":"VIP"}' \
  http://localhost:5000/api/v1/payments/create-order

# 2. Verify payment (after successful Razorpay transaction)
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"razorpay_order_id":"order_id","razorpay_payment_id":"payment_id","razorpay_signature":"signature","registrationId":"registration_id"}' \
  http://localhost:5000/api/v1/payments/verify
```

#### **Test Organizer Application**
```bash
# Submit organizer application
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "organizationName=Tech Events Inc" \
  -F "phoneNumber=+1234567890" \
  -F "description=We organize tech events" \
  -F "organizationImage=@/path/to/logo.jpg" \
  http://localhost:5000/api/v1/organizer-applications

# Admin: Get all applications
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:5000/api/v1/organizer-applications

# Admin: Approve application
curl -X POST \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"adminNotes":"Application approved"}' \
  http://localhost:5000/api/v1/organizer-applications/application_id/approve
```

### **Using PowerShell**

#### **Test Normal Authentication**
```powershell
# 1. Register new user
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "TestPass123!"
}
$image = Get-Item "C:\path\to\avatar.jpg"
$form = @{
    name = "Test User"
    email = "test@example.com"
    password = "TestPass123!"
    image = $image
}
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method POST -Form $form

# 2. Login with user
$loginBody = @{
    email = "test@example.com"
    password = "TestPass123!"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
```

#### **Test Health Check**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
```

#### **Test Rate Limiting**
```powershell
1..15 | ForEach-Object { 
  try { 
    Invoke-RestMethod -Uri "http://localhost:5000/api/v1/events" -Method Get
    Write-Host "Request $_: Success"
  } catch { 
    Write-Host "Request $_: $($_.Exception.Response.StatusCode)"
  }
}
```

### **Using Postman**

1. **Import Collection**: Use the provided Postman collection
2. **Set Environment Variables**:
   - `base_url`: `http://localhost:5000/api/v1`
   - `access_token`: Your JWT token
3. **Test Endpoints**: Run through the collection

### **Load Testing with Artillery**

#### **Install Artillery**
```bash
npm install -g artillery
```

#### **Create Load Test Config**
```yaml
# load-test.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "API Load Test"
    weight: 100
    requests:
      - get:
          url: "/api/v1/events"
      - get:
          url: "/api/v1/announcements"
```

#### **Run Load Test**
```bash
artillery run load-test.yml
```

## 🔧 Development Tips

### **Environment Setup**
1. Use `.env` file for configuration
2. Set `NODE_ENV=development` for detailed logging
3. Use MongoDB Compass for database visualization

### **Debugging**
1. Check server console for detailed logs
2. Use Postman/Insomnia for API testing
3. Monitor rate limiting headers in responses
4. Check MongoDB connection status

### **Performance Monitoring**
1. Monitor response times
2. Check rate limiting usage
3. Monitor database query performance
4. Watch memory usage

### **Authentication Testing**
1. Test both normal auth and Google OAuth flows
2. Verify JWT token generation and validation
3. Test password strength validation
4. Check image upload functionality
5. Verify rate limiting on auth endpoints

### **Payment Testing**
1. Use Razorpay test mode for development
2. Test payment flow with test cards
3. Verify webhook signatures
4. Monitor payment status updates

### **Organizer Application Testing**
1. Test application submission flow
2. Verify admin review process
3. Test role elevation after approval
4. Check application status updates

---

**For more information, visit the main [README.md](README.md) file or contact the development team.**