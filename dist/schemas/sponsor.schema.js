"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sponsorIdSchema = exports.updateSponsorSchema = exports.createSponsorSchema = void 0;
// src/schemas/sponsor.schema.ts
const zod_1 = require("zod");
// Create sponsor schema
exports.createSponsorSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters").max(500, "Description too long"),
    publisher: zod_1.z.string().min(2, "Publisher must be at least 2 characters").max(100, "Publisher too long"),
    images: zod_1.z.array(zod_1.z.string().url("Invalid image URL")).min(1, "At least one image is required"),
    expiresAt: zod_1.z.coerce.date().optional(),
});
// Update sponsor schema
exports.updateSponsorSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100).optional(),
    description: zod_1.z.string().min(10).max(500).optional(),
    publisher: zod_1.z.string().min(2).max(100).optional(),
    images: zod_1.z.array(zod_1.z.string().url()).min(1).optional(),
    isActive: zod_1.z.boolean().optional(),
    expiresAt: zod_1.z.coerce.date().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "Provide at least one field" });
// Sponsor ID param schema
exports.sponsorIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Sponsor ID is required")
});
//# sourceMappingURL=sponsor.schema.js.map