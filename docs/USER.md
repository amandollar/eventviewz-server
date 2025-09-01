# User Authentication & Management API

## Overview
The User API provides authentication and user management functionality including registration, login, Google OAuth, profile management, and role-based access control.

**Base URL:** `/api/v1/auth`

## Authentication
All endpoints (except registration and login) require JWT authentication via `Authorization: Bearer <token>` header.

## Endpoints

### 1. User Registration
**POST** `/api/v1/auth/register`

Create a new user account.

**Request Body (multipart/form-data):**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "image": "file (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "image": "string|null",
    "role": "string",
    "isEmailVerified": "boolean"
  },
  "accessToken": "string"
}
```

**Error Responses:**
- `400 Bad Request`: "All fields are required" or "Invalid email format" or "Password is too weak"
- `409 Conflict`: "User with this email already exists"
- `500 Internal Server Error`: "Internal server error"

### 2. User Login
**POST** `/api/v1/auth/login`

Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "image": "string|null",
    "role": "string",
    "isEmailVerified": "boolean",
    "lastLogin": "date"
  },
  "accessToken": "string"
}
```

**Error Responses:**
- `400 Bad Request`: "Email and password are required"
- `401 Unauthorized`: "Invalid credentials" or "This account uses Google OAuth. Please use Google login."
- `500 Internal Server Error`: "Internal server error"

### 3. Google OAuth Redirect
**GET** `/api/v1/auth/google`

Redirect to Google OAuth consent screen.

**Response:** Redirects to Google OAuth URL

### 4. Google OAuth Callback
**GET** `/api/v1/auth/google/callback`

Handle Google OAuth callback and authenticate user.

**Query Parameters:**
- `code`: Authorization code from Google

**Response:** Redirects to frontend with access token

**Error Responses:**
- `400 Bad Request`: "No code provided"
- `500 Internal Server Error`: "Internal server error"

### 5. Refresh Token
**POST** `/api/v1/auth/refresh`

Refresh access token using refresh token from cookies.

**Response (200 OK):**
```json
{
  "accessToken": "string"
}
```

**Error Responses:**
- `401 Unauthorized`: "No refresh token"
- `403 Forbidden`: "Invalid refresh token" or "Refresh failed"

### 6. Get Current User
**GET** `/api/v1/auth/me`

Get current authenticated user's profile.

**Response (200 OK):**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "image": "string|null",
  "role": "string",
  "isEmailVerified": "boolean",
  "lastLogin": "date"
}
```

**Error Responses:**
- `401 Unauthorized`: "User not authenticated"
- `404 Not Found`: "User not found"
- `500 Internal Server Error`: "Internal server error"

### 7. Update User Profile
**PUT** `/api/v1/auth/profile`

Update user's name and/or profile image.

**Request Body (multipart/form-data):**
```json
{
  "name": "string (optional)",
  "image": "file (optional)"
}
```

**Response (200 OK):**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "image": "string|null",
  "role": "string"
}
```

**Error Responses:**
- `401 Unauthorized`: "Not authenticated"
- `404 Not Found`: "User not found"
- `500 Internal Server Error`: "Internal server error"

### 8. User Logout
**POST** `/api/v1/auth/logout`

Logout user and clear refresh token.

**Response (200 OK):**
```json
{
  "message": "Logged out"
}
```

### 9. Delete User
**DELETE** `/api/v1/auth/profile/:id`

Delete user account (self-delete or admin only).

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: "Not authenticated"
- `403 Forbidden`: "Forbidden"
- `404 Not Found`: "User not found"
- `500 Internal Server Error`: "Internal server error"

## Data Models

### User
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "student" | "organizer" | "admin";
  isEmailVerified: boolean;
  lastLogin?: Date;
  refreshToken?: string;
  googleId?: string;
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

## Security Features

1. **Password Hashing**: bcryptjs for secure password storage
2. **JWT Authentication**: Access tokens (15min) + refresh tokens (7 days)
3. **Google OAuth 2.0**: Alternative authentication method
4. **Role-Based Access**: Student, Organizer, Admin roles
5. **Input Validation**: Email format and password strength validation
6. **Secure Cookies**: HttpOnly refresh tokens

## Testing Examples

### Register User
```bash
curl -X POST /api/v1/auth/register \
  -H "Content-Type: multipart/form-data" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=SecurePass123!" \
  -F "image=@profile.jpg"
```

### Login User
```bash
curl -X POST /api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123!"}'
```

### Get Current User
```bash
curl -X GET /api/v1/auth/me \
  -H "Authorization: Bearer <access_token>"
```

### Update Profile
```bash
curl -X PUT /api/v1/auth/profile \
  -H "Authorization: Bearer <access_token>" \
  -F "name=John Smith" \
  -F "image=@newprofile.jpg"
```
