// src/routes/registration.routes.ts
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
    registerForEvent,
    getUserRegistrations,
    getEventRegistrations,
    updateRegistrationStatus,
    cancelRegistration,
    getHallTicket,
    getHallTicketForUser,
    getAllEventHallTickets
} from "../controllers/registration.controller";
import { generalLimiter, registrationLimiter } from "../middlewares/rateLimit.middleware";

const registrationRouter = express.Router();

// All routes require authentication
registrationRouter.use(authMiddleware);

// User routes - apply rate limiting
registrationRouter.post("/register", registrationLimiter, registerForEvent); // Strict rate limiting for registrations
registrationRouter.get("/user", generalLimiter, getUserRegistrations); // Moderate rate limiting for user data
registrationRouter.get("/ticket/:registrationId", generalLimiter, getHallTicket); // Moderate rate limiting for tickets
registrationRouter.delete("/cancel/:registrationId", registrationLimiter, cancelRegistration); // Strict rate limiting for cancellations

// Admin/Organizer routes - apply rate limiting
registrationRouter.get("/event/:eventId", generalLimiter, authorizeRoles("admin", "organizer"), getEventRegistrations);
registrationRouter.put("/:registrationId/status", generalLimiter, authorizeRoles("admin", "organizer"), updateRegistrationStatus);
registrationRouter.get("/ticket/user/:userId/event/:eventId", generalLimiter, authorizeRoles("admin", "organizer"), getHallTicketForUser);
registrationRouter.get("/tickets/event/:eventId", generalLimiter, authorizeRoles("admin", "organizer"), getAllEventHallTickets);

export default registrationRouter;
