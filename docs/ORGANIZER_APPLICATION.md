# Organizer Application API Documentation

## Overview
The Organizer Application API allows users to apply for organizer privileges and administrators to review and manage these applications.

**Base URL:** `/api/v1/organizer-applications`

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## User Endpoints

### 1. Submit Organizer Application
**POST** `/api/v1/organizer-applications`

Submit a new organizer application.

**Request Body (multipart/form-data):**
```json
{
  "organizationName": "string (2-100 chars)",
  "phoneNumber": "string (10-15 chars)",
  "description": "string (max 500 chars, optional)",
  "organizationImage": "file (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Organizer application submitted successfully",
  "application": {
    "id": "string",
    "organizationName": "string",
    "phoneNumber": "string",
    "organizationImage": "string",
    "description": "string",
    "status": "pending",
    "appliedAt": "date"
  }
}
```

**Error Responses:**
- `400 Bad Request`: "You already have a pending application" or "You are already an organizer or admin"
- `500 Internal Server Error`: "Failed to submit application"

### 2. Get My Application
**GET** `/api/v1/organizer-applications/my-application`

Get the current user's organizer application status.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application retrieved successfully",
  "application": {
    "id": "string",
    "organizationName": "string",
    "phoneNumber": "string",
    "organizationImage": "string",
    "description": "string",
    "status": "pending|approved|rejected",
    "adminNotes": "string",
    "appliedAt": "date",
    "reviewedAt": "date",
    "reviewedBy": {
      "name": "string",
      "email": "string"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: "No application found"
- `500 Internal Server Error`: "Failed to get application"

### 3. Update Application
**PUT** `/api/v1/organizer-applications`

Update the current user's pending application.

**Request Body (multipart/form-data):**
```json
{
  "organizationName": "string (2-100 chars, optional)",
  "phoneNumber": "string (10-15 chars, optional)",
  "description": "string (max 500 chars, optional)",
  "organizationImage": "file (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application updated successfully",
  "application": {
    "id": "string",
    "organizationName": "string",
    "phoneNumber": "string",
    "organizationImage": "string",
    "description": "string",
    "status": "pending",
    "appliedAt": "date"
  }
}
```

**Error Responses:**
- `400 Bad Request`: "Cannot update application that has been reviewed"
- `404 Not Found`: "No application found"
- `500 Internal Server Error`: "Failed to update application"

## Admin Endpoints

### 4. Get All Applications
**GET** `/api/v1/organizer-applications`

Get all organizer applications with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status ("pending", "approved", "rejected")

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "applications": [
    {
      "id": "string",
      "user": {
        "name": "string",
        "email": "string"
      },
      "organizationName": "string",
      "phoneNumber": "string",
      "organizationImage": "string",
      "description": "string",
      "status": "pending|approved|rejected",
      "adminNotes": "string",
      "appliedAt": "date",
      "reviewedAt": "date",
      "reviewedBy": {
        "name": "string",
        "email": "string"
      }
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
- `500 Internal Server Error`: "Failed to get applications"

### 5. Get Application by ID
**GET** `/api/v1/organizer-applications/:id`

Get a specific application by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application retrieved successfully",
  "application": {
    "id": "string",
    "user": {
      "name": "string",
      "email": "string",
      "image": "string",
      "role": "string"
    },
    "organizationName": "string",
    "phoneNumber": "string",
    "organizationImage": "string",
    "description": "string",
    "status": "pending|approved|rejected",
    "adminNotes": "string",
    "appliedAt": "date",
    "reviewedAt": "date",
    "reviewedBy": {
      "name": "string",
      "email": "string"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: "Application not found"
- `500 Internal Server Error`: "Failed to get application"

### 6. Approve Application
**POST** `/api/v1/organizer-applications/:id/approve`

Approve an organizer application.

**Request Body:**
```json
{
  "adminNotes": "string (max 200 chars, optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "application": {
    "id": "string",
    "status": "approved",
    "adminNotes": "string",
    "reviewedAt": "date",
    "reviewedBy": "string"
  }
}
```

**Error Responses:**
- `400 Bad Request`: "Application has already been reviewed"
- `404 Not Found`: "Application not found"
- `500 Internal Server Error`: "Failed to approve application"

### 7. Reject Application
**POST** `/api/v1/organizer-applications/:id/reject`

Reject an organizer application.

**Request Body:**
```json
{
  "adminNotes": "string (1-200 chars, required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application rejected successfully",
  "application": {
    "id": "string",
    "status": "rejected",
    "adminNotes": "string",
    "reviewedAt": "date",
    "reviewedBy": "string"
  }
}
```

**Error Responses:**
- `400 Bad Request`: "Application has already been reviewed"
- `404 Not Found`: "Application not found"
- `500 Internal Server Error`: "Failed to reject application"

### 8. Get Application Statistics
**GET** `/api/v1/organizer-applications/stats`

Get statistics about all applications.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application statistics retrieved successfully",
  "stats": {
    "pending": 5,
    "approved": 12,
    "rejected": 3,
    "total": 20
  }
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to get application statistics"

## Data Models

### OrganizerApplication
```typescript
interface IOrganizerApplication {
  user: ObjectId;                    // Reference to User
  organizationName: string;           // 2-100 characters
  phoneNumber: string;                // 10-15 characters
  organizationImage?: string;         // File path
  description?: string;               // Max 500 characters
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;                // Max 200 characters
  appliedAt: Date;                    // Auto-generated
  reviewedAt?: Date;                  // Set when reviewed
  reviewedBy?: ObjectId;              // Reference to admin User
}
```

## Validation Schemas

### Submit Application
- `organizationName`: Required, 2-100 characters
- `phoneNumber`: Required, 10-15 characters
- `description`: Optional, max 500 characters

### Update Application
- All fields optional
- Same validation rules as submit

### Approve Application
- `adminNotes`: Optional, max 200 characters

### Reject Application
- `adminNotes`: Required, 1-200 characters

### Query Parameters
- `page`: Integer, minimum 1, default 1
- `limit`: Integer, 1-100, default 10
- `status`: Enum ["pending", "approved", "rejected"]

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Security Features

1. **Authentication Required**: All endpoints require valid JWT token
2. **Role-Based Access**: Admin endpoints restricted to admin users only
3. **Rate Limiting**: General rate limiting applied to all endpoints
4. **File Upload Security**: Multer middleware for secure file handling
5. **Input Validation**: Zod schema validation for all inputs
6. **Unique Applications**: One application per user enforced at database level

## File Upload

- **Field Name**: `organizationImage`
- **File Types**: Determined by Multer configuration
- **Storage**: File path returned in response
- **Optional**: Not required for application submission

## Business Logic

1. **One Application Per User**: Users can only have one application at a time
2. **Role Restrictions**: Existing organizers/admins cannot apply
3. **Update Restrictions**: Only pending applications can be updated
4. **Review Requirements**: Applications must be reviewed before approval/rejection
5. **Automatic Role Update**: Approved applications automatically update user role to "organizer"

## Testing Examples

### Submit Application
```bash
curl -X POST /api/v1/organizer-applications \
  -H "Authorization: Bearer <token>" \
  -F "organizationName=Tech Club" \
  -F "phoneNumber=+1234567890" \
  -F "description=Student technology organization" \
  -F "organizationImage=@logo.png"
```

### Get My Application
```bash
curl -X GET /api/v1/organizer-applications/my-application \
  -H "Authorization: Bearer <token>"
```

### Approve Application (Admin)
```bash
curl -X POST /api/v1/organizer-applications/64f1a2b3c4d5e6f7g8h9i0j1/approve \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"adminNotes": "Approved after review"}'
```

### Get Application Statistics (Admin)
```bash
curl -X GET /api/v1/organizer-applications/stats \
  -H "Authorization: Bearer <admin_token>"
```
