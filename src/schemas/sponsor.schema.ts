// src/schemas/sponsor.schema.ts
import { z } from "zod";

// Create sponsor schema
export const createSponsorSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description too long"),
  publisher: z.string().min(2, "Publisher must be at least 2 characters").max(100, "Publisher too long"),
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
  link: z.string().url("Invalid link URL").optional(),
  contact: z.string().min(5, "Contact must be at least 5 characters").max(200, "Contact too long").optional(),
  expiresAt: z.coerce.date().optional(),
});

// Update sponsor schema
export const updateSponsorSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  publisher: z.string().min(2).max(100).optional(),
  images: z.array(z.string().url()).min(1).optional(),
  link: z.string().url("Invalid link URL").optional(),
  contact: z.string().min(5).max(200).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.coerce.date().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "Provide at least one field" });

// Sponsor ID param schema
export const sponsorIdSchema = z.object({
  id: z.string().min(1, "Sponsor ID is required")
});

// Export types
export type CreateSponsorInput = z.infer<typeof createSponsorSchema>;
export type UpdateSponsorInput = z.infer<typeof updateSponsorSchema>;
export type SponsorIdInput = z.infer<typeof sponsorIdSchema>;
