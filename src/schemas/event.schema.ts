// src/validators/event.schema.ts
import { z } from "zod";

// Ticket schema
export const ticketSchema = z.object({
  type: z.string().min(1, "Ticket type is required"),
  price: z.number().min(0, "Price must be at least 0"),
  available: z.number().min(0, "Available tickets must be 0 or more").default(100),
});

// Event creation schema
export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().optional(),
  image: z.string().url("Invalid image URL"),
  date: z.coerce.date(), // accepts string/date
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format (24-hour)"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format (24-hour)"),
  venue: z.string().min(2, "Venue must be at least 2 characters").max(200, "Venue too long"),
  location: z.string().optional(),
  category: z.enum([
    "TECH",
    "CULTURAL",
    "SPORTS",
    "WORKSHOP",
    "SEMINAR",
    "OTHER",
  ]),
  createdBy: z.string().min(1, "CreatedBy (user id) is required"),
  participants: z.array(z.string()).optional(),
  maxParticipants: z.number().min(1).max(10000).optional(),
  isActive: z.boolean().optional().default(true),
  tickets: z.array(ticketSchema).optional(),
}).refine((data) => {
  // Ensure end time is after start time
  const start = data.startTime;
  const end = data.endTime;
  return start < end;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

// Event update schema (partial fields allowed)
export const updateEventSchema = createEventSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

// Event ID param schema
export const eventIdSchema = z.object({
  id: z.string().min(1, "Event ID is required"),
});

// Combined schema for update event (params + body)
export const updateEventWithIdSchema = z.object({
  params: eventIdSchema,
  body: updateEventSchema,
});

