// src/schemas/registration.schema.ts
import { z } from "zod";

// Register for event schema
export const registerForEventSchema = z.object({
    eventId: z.string().min(1, "Event ID is required")
});

// Update registration status schema
export const updateRegistrationStatusSchema = z.object({
    status: z.enum(["registered", "attended", "cancelled"])
});

// Registration ID param schema
export const registrationIdSchema = z.object({
    registrationId: z.string().min(1, "Registration ID is required")
});

// Event ID param schema
export const eventIdSchema = z.object({
    eventId: z.string().min(1, "Event ID is required")
});

// Query parameters for registrations
export const registrationQuerySchema = z.object({
    status: z.enum(["registered", "attended", "cancelled"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
});

// Export types
export type RegisterForEventInput = z.infer<typeof registerForEventSchema>;
export type UpdateRegistrationStatusInput = z.infer<typeof updateRegistrationStatusSchema>;
export type RegistrationIdInput = z.infer<typeof registrationIdSchema>;
export type EventIdInput = z.infer<typeof eventIdSchema>;
export type RegistrationQueryInput = z.infer<typeof registrationQuerySchema>;
