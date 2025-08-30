// src/schemas/registration.schema.ts
import { z } from "zod";

// Enhanced register for event schema with comprehensive user data
export const registerForEventSchema = z.object({
    eventId: z.string().min(1, "Event ID is required"),
    ticketType: z.string().min(1, "Ticket type is required"),
    // Personal Information
    registrationNumber: z.string().min(1, "Registration number is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number too long"),
    college: z.string().min(2, "College/University name is required"),
    department: z.string().min(2, "Department/Branch is required"),
    yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduate", "Other"]),
    // Event-specific preferences
    dietaryPreferences: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"]).optional(),
    specialRequirements: z.string().max(200, "Special requirements too long").optional(),
    emergencyContact: z.object({
        name: z.string().min(1, "Emergency contact name is required"),
        phone: z.string().min(10, "Emergency contact phone is required"),
        relationship: z.string().min(1, "Relationship is required")
    }).optional(),
    tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL", "No T-shirt"]).optional(),
    // Additional notes
    notes: z.string().max(300, "Notes too long").optional()
});

// Update registration schema
export const updateRegistrationSchema = z.object({
    ticketType: z.string().min(1, "Ticket type is required").optional(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number too long").optional(),
    college: z.string().min(2, "College/University name is required").optional(),
    department: z.string().min(2, "Department/Branch is required").optional(),
    yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduate", "Other"]).optional(),
    dietaryPreferences: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"]).optional(),
    specialRequirements: z.string().max(200, "Special requirements too long").optional(),
    emergencyContact: z.object({
        name: z.string().min(1, "Emergency contact name is required").optional(),
        phone: z.string().min(10, "Emergency contact phone is required").optional(),
        relationship: z.string().min(1, "Relationship is required").optional()
    }).optional(),
    tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL", "No T-shirt"]).optional(),
    notes: z.string().max(300, "Notes too long").optional()
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
