import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, searchEvents, getEventsByCategory, getMyEvents, getEventParticipants, markParticipantAttendance } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import { createEventSchema,updateEventWithIdSchema } from "../schemas/event.schema";
import upload from "../middlewares/multer.middleware";

const eventRouter = Router();

// Event creation
eventRouter.post("/", 
  authMiddleware, 
  authorizeRoles("admin", "organizer"), 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'organizerLogo', maxCount: 1 }
  ]), // Handle multiple files (event image + organizer logo)
  validateSchema(createEventSchema), 
  createEvent
);

// Public read endpoints
eventRouter.get("/", getEvents);
eventRouter.get("/search", searchEvents);
eventRouter.get("/category/:category", getEventsByCategory);

// Protected endpoints for organizers/admins (place before dynamic :id to avoid shadowing)
eventRouter.get("/my/events", authMiddleware, authorizeRoles("admin", "organizer"), getMyEvents);

// Dynamic fetch by id (kept after specific routes)
eventRouter.get("/:id", getEventById);
eventRouter.get("/:id/participants", authMiddleware, authorizeRoles("admin", "organizer"), getEventParticipants);
eventRouter.patch("/:id/participants/:participantId/attendance", authMiddleware, authorizeRoles("admin", "organizer"), markParticipantAttendance);

// Event modification - apply strict rate limiting and upload limiting
eventRouter.put("/:id", 
  authMiddleware, 
  authorizeRoles("admin", "organizer"), 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'organizerLogo', maxCount: 1 }
  ]), // Handle multiple files (event image + organizer logo)
  validateSchema(updateEventWithIdSchema), 
  updateEvent
);

// Event deletion - moderate rate limiting
eventRouter.delete("/:id", 
  authMiddleware, 
  authorizeRoles("admin", "organizer"), 
  deleteEvent
);

export default eventRouter;