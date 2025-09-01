# 🚀 EventViewz Backend Server

A robust, scalable event management backend built with Node.js, Express, TypeScript, and MongoDB. Features comprehensive authentication, event management, registration systems, payment integration, and role-based access control.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Authentication System](#-authentication-system)
- [Middleware Architecture](#-middleware-architecture)
- [Validation Schemas](#-validation-schemas)
- [Rate Limiting](#-rate-limiting)
- [File Upload System](#-file-upload-system)
- [Payment Integration](#-payment-integration)
- [Security Features](#-security-features)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)


## 🛠️ Tech Stack

### **Core Technologies**
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.9.2
- **Database**: MongoDB 8.17.1
- **ORM**: Mongoose 8.17.1

### **Authentication & Security**
- **JWT**: jsonwebtoken 9.0.2
- **Password Hashing**: bcryptjs 3.0.2
- **OAuth 2.0**: Google APIs 156.0.0
- **Rate Limiting**: express-rate-limit 8.0.1

### **File Management**
- **File Upload**: Multer 2.0.2
- **Cloud Storage**: Cloudinary 1.41.3
- **Storage Integration**: multer-storage-cloudinary 4.0.0

### **Payment Processing**
- **Payment Gateway**: Razorpay 2.9.6
- **Webhook Security**: Crypto (built-in)

### **Validation & Type Safety**
- **Schema Validation**: Zod 4.0.17
- **Type Safety**: TypeScript 5.9.2

### **Development Tools**
- **Process Manager**: Nodemon 3.1.10
- **Build Tool**: TypeScript Compiler
- **Package Manager**: npm

## 📁 Project Structure

```
eventviewz-server/
├── 📁 src/
│   ├── 📁 controllers/           # Business logic handlers
│   │   ├── auth.controller.ts    # Authentication & user management
│   │   ├── event.controller.ts   # Event CRUD operations
│   │   ├── registration.controller.ts # Event registration logic
│   │   ├── payment.controller.ts # Razorpay integration
│   │   ├── announcement.controller.ts # Admin announcements
│   │   ├── sponsor.controller.ts # Sponsor management
│   │   └── organizerApplication.controller.ts # Organizer applications
│   │
│   ├── 📁 models/               # Database schemas
│   │   ├── User.ts             # User authentication & profiles
│   │   ├── Event.ts            # Event data & tickets
│   │   ├── Register.ts         # Registration records
│   │   ├── Announcement.ts     # System announcements
│   │   ├── Sponsor.ts          # Sponsor carousel
│   │   ├── OrganizerApplication.ts # Organizer applications
│   │   └── Certificate.ts      # Event certificates (deprecated - use certificate system)
│   │
│   ├── 📁 routes/              # API endpoint definitions
│   │   ├── index.routes.ts     # Main router configuration
│   │   ├── auth.routes.ts      # Authentication endpoints
│   │   ├── event.routes.ts     # Event management endpoints
│   │   ├── registration.routes.ts # Registration endpoints
│   │   ├── payment.routes.ts   # Payment endpoints
│   │   ├── announcement.routes.ts # Announcement endpoints
│   │   ├── sponsor.routes.ts   # Sponsor endpoints
│   │   ├── organizerApplication.routes.ts # Application endpoints
│   │   └── certificate.routes.ts # Certificate & attendance endpoints
│   │
│   ├── 📁 middlewares/         # Request processing middleware
│   │   ├── auth.middleware.ts  # JWT authentication
│   │   ├── role.middleware.ts  # Role-based access control
│   │   ├── validate.middleware.ts # Zod schema validation
│   │   ├── rateLimit.middleware.ts # Rate limiting
│   │   └── multer.middleware.ts # File upload handling
│   │
│   ├── 📁 schemas/             # Zod validation schemas
│   │   ├── auth.schemas.ts     # Authentication validation
│   │   ├── event.schema.ts     # Event validation
│   │   ├── registration.schema.ts # Registration validation
│   │   ├── announcement.schema.ts # Announcement validation
│   │   ├── sponsor.schema.ts   # Sponsor validation
│   │   └── organizerApplication.schema.ts # Application validation
│   │
│   ├── 📁 types/               # TypeScript type definitions
│   │   ├── auth.ts            # Authentication types
│   │   └── enums.ts           # System enums
│   │
│   ├── 📁 utils/               # Utility functions
│   │   ├── auth.utils.ts      # Password & token utilities
│   │   ├── cloudinary.ts      # Cloudinary configuration
│   │   ├── jwt.ts             # JWT token utilities
│   │   ├── hallTicket.ts      # Hall ticket generation
│   │   ├── certificateGenerator.ts # PDF certificate generation
│   │   └── registrationSideEffects.ts # Registration side effects
│   │
│   ├── 📁 libs/               # External library configurations
│   │   └── db.ts             # MongoDB connection
│   │
│   └── index.ts               # Server entry point
│
├── 📁 docs/                   # Documentation
│   ├── USER.md              # User management & authentication
│   ├── EVENT.md             # Event management & tickets
│   ├── REGISTRATION.md      # Registration system
│   ├── PAYMENT.md           # Payment integration
│   ├── ANNOUNCEMENT.md      # System announcements
│   ├── SPONSOR.md           # Sponsor management
│   ├── ORGANIZER_APPLICATION.md # Organizer applications
│   └── CERTIFICATE.md       # Certificate & attendance system
│         
│
├── 📁 dist/                   # Compiled JavaScript (TypeScript output)
├── package.json               # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## ✨ Features

### **🔐 Authentication System**
- **Dual Authentication**: Email/Password + Google OAuth 2.0
- **JWT Tokens**: 15-minute access tokens, 7-day refresh tokens
- **Password Security**: Strong validation with bcrypt hashing
- **Role-Based Access**: Student, Organizer, Admin roles

### **📅 Event Management**
- **CRUD Operations**: Create, read, update, delete events
- **Image Upload**: Cloudinary integration for event posters
- **Ticket System**: Multiple ticket types with pricing
- **Category Management**: Hackathon, Workshop, Seminar, Cultural
- **Search & Filter**: Text search and category filtering

### **🎫 Registration System**
- **Enhanced Registration**: Comprehensive user data collection
- **Free vs Paid Events**: Automatic vs payment-required registration
- **Hall Tickets**: Automatic generation with QR codes
- **Status Management**: pending → confirmed → cancelled/failed/refunded
- **Side Effects**: Automatic participant counting and ticket management

### **💳 Payment Integration**
- **Razorpay Integration**: Complete payment flow
- **Webhook Security**: HMAC signature verification
- **Order Management**: Payment order creation and verification
- **Status Tracking**: Real-time payment status updates

### **👥 User Management**
- **Profile Management**: Name, image, role updates
- **Organizer Applications**: Student-to-organizer promotion system
- **Role Elevation**: Automatic role changes on application approval

### **📢 System Features**
- **Announcements**: Admin-only system notifications
- **Sponsor Management**: Revenue generation through carousel
- **Rate Limiting**: Comprehensive API protection
- **File Management**: Secure image upload and storage

### **🏆 Certificate & Attendance System**
- **Attendance Tracking**: Mark individual and bulk attendance for past events
- **PDF Generation**: 3 beautiful certificate templates (Classic, Modern, Elegant)
- **Advanced Theming**: 5 predefined themes + custom color support
- **Real QR Codes**: Verifiable QR codes with event data
- **Streaming Support**: Efficient PDF generation for better performance
- **Customization**: Greetings, colors, logos, signatures, and font sizes
- **Event Validation**: Only past events allow attendance marking
- **Manager Controls**: Role-based access for admins/organizers
- **Statistics**: Comprehensive attendance reports and analytics
- **Input Validation**: Comprehensive option validation and error handling

## 🌐 API Endpoints

### **Base URL**: `http://localhost:5000/api/v1`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/register` | POST | User registration | ❌ |
| `/auth/login` | POST | User login | ❌ |
| `/auth/google` | GET | Google OAuth initiation | ❌ |
| `/auth/google/callback` | GET | OAuth callback | ❌ |
| `/auth/refresh` | POST | Refresh access token | ❌ |
| `/auth/user` | GET | Get current user | ✅ |
| `/auth/user` | PUT | Update user profile | ✅ |
  `/auth/user` | DELETE | Delete user profile | ✅ |
| `/auth/logout` | POST | User logout | ❌ |
| `/events` | GET | List all events | ❌ |
| `/events` | POST | Create event | ✅ (Admin/Organizer) |
| `/events/:id` | GET | Get event by ID | ❌ |
| `/events/:id` | PUT | Update event | ✅ (Admin/Organizer) |
| `/events/:id` | DELETE | Delete event | ✅ (Admin/Organizer) |
| `/registrations/register` | POST | Register for event | ✅ |
| `/registrations/user` | GET | Get user registrations | ✅ |
| `/registrations/event/:id` | GET | Get event registrations | ✅ (Admin/Organizer) |
| `/payments/create-order` | POST | Create payment order | ✅ |
| `/payments/status/:id` | GET | Get payment status | ✅ |
| `/announcements` | GET | List announcements | ❌ |
| `/announcements` | POST | Create announcement | ✅ (Admin) |
| `/sponsors` | GET | List sponsors | ❌ |
| `/sponsors` | POST | Create sponsor | ✅ (Admin) |
| `/organizer-applications` | POST | Submit application | ✅ |
  `/organizer-applications` | PUT | Update your application | ✅ |
| `/organizer-applications/my-application` | GET | List your applications | ✅ |
| `/certificates/attendance/:id` | POST | Mark individual attendance | ✅ (Admin/Organizer) |
| `/certificates/attendance/bulk` | POST | Mark bulk attendance | ✅ (Admin/Organizer) |
| `/certificates/generate/:id` | GET | Generate PDF certificate | ✅ (Admin/Organizer) |
| `/certificates/data/:id` | GET | Get certificate data | ✅ (Admin/Organizer) |
| `/certificates/event/:id/stats` | GET | Get attendance statistics | ✅ (Admin/Organizer) |
| `/certificates/event/:id/registrations` | GET | Get event registrations | ✅ (Admin/Organizer) |
| `/certificates/themes` | GET | Get certificate themes & options | ✅ (Admin/Organizer) |

.
.
.
.


## 🗄️ Database Models

### **User Model**
```typescript
interface IUser {
  name: string;
  email: string;
  image?: string;
  role: UserRole; // "student" | "organizer" | "admin"
  googleId?: string;
  password?: string;
  isEmailVerified: boolean;
  lastLogin?: Date;
  refreshToken?: string;
}
```

### **Event Model**
```typescript
interface IEvent {
  title: string;
  description?: string;
  image: string;
  date: Date;
  startTime: string; // "14:30"
  endTime: string;   // "16:30"
  venue: string;
  category: EventCategory;
  createdBy: ObjectId;
  participants: ObjectId[];
  maxParticipants?: number;
  currentParticipants: number;
  tickets: ITicket[];
  isActive: boolean;
}
```

### **Registration Model**
```typescript
interface IRegistration {
  user: ObjectId;
  event: ObjectId;
  status: "pending" | "confirmed" | "cancelled" | "failed" | "refunded";
  ticketType: string;
  amount?: number;
  paymentOrderId?: string;
  paymentId?: string;
  registrationNumber: string;
  phoneNumber: string;
  college: string;
  department: string;
  yearOfStudy: string;
  dietaryPreferences?: string;
  emergencyContact?: EmergencyContact;
  hallTicket?: string;
  // Attendance tracking
  isAttended: boolean;
  attendedAt?: Date;
  attendedBy?: ObjectId; // Manager who marked attendance
}
```

## 🔐 Authentication System

### **JWT Token Structure**
```typescript
interface JWTPayload {
  id: string;        // User ID
  role?: string;     // User role
  iat?: number;      // Issued at timestamp
  exp?: number;      // Expiration timestamp
}
```

### **Token Expiry**
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

## 🏆 Certificate System

### **Attendance Tracking**
- **Individual Attendance**: Mark single user attendance
- **Bulk Attendance**: Mark multiple users at once
- **Event Validation**: Only past events allow attendance marking
- **Duplicate Prevention**: Cannot mark attendance twice

### **Certificate Generation**
- **PDF Templates**: Classic, Modern, and Elegant designs
- **Advanced Theming**: 5 predefined themes + custom colors
- **Real QR Codes**: Verifiable QR codes with event data
- **Streaming Support**: Efficient PDF generation for better performance
- **Customization**: Greetings, colors, logos, signatures, and font sizes
- **Data Integration**: Automatic event and user information
- **Download**: Direct PDF file download

### **Manager Controls**
- **Role-based Access**: Admin and Organizer roles only
- **Event Statistics**: Comprehensive attendance reports
- **Registration Management**: View all participants with status
- **Bulk Operations**: Efficient mass management

### **Security Features**
- **Authentication Required**: Valid JWT tokens mandatory
- **Event Validation**: Prevents future event attendance marking
- **Data Integrity**: Certificates only for attended participants
- **Input Validation**: All parameters validated and sanitized
- **QR Code Security**: Verifiable QR codes for authenticity
- **Option Validation**: Comprehensive validation of all certificate options

### **Password Requirements**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*(),.?":{}|<>)

## 🛡️ Middleware Architecture

### **1. Authentication Middleware (`auth.middleware.ts`)**
- **Purpose**: JWT token verification
- **Function**: Extracts and validates JWT tokens
- **Output**: Sets `req.user` with decoded token data
- **Security**: Comprehensive error handling and logging

### **2. Role Middleware (`role.middleware.ts`)**
- **Purpose**: Role-based access control
- **Function**: Checks user permissions for specific routes
- **Usage**: `authorizeRoles("admin", "organizer")`
- **Security**: Prevents unauthorized access

### **3. Validation Middleware (`validate.middleware.ts`)**
- **Purpose**: Request data validation
- **Function**: Uses Zod schemas for runtime validation
- **Features**: Structured error messages, field-level validation
- **Flexibility**: Supports body, query, and params validation

### **4. Rate Limiting Middleware (`rateLimit.middleware.ts`)**
- **Purpose**: API abuse prevention
- **Types**:
  - **Global**: 100 requests per 15 minutes
  - **Authentication**: 5 requests per 15 minutes
  - **File Uploads**: 10 uploads per hour
  - **Event Creation**: 20 events per hour
  - **Registrations**: 30 registrations per 15 minutes
  - **Payments**: 10 operations per 15 minutes

### **5. File Upload Middleware (`multer.middleware.ts`)**
- **Purpose**: File upload handling
- **Storage**: Cloudinary integration
- **Features**: Automatic file type validation, size limits
- **Output**: Sets `req.file` or `req.files`

## 📝 Validation Schemas

### **Zod Schema Examples**
```typescript
// Event Creation Schema
export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    date: z.coerce.date(),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    venue: z.string().min(2).max(200),
    category: z.enum(["hackathon", "workshop", "seminar", "cultural"])
  }),
  file: fileSchema
});
```

## 🔒 Security Features

### **Rate Limiting**
- **IP-based limiting**: Prevents abuse from single sources
- **Endpoint-specific limits**: Different limits for different operations
- **Graceful degradation**: Informative error messages with retry times

### **Input Validation**
- **Zod schemas**: Runtime validation for all endpoints
- **Type safety**: TypeScript compilation checks
- **Sanitization**: Automatic input sanitization

### **Authentication Security**
- **JWT tokens**: Secure token-based authentication
- **Refresh tokens**: Automatic token renewal
- **OAuth 2.0**: Google authentication integration
- **Password hashing**: bcrypt for secure storage

### **File Upload Security**
- **Type validation**: Only allowed image formats
- **Size limits**: Prevents large file uploads
- **Cloud storage**: Secure CDN delivery
- **Virus scanning**: Cloudinary built-in protection

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 18+
- MongoDB instance (local or Atlas)
- Google OAuth 2.0 credentials
- Cloudinary account
- Razorpay account
- PDF generation support (PDFKit)

### **1. Clone Repository**
```bash
git clone <repository-url>
cd eventviewz-server
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your credentials
```

### **4. Build & Run**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🌍 Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eventviewz

# Authentication
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Frontend
FRONTEND_URL=http://localhost:3000
```
