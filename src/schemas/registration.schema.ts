// src/schemas/registration.schema.ts
import { z } from "zod";

// Enhanced register for event schema with comprehensive user data
export const registerForEventSchema = z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be less than 50 characters")
      .trim(),
    eventId: z.string().min(1, "Event ID is required"),
    ticketType: z.string().min(1, "Ticket type is required"),
    // Personal Information
    registrationNumber: z.string().min(1, "Registration number is required"),
    phoneNumber: z.string()
      .trim()
      .regex(/^\d{10}$/,
        "Phone number must be exactly 10 digits"),
    college: z.string().min(2, "College/University name is required"),
    department: z.string().min(2, "Department/Branch is required"),
    yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduate", "Other"]),
    // Optional team registration fields (used mainly for hackathons)
    teamType: z.enum(["individual", "team"]).optional(),
    teamSize: z.coerce.number().int().min(1).max(4).optional(),
    teamName: z.string().max(50, "Team name must be less than 50 characters").optional(),
    teamMembers: z.array(z.object({
      name: z.string().min(2, "Member name must be at least 2 characters long").max(50).trim(),
      registrationNumber: z.string().min(1, "Registration number is required for all team members"),
      phoneNumber: z.string().trim().regex(/^\d{10}$/,
        "Phone number must be exactly 10 digits"),
      department: z.string().min(2, "Department/Branch is required for each member"),
      yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduate", "Other"]),
    })).max(3).optional(),
}).superRefine((data, ctx) => {
    if (data.teamType === "team") {
        const trimmedName = data.teamName?.trim() ?? "";
        if (trimmedName.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["teamName"],
                message: "Team name must be at least 2 characters long",
            });
        }
    }
});

// Update registration schema
export const updateRegistrationSchema = z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be less than 50 characters")
      .trim()
      .optional(),
    eventId: z.string().min(1, "Event ID is required"),
    ticketType: z.string().min(1, "Ticket type is required").optional(),
    phoneNumber: z.string()
      .trim()
      .regex(/^\d{10}$/,
        "Phone number must be exactly 10 digits")
      .optional(),
    college: z.string().min(2, "College/University name is required").optional(),
    department: z.string().min(2, "Department/Branch is required").optional(),
    yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduate", "Other"]).optional(),
    teamName: z.string().min(2, "Team name must be at least 2 characters long").max(50, "Team name must be less than 50 characters").optional(),
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
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>;
export type UpdateRegistrationStatusInput = z.infer<typeof updateRegistrationStatusSchema>;
export type RegistrationIdInput = z.infer<typeof registrationIdSchema>;
export type EventIdInput = z.infer<typeof eventIdSchema>;
export type RegistrationQueryInput = z.infer<typeof registrationQuerySchema>;
