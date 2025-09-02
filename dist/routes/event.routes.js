"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const event_schema_1 = require("../schemas/event.schema");
const multer_middleware_1 = __importDefault(require("../middlewares/multer.middleware"));
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const eventRouter = (0, express_1.Router)();
// Event creation - apply strict rate limiting and upload limiting
eventRouter.post("/", rateLimit_middleware_1.eventCreationLimiter, // Limit event creation
rateLimit_middleware_1.uploadLimiter, // Limit file uploads
auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), multer_middleware_1.default.single("image"), (0, validate_middleware_1.validateSchema)(event_schema_1.createEventSchema), event_controller_1.createEvent);
// Public read endpoints
eventRouter.get("/", event_controller_1.getEvents);
eventRouter.get("/search", event_controller_1.searchEvents);
eventRouter.get("/category/:category", event_controller_1.getEventsByCategory);
eventRouter.get("/:id", event_controller_1.getEventById);
// Event modification - apply strict rate limiting and upload limiting
eventRouter.put("/:id", rateLimit_middleware_1.eventCreationLimiter, // Limit event updates
rateLimit_middleware_1.uploadLimiter, // Limit file uploads
auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), multer_middleware_1.default.single("image"), (0, validate_middleware_1.validateSchema)(event_schema_1.updateEventWithIdSchema), event_controller_1.updateEvent);
// Event deletion - moderate rate limiting
eventRouter.delete("/:id", rateLimit_middleware_1.eventCreationLimiter, // Limit event deletions
auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), event_controller_1.deleteEvent);
exports.default = eventRouter;
//# sourceMappingURL=event.routes.js.map