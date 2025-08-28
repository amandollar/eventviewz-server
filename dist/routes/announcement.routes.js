"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/announcement.routes.ts
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const announcement_controller_1 = require("../controllers/announcement.controller");
const announcement_schema_1 = require("../schemas/announcement.schema");
const announcementRouter = express_1.default.Router();
// Public routes (no authentication required)
announcementRouter.get("/", announcement_controller_1.getAnnouncements);
announcementRouter.get("/latest", announcement_controller_1.getLatestAnnouncements);
announcementRouter.get("/type/:type", announcement_controller_1.getAnnouncementsByType);
announcementRouter.get("/:id", announcement_controller_1.getAnnouncementById);
// Admin-only routes (require authentication and admin role)
announcementRouter.use(auth_middleware_1.authMiddleware);
announcementRouter.use((0, role_middleware_1.authorizeRoles)("admin"));
announcementRouter.post("/", (0, validate_middleware_1.validateSchema)(announcement_schema_1.createAnnouncementSchema), announcement_controller_1.createAnnouncement);
announcementRouter.put("/:id", (0, validate_middleware_1.validateSchema)(announcement_schema_1.updateAnnouncementSchema), announcement_controller_1.updateAnnouncement);
announcementRouter.delete("/:id", announcement_controller_1.deleteAnnouncement);
exports.default = announcementRouter;
//# sourceMappingURL=announcement.routes.js.map