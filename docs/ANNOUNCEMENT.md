# Announcement Management API

## Overview
The Announcement Management API allows administrators to create, manage, and distribute announcements to users with different types and targeting options.

**Base URL:** `/api/v1/announcements`

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Endpoints

### 1. Create Announcement
**POST** `/api/v1/announcements`

Create a new announcement (admin only).

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "type": "string (required)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Announcement created successfully",
  "announcement": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "type": "string",
    "createdBy": {
      "name": "string",
      "email": "string"
    },
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `403 Forbidden`: "Only admins can create announcements"
- `500 Internal Server Error`: "Failed to create announcement"

### 2. Get All Announcements
**GET** `/api/v1/announcements`

Get all active announcements (public access).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Announcements fetched successfully",
  "announcements": [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "type": "string",
      "createdBy": {
        "name": "string",
        "email": "string"
      },
      "isActive": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to fetch announcements"

### 3. Get Announcement by ID
**GET** `/api/v1/announcements/:id`

Get a specific announcement by ID (public access).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Announcement fetched successfully",
  "announcement": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "type": "string",
    "createdBy": {
      "name": "string",
      "email": "string"
    },
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `404 Not Found`: "Announcement not found"
- `500 Internal Server Error`: "Failed to fetch announcement"

### 4. Update Announcement
**PUT** `/api/v1/announcements/:id`

Update an existing announcement (admin only).

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "type": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Announcement updated successfully",
  "announcement": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "type": "string",
    "createdBy": {
      "name": "string",
      "email": "string"
    },
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `403 Forbidden`: "Only admins can update announcements"
- `404 Not Found`: "Announcement not found"
- `500 Internal Server Error`: "Failed to update announcement"

### 5. Delete Announcement
**DELETE** `/api/v1/announcements/:id`

Delete an announcement (admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden`: "Only admins can delete announcements"
- `404 Not Found`: "Announcement not found"
- `500 Internal Server Error`: "Failed to delete announcement"

### 6. Toggle Announcement Status
**PUT** `/api/v1/announcements/:id/toggle`

Toggle announcement active status (admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Announcement activated/deactivated successfully",
  "announcement": {
    "_id": "string",
    "title": "string",
    "content": "string",
    "type": "string",
    "createdBy": {
      "name": "string",
      "email": "string"
    },
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `403 Forbidden`: "Only admins can toggle announcement status"
- `404 Not Found`: "Announcement not found"
- `500 Internal Server Error`: "Failed to toggle announcement status"

### 7. Get Announcements by Type
**GET** `/api/v1/announcements/type/:type`

Get announcements filtered by type with pagination (public access).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Type announcements fetched successfully",
  "announcements": [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "type": "string",
      "createdBy": {
        "name": "string",
        "email": "string"
      },
      "isActive": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
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
- `500 Internal Server Error`: "Failed to fetch announcements by type"

### 8. Get Latest Announcements
**GET** `/api/v1/announcements/latest`

Get latest announcements (public access).

**Query Parameters:**
- `limit` (optional): Number of announcements (default: 5)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Latest announcements fetched successfully",
  "announcements": [
    {
      "_id": "string",
      "title": "string",
      "content": "string",
      "type": "string",
      "createdBy": {
        "name": "string",
        "email": "string"
      },
      "isActive": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to fetch latest announcements"

## Data Models

### Announcement
```typescript
interface Announcement {
  _id: ObjectId;
  title: string;
  content: string;
  type: string;
  createdBy: ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
2. **Role-Based Access**: Admin endpoints restricted to admin users only
3. **Public Read Access**: Announcement viewing is public
4. **Admin-Only Operations**: Create, update, delete, and toggle operations restricted to admins

## Business Logic

1. **Type-Based Filtering**: Announcements can be filtered by type
2. **Status Management**: Active/inactive status control
3. **Pagination Support**: Efficient data retrieval for large datasets
4. **Latest Announcements**: Quick access to recent announcements
5. **Creator Tracking**: All announcements track who created them

## Testing Examples

### Create Announcement (Admin)
```bash
curl -X POST /api/v1/announcements \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Important Update",
    "content": "Please read this important announcement",
    "type": "general"
  }'
```

### Get All Announcements
```bash
curl -X GET /api/v1/announcements
```

### Get Announcements by Type
```bash
curl -X GET "/api/v1/announcements/type/general?page=1&limit=10"
```

### Toggle Announcement Status (Admin)
```bash
curl -X PUT /api/v1/announcements/64f1a2b3c4d5e6f7g8h9i0j1/toggle \
  -H "Authorization: Bearer <admin_token>"
```

### Update Announcement (Admin)
```bash
curl -X PUT /api/v1/announcements/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content"
  }'
```
