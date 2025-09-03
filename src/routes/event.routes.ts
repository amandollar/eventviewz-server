import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, searchEvents, getEventsByCategory, getMyEvents } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import { createEventSchema,updateEventWithIdSchema } from "../schemas/event.schema";
import upload from "../middlewares/multer.middleware";
import { eventCreationLimiter, uploadLimiter } from "../middlewares/rateLimit.middleware";

const eventRouter = Router();

// Event creation - apply strict rate limiting and upload limiting
eventRouter.post("/", 
  eventCreationLimiter, // Limit event creation
  uploadLimiter, // Limit file uploads
  authMiddleware, 
  authorizeRoles("admin", "organizer"), 
  upload.single("image"),
  validateSchema(createEventSchema), 
  createEvent
);

// Public read endpoints
eventRouter.get("/", getEvents);
eventRouter.get("/search", searchEvents);
eventRouter.get("/category/:category", getEventsByCategory);
eventRouter.get("/:id", getEventById);

// Protected endpoints for organizers/admins
eventRouter.get("/my/events", authMiddleware, authorizeRoles("admin", "organizer"), getMyEvents);

// Event modification - apply strict rate limiting and upload limiting
eventRouter.put("/:id", 
  eventCreationLimiter, // Limit event updates
  uploadLimiter, // Limit file uploads
  authMiddleware, 
  authorizeRoles("admin", "organizer"), 
  upload.single("image"),
  validateSchema(updateEventWithIdSchema), 
  updateEvent
);

// Event deletion - moderate rate limiting
eventRouter.delete("/:id", 
  eventCreationLimiter, // Limit event deletions
  authMiddleware, 
  authorizeRoles("admin", "organizer"), 
  deleteEvent
);

export default eventRouter;