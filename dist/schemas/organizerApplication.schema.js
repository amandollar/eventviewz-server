"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplicationsWithQuerySchema = exports.rejectApplicationWithIdSchema = exports.approveApplicationWithIdSchema = exports.updateApplicationWithIdSchema = exports.submitApplicationWithIdSchema = exports.applicationQuerySchema = exports.applicationIdSchema = exports.rejectApplicationSchema = exports.approveApplicationSchema = exports.updateApplicationSchema = exports.submitApplicationSchema = void 0;
// src/schemas/organizerApplication.schema.ts
const zod_1 = require("zod");
// Submit application schema
exports.submitApplicationSchema = zod_1.z.object({
    organizationName: zod_1.z.string().min(2, "Organization name must be at least 2 characters").max(100, "Organization name too long"),
    phoneNumber: zod_1.z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number too long"),
    description: zod_1.z.string().max(500, "Description too long").optional(),
});
// Update application schema
exports.updateApplicationSchema = zod_1.z.object({
    organizationName: zod_1.z.string().min(2, "Organization name must be at least 2 characters").max(100, "Organization name too long").optional(),
    phoneNumber: zod_1.z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number too long").optional(),
    description: zod_1.z.string().max(500, "Description too long").optional(),
});
// Approve application schema
exports.approveApplicationSchema = zod_1.z.object({
    adminNotes: zod_1.z.string().max(200, "Admin notes too long").optional(),
});
// Reject application schema
exports.rejectApplicationSchema = zod_1.z.object({
    adminNotes: zod_1.z.string().min(1, "Admin notes are required for rejection").max(200, "Admin notes too long"),
});
// Application ID param schema
exports.applicationIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Application ID is required"),
});
// Query parameters for applications
exports.applicationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    status: zod_1.z.enum(["pending", "approved", "rejected"]).optional(),
});
// Combined schemas for routes
exports.submitApplicationWithIdSchema = zod_1.z.object({
    body: exports.submitApplicationSchema,
});
exports.updateApplicationWithIdSchema = zod_1.z.object({
    body: exports.updateApplicationSchema,
});
exports.approveApplicationWithIdSchema = zod_1.z.object({
    params: exports.applicationIdSchema,
    body: exports.approveApplicationSchema,
});
exports.rejectApplicationWithIdSchema = zod_1.z.object({
    params: exports.applicationIdSchema,
    body: exports.rejectApplicationSchema,
});
exports.getAllApplicationsWithQuerySchema = zod_1.z.object({
    query: exports.applicationQuerySchema,
});
//# sourceMappingURL=organizerApplication.schema.js.map