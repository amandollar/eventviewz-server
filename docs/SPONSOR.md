# Sponsor Management API

## Overview
The Sponsor Management API allows administrators to manage event sponsors with logo uploads, contact information, and expiration dates.

**Base URL:** `/api/v1/sponsors`

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Endpoints

### 1. Create Sponsor
**POST** `/api/v1/sponsors`

Create a new sponsor (admin only).

**Request Body (multipart/form-data):**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "publisher": "string (optional)",
  "link": "string (optional)",
  "contact": "string (optional)",
  "expiresAt": "date (optional)",
  "images": "files (required, at least one)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Sponsor created successfully",
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "publisher": "string",
    "link": "string",
    "contact": "string",
    "images": ["string"],
    "expiresAt": "date",
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `400 Bad Request`: "At least one image is required"
- `403 Forbidden`: "Only admins can create sponsors"
- `500 Internal Server Error`: "Failed to create sponsor"

### 2. Get All Sponsors
**GET** `/api/v1/sponsors`

Get all sponsors (public access).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sponsors fetched successfully",
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "publisher": "string",
      "link": "string",
      "contact": "string",
      "images": ["string"],
      "expiresAt": "date",
      "isActive": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to fetch sponsors"

### 3. Get Sponsor by ID
**GET** `/api/v1/sponsors/:id`

Get a specific sponsor by ID (public access).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sponsor fetched successfully",
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "publisher": "string",
    "link": "string",
    "contact": "string",
    "images": ["string"],
    "expiresAt": "date",
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `404 Not Found`: "Sponsor not found"
- `500 Internal Server Error`: "Failed to fetch sponsor"

### 4. Update Sponsor
**PUT** `/api/v1/sponsors/:id`

Update an existing sponsor (admin only).

**Request Body (multipart/form-data):**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "publisher": "string (optional)",
  "link": "string (optional)",
  "contact": "string (optional)",
  "isActive": "boolean (optional)",
  "expiresAt": "date (optional)",
  "images": "files (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sponsor updated successfully",
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "publisher": "string",
    "link": "string",
    "contact": "string",
    "images": ["string"],
    "expiresAt": "date",
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**
- `403 Forbidden`: "Only admins can update sponsors"
- `404 Not Found`: "Sponsor not found"
- `500 Internal Server Error`: "Failed to update sponsor"

### 5. Delete Sponsor
**DELETE** `/api/v1/sponsors/:id`

Delete a sponsor (admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sponsor deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden`: "Only admins can delete sponsors"
- `404 Not Found`: "Sponsor not found"
- `500 Internal Server Error`: "Failed to delete sponsor"

### 6. Get Carousel Sponsors
**GET** `/api/v1/sponsors/carousel`

Get active and non-expired sponsors for carousel display (public access).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Carousel sponsors fetched successfully",
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "publisher": "string",
      "link": "string",
      "contact": "string",
      "images": ["string"],
      "expiresAt": "date",
      "isActive": "boolean",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: "Failed to fetch carousel sponsors"

## Data Models

### Sponsor
```typescript
interface Sponsor {
  _id: ObjectId;
  title: string;
  description?: string;
  publisher?: string;
  link?: string;
  contact?: string;
  images: string[];
  expiresAt: Date;
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
3. **Public Read Access**: Sponsor viewing is public
4. **Admin-Only Operations**: Create, update, and delete operations restricted to admins
5. **File Upload Security**: Multer middleware for secure image handling

## Business Logic

1. **Image Requirements**: At least one image is required for sponsor creation
2. **Expiration Management**: Sponsors can have expiration dates
3. **Active Status**: Sponsors can be activated/deactivated
4. **Carousel Filtering**: Only active and non-expired sponsors appear in carousel
5. **Image Updates**: Images are only updated when new files are uploaded

## File Upload

- **Field Name**: `images`
- **File Types**: Determined by Multer configuration
- **Multiple Files**: Supports multiple image uploads
- **Required**: At least one image is required
- **Storage**: File paths returned in response

## Testing Examples

### Create Sponsor (Admin)
```bash
curl -X POST /api/v1/sponsors \
  -H "Authorization: Bearer <admin_token>" \
  -F "title=TechCorp" \
  -F "description=Leading technology company" \
  -F "link=https://techcorp.com" \
  -F "contact=info@techcorp.com" \
  -F "images=@logo1.png" \
  -F "images=@logo2.png"
```

### Get All Sponsors
```bash
curl -X GET /api/v1/sponsors
```

### Update Sponsor (Admin)
```bash
curl -X PUT /api/v1/sponsors/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer <admin_token>" \
  -F "title=Updated TechCorp" \
  -F "description=Updated description" \
  -F "images=@newlogo.png"
```

### Get Carousel Sponsors
```bash
curl -X GET /api/v1/sponsors/carousel
```

### Delete Sponsor (Admin)
```bash
curl -X DELETE /api/v1/sponsors/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer <admin_token>"
```
