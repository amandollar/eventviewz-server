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
const mutlter_middleware_1 = __importDefault(require("../middlewares/mutlter.middleware"));
const eventRouter = (0, express_1.Router)();
eventRouter.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), mutlter_middleware_1.default.single("image"), (0, validate_middleware_1.validateSchema)(event_schema_1.createEventSchema), event_controller_1.createEvent);
eventRouter.get("/", event_controller_1.getEvents);
eventRouter.get("/:id", event_controller_1.getEventById);
eventRouter.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), mutlter_middleware_1.default.single("image"), (0, validate_middleware_1.validateSchema)(event_schema_1.updateEventWithIdSchema), event_controller_1.updateEvent);
eventRouter.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.authorizeRoles)("admin", "organizer"), event_controller_1.deleteEvent);
exports.default = eventRouter;
//# sourceMappingURL=event.route.js.map