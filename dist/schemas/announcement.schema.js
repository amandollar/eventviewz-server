"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnnouncementSchema = exports.createAnnouncementSchema = void 0;
// src/schemas/announcement.schema.ts
const zod_1 = require("zod");
// Minimal create schema
exports.createAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    content: zod_1.z.string().min(10).max(2000),
    type: zod_1.z.enum(["holiday", "duty-leave", "exclusive"]),
});
// Minimal update schema (any of the above, at least one)
exports.updateAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200).optional(),
    content: zod_1.z.string().min(10).max(2000).optional(),
    type: zod_1.z.enum(["holiday", "duty-leave", "exclusive"]).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "Provide at least one field" });
//# sourceMappingURL=announcement.schema.js.map