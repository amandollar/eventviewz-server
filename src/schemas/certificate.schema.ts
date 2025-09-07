import { z } from "zod";

// Template certificate generation schema
export const templateCertificateSchema = z.object({
  body: z.object({
    templateId: z.string().optional(),
    includeQRCode: z.boolean().optional(),
    customText: z.object({
      title: z.string().optional(),
      greeting: z.string().optional(),
      completionText: z.string().optional()
    }).optional(),
    fontSize: z.enum(['small', 'medium', 'large']).optional(),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid text color format. Use hex format (e.g., #2c3e50)").optional(),
    qrCodeColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid QR code color format. Use hex format (e.g., #000000)").optional()
  })
});

// Student template certificate schema (simplified)
export const studentTemplateCertificateSchema = z.object({
  body: z.object({
    templateId: z.string().optional()
  })
});

// Mark attendance schema
export const markAttendanceSchema = z.object({
  params: z.object({
    registrationId: z.string().min(1, "Registration ID is required")
  })
});

// Bulk attendance schema
export const bulkAttendanceSchema = z.object({
  body: z.object({
    registrationIds: z.array(z.string().min(1, "Registration ID is required")).min(1, "At least one registration ID is required")
  })
});

// Get event registrations schema
export const getEventRegistrationsSchema = z.object({
  params: z.object({
    eventId: z.string().min(1, "Event ID is required")
  }),
  query: z.object({
    status: z.string().optional(),
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional()
  }).optional()
});

// Get event stats schema
export const getEventStatsSchema = z.object({
  params: z.object({
    eventId: z.string().min(1, "Event ID is required")
  })
});

// Get certificate data schema
export const getCertificateDataSchema = z.object({
  params: z.object({
    registrationId: z.string().min(1, "Registration ID is required")
  })
});

