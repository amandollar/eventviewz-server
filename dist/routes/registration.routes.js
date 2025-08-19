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
const registrationRouter = express_1.default.Router();
// All routes require authentication
registrationRouter.use(auth_middleware_1.authMiddleware);
// User routes
registrationRouter.post("/register", registration_controller_1.registerForEvent);
registrationRouter.get("/user", registration_controller_1.getUserRegistrations);
registrationRouter.get("/ticket/:registrationId", registration_controller_1.getHallTicket);
registrationRouter.delete("/cancel/:registrationId", registration_controller_1.cancelRegistration);
// Admin/Organizer routes
registrationRouter.get("/event/:eventId", (0, role_middleware_1.authorizeRoles)("admin", "organizer"), registration_controller_1.getEventRegistrations);
registrationRouter.put("/:registrationId/status", (0, role_middleware_1.authorizeRoles)("admin", "organizer"), registration_controller_1.updateRegistrationStatus);
registrationRouter.get("/ticket/user/:userId/event/:eventId", (0, role_middleware_1.authorizeRoles)("admin", "organizer"), registration_controller_1.getHallTicketForUser);
registrationRouter.get("/tickets/event/:eventId", (0, role_middleware_1.authorizeRoles)("admin", "organizer"), registration_controller_1.getAllEventHallTickets);
exports.default = registrationRouter;
//# sourceMappingURL=registration.routes.js.map