"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationQuerySchema = exports.eventIdSchema = exports.registrationIdSchema = exports.updateRegistrationStatusSchema = exports.updateRegistrationSchema = exports.registerForEventSchema = void 0;
// src/schemas/registration.schema.ts
const zod_1 = require("zod");
// Enhanced register for event schema with comprehensive user data
exports.registerForEventSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(1, "Event ID is required"),
    ticketType: zod_1.z.string().min(1, "Ticket type is required"),
    // Personal Information
    registrationNumber: zod_1.z.string().min(1, "Registration number is required"),
    phoneNumber: zod_1.z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number too long"),
    college: zod_1.z.string().min(2, "College/University name is required"),
    department: zod_1.z.string().min(2, "Department/Branch is required"),
    yearOfStudy: zod_1.z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduate", "Other"]),
    // Event-specific preferences
    dietaryPreferences: zod_1.z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"]).optional(),
    specialRequirements: zod_1.z.string().max(200, "Special requirements too long").optional(),
    emergencyContact: zod_1.z.object({
        name: zod_1.z.string().min(1, "Emergency contact name is required"),
        phone: zod_1.z.string().min(10, "Emergency contact phone is required"),
        relationship: zod_1.z.string().min(1, "Relationship is required")
    }).optional(),
    tshirtSize: zod_1.z.enum(["XS", "S", "M", "L", "XL", "XXL", "No T-shirt"]).optional(),
    // Additional notes
    notes: zod_1.z.string().max(300, "Notes too long").optional()
});
// Update registration schema
exports.updateRegistrationSchema = zod_1.z.object({
    ticketType: zod_1.z.string().min(1, "Ticket type is required").optional(),
    phoneNumber: zod_1.z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number too long").optional(),
    college: zod_1.z.string().min(2, "College/University name is required").optional(),
    department: zod_1.z.string().min(2, "Department/Branch is required").optional(),
    yearOfStudy: zod_1.z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduate", "Other"]).optional(),
    dietaryPreferences: zod_1.z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"]).optional(),
    specialRequirements: zod_1.z.string().max(200, "Special requirements too long").optional(),
    emergencyContact: zod_1.z.object({
        name: zod_1.z.string().min(1, "Emergency contact name is required"),
        phone: zod_1.z.string().min(10, "Emergency contact phone is required"),
        relationship: zod_1.z.string().min(1, "Relationship is required")
    }).optional(),
    tshirtSize: zod_1.z.enum(["XS", "S", "M", "L", "XL", "XXL", "No T-shirt"]).optional(),
    notes: zod_1.z.string().max(300, "Notes too long").optional()
});
// Update registration status schema
exports.updateRegistrationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["registered", "attended", "cancelled"])
});
// Registration ID param schema
exports.registrationIdSchema = zod_1.z.object({
    registrationId: zod_1.z.string().min(1, "Registration ID is required")
});
// Event ID param schema
exports.eventIdSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(1, "Event ID is required")
});
// Query parameters for registrations
exports.registrationQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(["registered", "attended", "cancelled"]).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10)
});
//# sourceMappingURL=registration.schema.js.map