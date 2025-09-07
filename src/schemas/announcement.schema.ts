// src/schemas/announcement.schema.ts
import { z } from "zod";

// Minimal create schema
export const createAnnouncementSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(2000),
  type: z.enum(["holiday", "duty-leave", "exclusive", "academic", "upcoming-event", "placement"]),
});

// Minimal update schema (any of the above, at least one)
export const updateAnnouncementSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).max(2000).optional(),
  type: z.enum(["holiday", "duty-leave", "exclusive"]).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "Provide at least one field" });

