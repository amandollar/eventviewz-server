# EventViewz Backend Server

A Node.js/Express backend for event management with authentication, role-based access control, and Cloudinary integration.

## What is EventViewz?

EventViewz is a comprehensive event management platform that allows:
- **Admins** to create and manage events, projects, sponsors, and announcements
- **Organizers** to create events and manage registrations  
- **Students** to register for events and get hall tickets
- **Revenue generation** through sponsored carousel placements

## Features

- **Authentication**: Google OAuth 2.0 with JWT tokens
- **Role-Based Access**: Admin, Organizer, Student roles
- **Event Management**: CRUD operations with image uploads
- **Project System**: Collaborative projects with Cloudinary images
- **Registration System**: Event registration with hall ticket generation
- **Announcement System**: Admin-only announcements
- **Sponsor System**: Carousel sponsors for revenue generation
- **Image Storage**: Cloudinary integration for file uploads

## Tech Stack

- Node.js + Express 5.1.0
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image storage)
- Zod (validation)
- Multer (file uploads)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   # Fill in your MongoDB, Google OAuth, and Cloudinary credentials
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Complete API Documentation

### Base URL: `/api/v1`

### 🔐 Authentication (`/auth`)
- `GET /auth/google` - **Google OAuth Login**: Redirects user to Google for authentication
- `GET /auth/google/callback` - **OAuth Callback**: Handles Google's response and creates user session
- `POST /auth/refresh` - **Refresh Token**: Get new access token using refresh token
- `POST /auth/logout` - **Logout**: Clear user session and tokens
- `GET /auth/user` - **Get Current User**: Returns authenticated user's profile (Protected)

### 📅 Events (`/events`)
- `GET /events` - **List All Events**: Public endpoint to view all events
- `GET /events/:id` - **Get Event Details**: View specific event information
- `POST /events` - **Create Event**: Admin/Organizer creates new event with image (Protected)
- `PUT /events/:id` - **Update Event**: Admin/Organizer modifies existing event (Protected)
- `DELETE /events/:id` - **Delete Event**: Admin/Organizer removes event (Protected)

### 🚀 Projects (`/projects`)
- `GET /projects` - **List All Projects**: Public endpoint to browse projects
- `GET /projects/:id` - **Get Project Details**: View specific project with images
- `POST /projects` - **Create Project**: Admin/Organizer creates collaborative project (Protected)
- `PUT /projects/:id` - **Update Project**: Admin/Organizer modifies project (Protected)
- `DELETE /projects/:id` - **Delete Project**: Admin/Organizer removes project (Protected)
- `POST /projects/upload-image` - **Upload Project Image**: Add images to project gallery (Protected)
- `POST /projects/join-leave` - **Join/Leave Project**: Users can participate in projects (Protected)
- `GET /projects/user/my-projects` - **My Projects**: User views their own projects (Protected)

### 🎫 Registrations (`/registrations`)
- `POST /registrations` - **Register for Event**: User registers for an event (Protected)
- `GET /registrations/user/:userId` - **User Registrations**: View user's event registrations (Protected)
- `GET /registrations/event/:eventId` - **Event Registrations**: Admin/Organizer views event participants (Protected)
- `PUT /registrations/:id/status` - **Update Status**: Admin/Organizer changes registration status (Protected)
- `DELETE /registrations/:id` - **Cancel Registration**: User cancels their registration (Protected)
- `GET /registrations/ticket/:id` - **Get Hall Ticket**: User downloads their event hall ticket (Protected)
- `GET /registrations/ticket/user/:userId/event/:eventId` - **Admin Hall Ticket**: Admin gets specific user's ticket (Protected)
- `GET /registrations/tickets/event/:eventId` - **All Event Tickets**: Admin gets all tickets for an event (Protected)

### 📢 Announcements (`/announcements`)
- `GET /announcements/:id` - **Get Announcement**: Public endpoint to read announcements
- `POST /announcements` - **Create Announcement**: Admin creates new announcement (Protected)
- `PUT /announcements/:id` - **Update Announcement**: Admin modifies announcement (Protected)
- `DELETE /announcements/:id` - **Delete Announcement**: Admin removes announcement (Protected)

### 💰 Sponsors (`/sponsors`)
- `GET /sponsors` - **List All Sponsors**: Public endpoint to view all sponsors
- `GET /sponsors/carousel` - **Carousel Sponsors**: Get active, non-expired sponsors for main carousel
- `GET /sponsors/:id` - **Get Sponsor Details**: View specific sponsor information
- `POST /sponsors` - **Create Sponsor**: Admin creates new sponsored carousel entry (Protected)
- `PUT /sponsors/:id` - **Update Sponsor**: Admin modifies sponsor details (Protected)
- `DELETE /sponsors/:id` - **Delete Sponsor**: Admin removes sponsor (Protected)

### 🏥 Health Check
- `GET /` - **Server Status**: Returns server health and available endpoints

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventviewz
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Database Models

- **User**: Authentication, roles (Admin/Organizer/Student), profile data
- **Event**: Event details, dates, venue, images, participant limits
- **Project**: Collaborative projects, categories, status, image galleries
- **Registration**: User-event relationships, status tracking, hall tickets
- **Announcement**: System-wide notifications, admin-only creation
- **Sponsor**: Carousel sponsors, expiration dates, revenue generation

## Testing the APIs

### 1. **Health Check First**
```bash
GET http://localhost:5000/
# Should return server status and available endpoints
```

### 2. **Authentication Flow**
```bash
# 1. Google OAuth
GET http://localhost:5000/auth/google

# 2. After OAuth, get user info
GET http://localhost:5000/auth/user
# Include JWT token in Authorization header
```

### 3. **Create Event (Admin/Organizer)**
```bash
POST http://localhost:5000/events
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>

# Form data: title, description, date, startTime, endTime, venue, category, image
```

### 4. **Register for Event (Student)**
```bash
POST http://localhost:5000/registrations
Authorization: Bearer <JWT_TOKEN>

{
  "event": "event_id_here"
}
```

### 5. **Get Hall Ticket**
```bash
GET http://localhost:5000/registrations/ticket/:registration_id
Authorization: Bearer <JWT_TOKEN>
```

## License

MIT
