import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import { createEventSchema,updateEventWithIdSchema } from "../schemas/event.schema";
import upload from "../middlewares/mutlter.middleware";

const eventRouter = Router();

eventRouter.post("/", authMiddleware, authorizeRoles("admin", "organizer"), upload.single("image"),validateSchema(createEventSchema), createEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.put("/:id", authMiddleware, authorizeRoles("admin", "organizer"), upload.single("image"),validateSchema(updateEventWithIdSchema), updateEvent);
eventRouter.delete("/:id", authMiddleware, authorizeRoles("admin", "organizer"), deleteEvent);

export default eventRouter;