"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationQuerySchema = exports.eventIdSchema = exports.registrationIdSchema = exports.updateRegistrationStatusSchema = exports.registerForEventSchema = void 0;
// src/schemas/registration.schema.ts
const zod_1 = require("zod");
// Register for event schema
exports.registerForEventSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(1, "Event ID is required")
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