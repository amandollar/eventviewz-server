// src/routes/certificate.routes.ts
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

import {
  markAttendance,
  markBulkAttendance,
  getCertificateData,
  getEventAttendanceStats,
  getEventRegistrations,
  generateTemplateCertificate,
  generateStudentTemplateCertificate,
  getCertificateTemplates
} from "../controllers/certificate.controller";

const certificateRouter = express.Router();

// Certificate routes

// Student certificate download (requires authentication only)
certificateRouter.post("/student/template/:registrationId", authMiddleware, generateStudentTemplateCertificate);

// All other routes require authentication and manager role (admin/organizer)
certificateRouter.use(authMiddleware);
certificateRouter.use(authorizeRoles("admin", "organizer"));

// Attendance management
certificateRouter.post("/attendance/:registrationId", markAttendance);
certificateRouter.post("/attendance/bulk", markBulkAttendance);

// Certificate generation and data
certificateRouter.post("/template/:registrationId", generateTemplateCertificate);
certificateRouter.get("/data/:registrationId", getCertificateData);

// Event management and statistics
certificateRouter.get("/event/:eventId/stats", getEventAttendanceStats);
certificateRouter.get("/event/:eventId/registrations", getEventRegistrations);

// Certificate customization options
certificateRouter.get("/templates", getCertificateTemplates);

export default certificateRouter;
