# Certificate System Documentation

## Overview

The Certificate System provides comprehensive attendance tracking and certificate generation capabilities for events. It allows managers (admins/organizers) to mark attendance for participants and generate beautiful, customizable PDF certificates with advanced theming and real QR codes.

## Features

- ✅ **Attendance Tracking**: Mark individual and bulk attendance for past events
- ✅ **PDF Generation**: 3 beautiful certificate templates (Classic, Modern, Elegant)
- ✅ **Advanced Theming**: 5 predefined themes + custom color support
- ✅ **Real QR Codes**: Verifiable QR codes with event data
- ✅ **Streaming Support**: Efficient PDF generation for better performance
- ✅ **Customization**: Greetings, colors, logos, signatures, and font sizes
- ✅ **Role-based Access**: Only managers can access certificate functions
- ✅ **Event Validation**: Only past events allow attendance marking
- ✅ **Bulk Operations**: Efficient mass attendance management
- ✅ **Statistics**: Comprehensive attendance reports and analytics
- ✅ **Input Validation**: Comprehensive option validation and error handling

## Authentication & Authorization

All certificate endpoints require:
- Valid JWT token in Authorization header
- User role: `admin` or `organizer`

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1/certificates
```

---

## 1. Attendance Management

### Mark Individual Attendance

**Endpoint:** `POST /attendance/:registrationId`

**Description:** Mark a single user as attended for an event

**Parameters:**
- `registrationId` (path): The registration ID to mark attendance for

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "registration": {
    "id": "registration_id",
    "eventTitle": "Tech Workshop 2024",
    "userName": "John Doe",
    "attendedAt": "2024-12-25T10:30:00.000Z",
    "markedBy": "Manager Name"
  }
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:5000/api/v1/certificates/attendance/REGISTRATION_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Validation Rules:**
- Event must have already occurred (past date)
- Registration must exist and be confirmed
- Attendance cannot be marked twice
- Only managers (admin/organizer) can mark attendance

---

### Mark Bulk Attendance

**Endpoint:** `POST /attendance/bulk`

**Description:** Mark multiple users as attended in a single operation

**Request Body:**
```json
{
  "registrationIds": ["reg_id_1", "reg_id_2", "reg_id_3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Processed 3 registrations",
  "results": [
    {
      "registrationId": "reg_id_1",
      "eventTitle": "Tech Workshop 2024",
      "userName": "John Doe",
      "attendedAt": "2024-12-25T10:30:00.000Z"
    }
  ],
  "errors": [
    {
      "registrationId": "reg_id_2",
      "error": "Already marked as attended"
    }
  ],
  "summary": {
    "total": 3,
    "successful": 1,
    "failed": 2
  }
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:5000/api/v1/certificates/attendance/bulk \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "registrationIds": ["reg_id_1", "reg_id_2", "reg_id_3"]
  }'
```

---

## 2. Certificate Generation

### Generate PDF Certificate

**Endpoint:** `GET /generate/:registrationId`

**Description:** Generate and download a PDF certificate for an attended participant

**Parameters:**
- `registrationId` (path): The registration ID to generate certificate for

**Request Body (JSON):**
```json
{
  "template": "modern",
  "greeting": "Congratulations on successfully completing",
  "includeQRCode": true,
  "theme": "corporate",
  "primaryColor": "#2c3e50",
  "secondaryColor": "#3498db",
  "includeLogo": true,
  "includeSignature": true,
  "fontSize": "medium"
}
```

**Response:** PDF file download (streamed)

**Curl Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/certificates/generate/REGISTRATION_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "modern",
    "theme": "corporate",
    "includeQRCode": true,
    "includeLogo": true,
    "includeSignature": true
  }' \
  --output certificate.pdf
```

**Validation Rules:**
- Registration must exist
- Attendance must be marked (`isAttended: true`)
- Only managers can generate certificates
- All options are validated before processing

---

### Get Certificate Data (Preview)

**Endpoint:** `GET /data/:registrationId`

**Description:** Get certificate data without generating PDF (for preview purposes)

**Parameters:**
- `registrationId` (path): The registration ID to get data for

**Response:**
```json
{
  "success": true,
  "certificateData": {
    "eventTitle": "Tech Workshop 2024",
    "userName": "John Doe",
    "eventDate": "2024-12-25T00:00:00.000Z",
    "eventVenue": "Conference Hall A",
    "eventLocation": "123 Tech Street, City",
    "greeting": "Congratulations on successfully completing",
    "issuedAt": "2024-12-25T10:30:00.000Z",
    "issuedBy": "Manager Name",
    "registrationId": "reg_id",
    "eventId": "event_id",
    "userId": "user_id"
  }
}
```

**Curl Example:**
```bash
curl -X GET http://localhost:5000/api/v1/certificates/data/REGISTRATION_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Get Certificate Themes and Options

**Endpoint:** `GET /themes`

**Description:** Get available certificate themes, templates, and customization options

**Response:**
```json
{
  "success": true,
  "themes": [
    {
      "name": "corporate",
      "colors": {
        "primary": "#2c3e50",
        "secondary": "#3498db",
        "accent": "#ecf0f1",
        "background": "#ffffff",
        "font": "Helvetica-Bold",
        "borderStyle": "double"
      }
    }
  ],
  "templates": ["classic", "modern", "elegant"],
  "fontSizes": ["small", "medium", "large"],
  "defaultOptions": {
    "template": "classic",
    "theme": "corporate",
    "fontSize": "medium",
    "includeQRCode": false,
    "includeLogo": false,
    "includeSignature": false
  }
}
```

**Curl Example:**
```bash
curl -X GET http://localhost:5000/api/v1/certificates/themes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 3. Event Management & Statistics

### Get Event Attendance Statistics

**Endpoint:** `GET /event/:eventId/stats`

**Description:** Get comprehensive attendance statistics for a specific event

**Parameters:**
- `eventId` (path): The event ID to get statistics for

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "event_id",
    "title": "Tech Workshop 2024",
    "date": "2024-12-25T00:00:00.000Z"
  },
  "statistics": {
    "totalRegistrations": 50,
    "attendedRegistrations": 45,
    "pendingAttendance": 5,
    "attendanceRate": "90.00"
  },
  "recentAttendance": [
    {
      "userName": "John Doe",
      "attendedAt": "2024-12-25T10:30:00.000Z",
      "markedBy": "Manager Name"
    }
  ]
}
```

**Curl Example:**
```bash
curl -X GET http://localhost:5000/api/v1/certificates/event/EVENT_ID_HERE/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Get Event Registrations with Attendance Status

**Endpoint:** `GET /event/:eventId/registrations`

**Description:** Get all registrations for an event with detailed attendance information

**Parameters:**
- `eventId` (path): The event ID to get registrations for

**Response:**
```json
{
  "success": true,
  "eventId": "event_id",
  "registrations": [
    {
      "id": "registration_id",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "registrationNumber": "REG001",
      "college": "Tech University",
      "department": "Computer Science",
      "yearOfStudy": "3rd Year",
      "registeredAt": "2024-12-20T09:00:00.000Z",
      "isAttended": true,
      "attendedAt": "2024-12-25T10:30:00.000Z",
      "attendedBy": "Manager Name",
      "canGenerateCertificate": true
    }
  ],
  "summary": {
    "total": 50,
    "attended": 45,
    "pending": 5
  }
}
```

**Curl Example:**
```bash
curl -X GET http://localhost:5000/api/v1/certificates/event/EVENT_ID_HERE/registrations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 4. Certificate Templates & Themes

### Available Templates

#### Classic Template
- **Style**: Traditional certificate with borders and formal layout
- **Features**: Double border design, centered text, professional appearance
- **Best For**: Academic events, formal ceremonies, traditional organizations

#### Modern Template
- **Style**: Clean, gradient design with header sections
- **Features**: Modern typography, color-coded sections, grid layout
- **Best For**: Tech events, modern companies, contemporary design preferences

#### Elegant Template
- **Style**: Sophisticated design with corner decorations and central seal
- **Features**: Corner decorations, central circular seal, premium appearance
- **Best For**: Premium events, luxury brands, high-end organizations

### Available Themes

#### Corporate Theme
- **Colors**: Professional blues and grays
- **Font**: Helvetica-Bold
- **Style**: Double border, formal layout
- **Best For**: Business events, corporate training

#### Fun Theme
- **Colors**: Vibrant oranges and yellows
- **Font**: Helvetica
- **Style**: Rounded borders, playful design
- **Best For**: Creative workshops, team building events

#### Academic Theme
- **Colors**: Scholarly greens and teals
- **Font**: Times-Bold
- **Style**: Classic borders, traditional layout
- **Best For**: Educational events, academic conferences

#### Premium Theme
- **Colors**: Luxury purples and deep blues
- **Font**: Helvetica-Bold
- **Style**: Elegant borders, sophisticated design
- **Best For**: High-end events, luxury brands

#### Custom Theme
- **Colors**: User-defined hex colors
- **Font**: Helvetica
- **Style**: Simple borders, flexible layout
- **Best For**: Branded events, custom requirements

### Font Size Options

- **Small**: Compact certificates (title: 24px, body: 14px)
- **Medium**: Standard certificates (title: 32px, body: 18px) - **Default**
- **Large**: Large format certificates (title: 40px, body: 22px)

---

## 5. Enhanced Features

### Real QR Code Generation

The system now generates **real, verifiable QR codes** instead of placeholders:

- **QR Content**: Contains registration ID, event ID, user ID, and verification timestamp
- **Customization**: QR colors match the selected theme
- **Verification**: QR codes can be scanned to verify certificate authenticity
- **Positioning**: Automatically placed in bottom-right corner with verification text

### Logo & Signature Support

- **Logo**: Placeholder logo area (ready for actual logo files)
- **Signature**: Digital signature line with manager name and title
- **Positioning**: Automatically positioned based on template and theme

### Streaming PDF Generation

- **Performance**: Direct streaming to response for better memory efficiency
- **Headers**: Automatic filename generation with user name
- **Error Handling**: Graceful fallback if streaming fails

---

## 6. Data Models

### Registration Model Updates

The registration model has been enhanced with attendance tracking fields:

```typescript
// Attendance tracking fields
isAttended: { type: Boolean, default: false };
attendedAt: { type: Date, required: false };
attendedBy: { type: Schema.Types.ObjectId, ref: "User", required: false };
```

### Enhanced Certificate Data Interface

```typescript
interface ICertificateData {
  eventTitle: string;
  userName: string;
  eventDate: Date;
  eventVenue: string;
  eventLocation?: string;
  greeting?: string;
  issuedAt: Date;
  issuedBy: string;
  registrationId: string;  // NEW: For QR code generation
  eventId: string;         // NEW: For QR code generation
  userId: string;          // NEW: For QR code generation
}
```

### Enhanced Certificate Options Interface

```typescript
interface ICertificateOptions {
  greeting?: string;
  includeQRCode?: boolean;
  template?: 'classic' | 'modern' | 'elegant';
  theme?: 'corporate' | 'fun' | 'academic' | 'premium' | 'custom';
  primaryColor?: string;
  secondaryColor?: string;
  includeLogo?: boolean;      // NEW: Logo support
  includeSignature?: boolean; // NEW: Signature support
  customFont?: string;        // NEW: Custom font support
  fontSize?: 'small' | 'medium' | 'large'; // NEW: Font size options
}
```

---

## 7. Error Handling & Validation

### Input Validation

All certificate options are validated before processing:

```typescript
// Color validation
if (options.primaryColor && !/^#[0-9A-F]{6}$/i.test(options.primaryColor)) {
  errors.push('Invalid primary color format. Use hex format (e.g., #2c3e50)');
}

// Template validation
if (options.template && !['classic', 'modern', 'elegant'].includes(options.template)) {
  errors.push('Invalid template. Choose from: classic, modern, elegant');
}

// Theme validation
if (options.theme && !['corporate', 'fun', 'academic', 'premium', 'custom'].includes(options.theme)) {
  errors.push('Invalid theme. Choose from: corporate, fun, academic, premium, custom');
}
```

### Common Error Responses

**400 Bad Request - Invalid Options**
```json
{
  "error": "Invalid certificate options",
  "details": [
    "Invalid primary color format. Use hex format (e.g., #2c3e50)",
    "Invalid theme. Choose from: corporate, fun, academic, premium, custom"
  ]
}
```

**401 Unauthorized**
```json
{
  "error": "Manager not authenticated"
}
```

**403 Forbidden**
```json
{
  "error": "Insufficient permissions to mark attendance"
}
```

**404 Not Found**
```json
{
  "error": "Registration not found"
}
```

**400 Bad Request - Business Logic**
```json
{
  "error": "Cannot mark attendance for future events"
}
```

---

## 8. Workflow Examples

### Complete Certificate Generation Workflow

1. **Event Occurs** (date passes)
2. **Mark Attendance** (during or after event)
   ```bash
   POST /api/v1/certificates/attendance/registration_id
   ```
3. **Get Available Options** (optional)
   ```bash
   GET /api/v1/certificates/themes
   ```
4. **Generate Certificate** (for attended participants)
   ```bash
   GET /api/v1/certificates/generate/registration_id
   # With custom options in request body
   ```

### Advanced Certificate Customization

```bash
curl -X GET "http://localhost:5000/api/v1/certificates/generate/REGISTRATION_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "elegant",
    "theme": "premium",
    "greeting": "Congratulations on successfully completing our advanced workshop",
    "includeQRCode": true,
    "includeLogo": true,
    "includeSignature": true,
    "fontSize": "large",
    "primaryColor": "#8e44ad",
    "secondaryColor": "#9b59b6"
  }' \
  --output personalized-certificate.pdf
```

### Bulk Attendance Workflow

1. **Get Event Registrations**
   ```bash
   GET /api/v1/certificates/event/event_id/registrations
   ```
2. **Mark Bulk Attendance**
   ```bash
   POST /api/v1/certificates/attendance/bulk
   ```
3. **Generate Certificates** (for each attended participant with custom options)

---

## 9. Rate Limiting

All certificate endpoints use `generalLimiter` for rate limiting:
- **Standard Rate**: Moderate rate limiting for most operations
- **Bulk Operations**: Same rate limiting as individual operations
- **PDF Generation**: Rate limited to prevent abuse
- **Theme Retrieval**: Same rate limiting as other endpoints

---

## 10. Security Considerations

- **Authentication Required**: All endpoints require valid JWT tokens
- **Role-based Access**: Only admin/organizer roles can access
- **Event Validation**: Prevents attendance marking for future events
- **Data Integrity**: Ensures certificates only for attended participants
- **Input Validation**: All parameters are validated and sanitized
- **QR Code Security**: QR codes contain verifiable data for authenticity

---

## 11. Testing

### Test Data Requirements

To test the certificate system, you need:
1. **Confirmed Registration**: User registered for an event
2. **Past Event Date**: Event date must be in the past
3. **Manager Role**: User with admin/organizer role
4. **Valid JWT Token**: Authentication token

### Test Scenarios

1. **Mark Attendance for Past Event** ✅
2. **Try to Mark Attendance for Future Event** ❌ (Should fail)
3. **Generate Certificate with Default Options** ✅
4. **Generate Certificate with Custom Theme** ✅
5. **Generate Certificate with Invalid Options** ❌ (Should fail with validation errors)
6. **Generate Certificate for Non-attended User** ❌ (Should fail)
7. **Bulk Attendance Marking** ✅
8. **Get Attendance Statistics** ✅
9. **Get Available Themes** ✅
10. **QR Code Generation** ✅

---

## 12. Troubleshooting

### Common Issues

**"Invalid certificate options"**
- Solution: Check the validation error details and fix the specific issues

**"Cannot mark attendance for future events"**
- Solution: Ensure event date is in the past

**"Cannot generate certificate for non-attended event"**
- Solution: Mark attendance first before generating certificate

**"Insufficient permissions"**
- Solution: Ensure user has admin or organizer role

**PDF Generation Fails**
- Solution: Check if registration exists and attendance is marked

**QR Code Not Appearing**
- Solution: Ensure `includeQRCode: true` is set in options

---

## 13. Future Enhancements

- **Real Logo Integration**: Load actual logo files from storage
- **Digital Signatures**: Cryptographic signature verification
- **Custom Fonts**: Embed custom font files for branding
- **Batch Certificate Generation**: Generate multiple certificates at once
- **Certificate Storage**: Store generated certificates in database
- **Email Integration**: Automatically email certificates to participants
- **QR Verification Endpoint**: Web endpoint to verify QR code authenticity
- **Certificate Templates**: More template options and customization
- **Watermarking**: Add watermarks for additional security

---

## 14. Performance Considerations

- **Streaming**: PDFs are streamed directly to response for better memory efficiency
- **Caching**: Theme and template data can be cached for better performance
- **Batch Operations**: Bulk attendance marking for efficient mass management
- **Error Handling**: Graceful fallbacks prevent system crashes

---

## Support

For technical support or questions about the certificate system, please refer to:
- API documentation
- Error logs
- System administrator
- Development team

---

*Last Updated: December 2024*
*Version: 2.0.0*
