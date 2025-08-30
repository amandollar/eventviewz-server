// src/routes/announcement.routes.ts
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncementsByType,
    getLatestAnnouncements,
    toggleAnnouncementStatus
} from "../controllers/announcement.controller";
import {
    createAnnouncementSchema,
    updateAnnouncementSchema,
} from "../schemas/announcement.schema";

const announcementRouter = express.Router();

// Public routes (no authentication required)
announcementRouter.get("/", getAnnouncements);
announcementRouter.get("/latest", getLatestAnnouncements);
announcementRouter.get("/type/:type", getAnnouncementsByType);
announcementRouter.get("/:id", getAnnouncementById);

// Admin-only routes (require authentication and admin role)
announcementRouter.use(authMiddleware);
announcementRouter.use(authorizeRoles("admin"));

announcementRouter.post("/", validateSchema(createAnnouncementSchema), createAnnouncement);
announcementRouter.put("/:id", validateSchema(updateAnnouncementSchema), updateAnnouncement);
announcementRouter.delete("/:id", deleteAnnouncement);
announcementRouter.patch("/:id/toggle", toggleAnnouncementStatus);

export default announcementRouter;
