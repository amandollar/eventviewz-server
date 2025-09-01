# Event Management API

## Overview
The Event Management API allows users to create, read, update, delete, and search events with comprehensive event details and management capabilities.

**Base URL:** `/api/v1/events`

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Endpoints

### 1. Create Event
**POST** `/api/v1/events`

Create a new event (organizers and admins only).

**Request Body (multipart/form-data):**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "date": "string (required)",
  "startTime": "string (required)",
  "endTime": "string (required)",
  "venue": "string (required)",
  "location": "string (required)",
  "category": "string (required)",
  "participants": "array (optional)",
  "maxParticipants": "number (optional)",
  "tickets": "array (optional)",
  "image": "file (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "date": "string",
    "startTime": "string",
    "endTime": "string",
    "venue": "string",
    "location": "string",
    "category": "string",
    "createdBy": "string",
    "participants": "array",
    "tickets": "array",
    "maxParticipants": "number",
    "currentParticipants": "number",
    "image": "string",
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: "User not authenticated"
- `500 Internal Server Error`: "Failed to create event"

### 2. Get All Events
**GET** `/api/v1/events`

Get all events.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Events fetched successfully",
  "events": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "date": "string",
      "startTime": "string",
      "endTime": "string",
      "venue": "string",
      "location": "string",
      "category": "string",
      "createdBy": "string",
      "participants": "array",
      "tickets": "array",
      "maxParticipants": "number",
      "currentParticipants": "number",
      "image": "string",
      "isActive": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to fetch events"

### 3. Get Event by ID
**GET** `/api/v1/events/:id`

Get a specific event by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event fetched successfully",
  "event": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "date": "string",
    "startTime": "string",
    "endTime": "string",
    "venue": "string",
    "location": "string",
    "category": "string",
    "createdBy": "string",
    "participants": "array",
    "tickets": "array",
    "maxParticipants": "number",
    "currentParticipants": "number",
    "image": "string",
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to fetch event"

### 4. Update Event
**PUT** `/api/v1/events/:id`

Update an existing event.

**Request Body (multipart/form-data):**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "date": "string (optional)",
  "startTime": "string (optional)",
  "endTime": "string (optional)",
  "venue": "string (optional)",
  "location": "string (optional)",
  "category": "string (optional)",
  "maxParticipants": "number (optional)",
  "isActive": "boolean (optional)",
  "tickets": "array (optional)",
  "image": "file (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "event": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "date": "string",
    "startTime": "string",
    "endTime": "string",
    "venue": "string",
    "location": "string",
    "category": "string",
    "createdBy": "string",
    "participants": "array",
    "tickets": "array",
    "maxParticipants": "number",
    "currentParticipants": "number",
    "image": "string",
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to update event"

### 5. Delete Event
**DELETE** `/api/v1/events/:id`

Delete an event.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to delete event"

### 6. Search Events
**GET** `/api/v1/events/search`

Search events by title or description.

**Query Parameters:**
- `q`: Search query string (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Events searched successfully",
  "events": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "date": "string",
      "startTime": "string",
      "endTime": "string",
      "venue": "string",
      "location": "string",
      "category": "string",
      "createdBy": "string",
      "participants": "array",
      "tickets": "array",
      "maxParticipants": "number",
      "currentParticipants": "number",
      "image": "string",
      "isActive": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: "Search query is required"
- `500 Internal Server Error`: "Failed to search events"

### 7. Get Events by Category
**GET** `/api/v1/events/category/:category`

Get events filtered by category.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Events fetched successfully",
  "events": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "date": "string",
      "startTime": "string",
      "endTime": "string",
      "venue": "string",
      "location": "string",
      "category": "string",
      "createdBy": "string",
      "participants": "array",
      "tickets": "array",
      "maxParticipants": "number",
      "currentParticipants": "number",
      "image": "string",
      "isActive": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: "Category is required"
- `500 Internal Server Error`: "Failed to fetch events by category"

## Data Models

### Event
```typescript
interface Event {
  _id: ObjectId;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  location: string;
  category: string;
  createdBy: ObjectId;
  participants: ObjectId[];
  tickets: Ticket[];
  maxParticipants?: number;
  currentParticipants: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Ticket {
  type: string;
  price: number;
  available: number;
  description?: string;
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

## Security Features

1. **Authentication Required**: All endpoints require valid JWT token
2. **Role-Based Access**: Event creation restricted to organizers and admins
3. **File Upload Security**: Multer middleware for secure image handling
4. **Input Validation**: Comprehensive validation for all event fields

## File Upload

- **Field Name**: `image`
- **File Types**: Determined by Multer configuration
- **Storage**: File path returned in response
- **Optional**: Not required for event creation

## Testing Examples

### Create Event
```bash
curl -X POST /api/v1/events \
  -H "Authorization: Bearer <token>" \
  -F "title=Tech Conference 2024" \
  -F "description=Annual technology conference" \
  -F "date=2024-03-15" \
  -F "startTime=09:00" \
  -F "endTime=17:00" \
  -F "venue=Convention Center" \
  -F "location=New York" \
  -F "category=Technology" \
  -F "maxParticipants=500" \
  -F "image=@event.jpg"
```

### Get All Events
```bash
curl -X GET /api/v1/events \
  -H "Authorization: Bearer <token>"
```

### Search Events
```bash
curl -X GET "/api/v1/events/search?q=technology" \
  -H "Authorization: Bearer <token>"
```

### Update Event
```bash
curl -X PUT /api/v1/events/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer <token>" \
  -F "title=Updated Tech Conference" \
  -F "maxParticipants=600"
```
