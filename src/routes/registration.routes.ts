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

const registrationRouter = express.Router();

// All routes require authentication
registrationRouter.use(authMiddleware);

// User routes
registrationRouter.post("/register", registerForEvent);
registrationRouter.get("/user", getUserRegistrations);
registrationRouter.get("/ticket/:registrationId", getHallTicket);
registrationRouter.delete("/cancel/:registrationId", cancelRegistration);

// Admin/Organizer routes
registrationRouter.get("/event/:eventId", authorizeRoles("admin", "organizer"), getEventRegistrations);
registrationRouter.put("/:registrationId/status", authorizeRoles("admin", "organizer"), updateRegistrationStatus);
registrationRouter.get("/ticket/user/:userId/event/:eventId", authorizeRoles("admin", "organizer"), getHallTicketForUser);
registrationRouter.get("/tickets/event/:eventId", authorizeRoles("admin", "organizer"), getAllEventHallTickets);

export default registrationRouter;
