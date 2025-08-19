"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/registration.routes.ts
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const registration_controller_1 = require("../controllers/registration.controller");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const registrationRouter = express_1.default.Router();
// All routes require authentication
registrationRouter.use(auth_middleware_1.authMiddleware);
// User routes - apply rate limiting
registrationRouter.post("/register", rateLimit_middleware_1.registrationLimiter, registration_controller_1.registerForEvent); // Strict rate limiting for registrations
registrationRouter.get("/user", rateLimit_middleware_1.generalLimiter, registration_controller_1.getUserRegistrations); // Moderate rate limiting for user data
registrationRouter.get("/ticket/:registrationId", rateLimit_middleware_1.generalLimiter, registration_controller_1.getHallTicket); // Moderate rate limiting for tickets
registrationRouter.delete("/cancel/:registrationId", rateLimit_middleware_1.registrationLimiter, registration_controller_1.cancelRegistration); // Strict rate limiting for cancellations
// Admin/Organizer routes - apply rate limiting
registrationRouter.get("/event/:eventId", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), registration_controller_1.getEventRegistrations);
registrationRouter.put("/:registrationId/status", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), registration_controller_1.updateRegistrationStatus);
registrationRouter.get("/ticket/user/:userId/event/:eventId", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), registration_controller_1.getHallTicketForUser);
registrationRouter.get("/tickets/event/:eventId", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), registration_controller_1.getAllEventHallTickets);
exports.default = registrationRouter;
//# sourceMappingURL=registration.routes.js.map