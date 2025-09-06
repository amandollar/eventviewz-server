// src/routes/registration.routes.ts
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import {
    registerForEvent,
    getUserRegistrations,
    getEventRegistrations,
    updateRegistrationStatus,
    updateRegistration,
    cancelRegistration,
    getHallTicket,
    getHallTicketForUser,
    getAllEventHallTickets
} from "../controllers/registration.controller";
import { registrationLimiter } from "../middlewares/rateLimit.middleware";
import { registerForEventSchema, updateRegistrationSchema } from "../schemas/registration.schema";

const registrationRouter = express.Router();

// All routes require authentication
registrationRouter.use(authMiddleware);

// User routes - apply rate limiting
registrationRouter.post("/register", registrationLimiter, validateSchema(registerForEventSchema), registerForEvent); // Strict rate limiting for registrations
registrationRouter.get("/user", getUserRegistrations); // User data
registrationRouter.put("/update", validateSchema(updateRegistrationSchema), updateRegistration); // Update registration details
registrationRouter.get("/ticket/:registrationId", getHallTicket); // Get tickets
registrationRouter.delete("/cancel/:registrationId",authorizeRoles("admin","organizer"), registrationLimiter, cancelRegistration); // Strict rate limiting for cancellations

// Admin/Organizer routes - apply rate limiting
registrationRouter.get("/event/:eventId", authorizeRoles("admin", "organizer"), getEventRegistrations);
registrationRouter.put("/:registrationId/status", authorizeRoles("admin", "organizer"), updateRegistrationStatus);
registrationRouter.get("/ticket/user/:userId/event/:eventId", authorizeRoles("admin", "organizer"), getHallTicketForUser);
registrationRouter.get("/tickets/event/:eventId", authorizeRoles("admin", "organizer"), getAllEventHallTickets);

export default registrationRouter;
