"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventWithIdSchema = exports.eventIdSchema = exports.updateEventSchema = exports.createEventSchema = exports.ticketSchema = void 0;
// src/validators/event.schema.ts
const zod_1 = require("zod");
// Ticket schema
exports.ticketSchema = zod_1.z.object({
    type: zod_1.z.string().min(1, "Ticket type is required"),
    price: zod_1.z.number().min(0, "Price must be at least 0"),
    available: zod_1.z.number().min(0, "Available tickets must be 0 or more").default(100),
});
// Event creation schema
exports.createEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().url("Invalid image URL"),
    date: zod_1.z.coerce.date(), // accepts string/date
    startTime: zod_1.z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format (24-hour)"),
    endTime: zod_1.z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format (24-hour)"),
    venue: zod_1.z.string().min(2, "Venue must be at least 2 characters").max(200, "Venue too long"),
    location: zod_1.z.string().optional(),
    category: zod_1.z.enum([
        "TECH",
        "CULTURAL",
        "SPORTS",
        "WORKSHOP",
        "SEMINAR",
        "OTHER",
    ]),
    createdBy: zod_1.z.string().min(1, "CreatedBy (user id) is required"),
    participants: zod_1.z.array(zod_1.z.string()).optional(),
    maxParticipants: zod_1.z.number().min(1).max(10000).optional(),
    isActive: zod_1.z.boolean().optional().default(true),
    tickets: zod_1.z.array(exports.ticketSchema).optional(),
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
exports.updateEventSchema = exports.createEventSchema.partial().refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided for update" });
// Event ID param schema
exports.eventIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Event ID is required"),
});
// Combined schema for update event (params + body)
exports.updateEventWithIdSchema = zod_1.z.object({
    params: exports.eventIdSchema,
    body: exports.updateEventSchema,
});
//# sourceMappingURL=event.schema.js.map