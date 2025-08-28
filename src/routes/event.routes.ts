import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import { createEventSchema,updateEventWithIdSchema } from "../schemas/event.schema";
import upload from "../middlewares/multer.middleware";
import { generalLimiter, eventCreationLimiter, uploadLimiter } from "../middlewares/rateLimit.middleware";

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

// Public read endpoints - moderate rate limiting
eventRouter.get("/", generalLimiter, getEvents);
eventRouter.get("/:id", generalLimiter, getEventById);

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