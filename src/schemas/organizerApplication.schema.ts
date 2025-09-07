// src/schemas/organizerApplication.schema.ts
import { z } from "zod";

export const fileSchema = z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    size: z.number(),
    destination: z.string(),
    filename: z.string(),
    path: z.string(),
  })
  .optional();


// Submit application schema
export const submitApplicationSchema = z.object({
  body: z.object({
    organizationName: z
      .string()
      .min(2, "Organization name must be at least 2 characters")
      .max(100, "Organization name too long"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number too long"),
    description: z.string().max(500, "Description too long").optional(),
  }),
  file: fileSchema, // Image is now mandatory (removed .optional())
});

// Update application schema
export const updateApplicationSchema = z.object({
  body: z.object({
    organizationName: z
      .string()
      .min(2, "Organization name must be at least 2 characters")
      .max(100, "Organization name too long")
      .optional(),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number too long")
      .optional(),
    description: z.string().max(500, "Description too long").optional(),
  }),
  file: fileSchema, // Image is now optional for updates
});

// Approve application schema
export const approveApplicationSchema = z.object({
  adminNotes: z.string().max(200, "Admin notes too long").optional(),
});

// Reject application schema
export const rejectApplicationSchema = z.object({
  adminNotes: z
    .string()
    .min(1, "Admin notes are required for rejection")
    .max(200, "Admin notes too long"),
});

// Application ID param schema
export const applicationIdSchema = z.object({
  id: z.string().min(1, "Application ID is required"),
});

// Query parameters for applications
export const applicationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

// Combined schemas for routes
export const submitApplicationWithIdSchema = z.object({
  body: submitApplicationSchema,
});

export const updateApplicationWithIdSchema = z.object({
  body: updateApplicationSchema,
});

export const approveApplicationWithIdSchema = z.object({
  params: applicationIdSchema,
  body: approveApplicationSchema,
});

export const rejectApplicationWithIdSchema = z.object({
  params: applicationIdSchema,
  body: rejectApplicationSchema,
});

export const getAllApplicationsWithQuerySchema = z.object({
  query: applicationQuerySchema,
});

// Export types
export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ApproveApplicationInput = z.infer<typeof approveApplicationSchema>;
export type RejectApplicationInput = z.infer<typeof rejectApplicationSchema>;
export type ApplicationIdInput = z.infer<typeof applicationIdSchema>;
export type ApplicationQueryInput = z.infer<typeof applicationQuerySchema>;
