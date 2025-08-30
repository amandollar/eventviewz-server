
import { z } from "zod";

// Ticket schema
export const ticketSchema = z.object({
  type: z.string().min(1, "Ticket type is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  available: z.coerce.number().min(0, "Available tickets must be 0 or more").default(100),
});

// File upload schema for multer
export const fileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  destination: z.string(),
  filename: z.string(),
  path: z.string()
}).optional();

// Event creation schema
export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
    description: z.string().optional(),
    date: z.coerce.date(), // accepts string/date
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format (24-hour)"),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format (24-hour)"),
    venue: z.string().min(2, "Venue must be at least 2 characters").max(200, "Venue too long"),
    location: z.string().optional(),
    category: z.enum([
      "hackathon",
      "workshop", 
      "seminar",
      "cultural"
    ]), // Fixed: matches EventCategory enum
    participants: z.array(z.string()).optional(),
    maxParticipants: z.coerce.number().min(1).max(10000).optional(),
    isActive: z.coerce.boolean().optional().default(true),
    tickets: z.array(ticketSchema).optional(),
  }),
  file: fileSchema // Image is now mandatory (removed .optional())
}).refine((data) => {
  // Ensure end time is after start time
  const start = data.body.startTime;
  const end = data.body.endTime;
  return start < end;
}, {
  message: "End time must be after start time",
  path: ["body", "endTime"]
});

// Event update schema (partial fields allowed)
export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long").optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format (24-hour)").optional(),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format (24-hour)").optional(),
    venue: z.string().min(2, "Venue must be at least 2 characters").max(200, "Venue too long").optional(),
    location: z.string().optional(),
    category: z.enum([
      "hackathon",
      "workshop",
      "seminar", 
      "cultural"
    ]).optional(), // Fixed: matches EventCategory enum
    maxParticipants: z.coerce.number().min(1).max(10000).optional(),
    isActive: z.coerce.boolean().optional(),
    tickets: z.array(ticketSchema).optional(),
  }),
  file: fileSchema
}).refine(
  (data) => Object.keys(data.body).length > 0,
  { message: "At least one field must be provided for update" }
).refine((data) => {
  // Ensure end time is after start time if both are provided
  if (data.body.startTime && data.body.endTime) {
    return data.body.startTime < data.body.endTime;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["body", "endTime"]
});

// Event ID param schema
export const eventIdSchema = z.object({
  id: z.string().min(1, "Event ID is required"),
});

// Combined schema for update event (params + body)
export const updateEventWithIdSchema = z.object({
  params: eventIdSchema,
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long").optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format (24-hour)").optional(),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format (24-hour)").optional(),
    venue: z.string().min(2, "Venue must be at least 2 characters").max(200, "Venue too long").optional(),
    location: z.string().optional(),
    category: z.enum([
      "hackathon",
      "workshop",
      "seminar",
      "cultural"
    ]).optional(), // Fixed: matches EventCategory enum
    maxParticipants: z.coerce.number().min(1).max(10000).optional(),
    isActive: z.coerce.boolean().optional(),
    tickets: z.array(ticketSchema).optional(),
  }),
  file: fileSchema
});

