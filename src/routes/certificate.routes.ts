// src/routes/certificate.routes.ts
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { generalLimiter } from "../middlewares/rateLimit.middleware";
import {
  markAttendance,
  markBulkAttendance,
  generateCertificate,
  getCertificateData,
  getEventAttendanceStats,
  getEventRegistrations,
  getCertificateThemes
} from "../controllers/certificate.controller";

const certificateRouter = express.Router();

// Apply rate limiting to all certificate routes
certificateRouter.use(generalLimiter);

// All routes require authentication and manager role (admin/organizer)
certificateRouter.use(authMiddleware);
certificateRouter.use(authorizeRoles("admin", "organizer"));

// Attendance management
certificateRouter.post("/attendance/:registrationId", markAttendance);
certificateRouter.post("/attendance/bulk", markBulkAttendance);

// Certificate generation and data
certificateRouter.get("/generate/:registrationId", generateCertificate);
certificateRouter.get("/data/:registrationId", getCertificateData);

// Event management and statistics
certificateRouter.get("/event/:eventId/stats", getEventAttendanceStats);
certificateRouter.get("/event/:eventId/registrations", getEventRegistrations);

// Certificate customization options
certificateRouter.get("/themes", getCertificateThemes);

export default certificateRouter;
