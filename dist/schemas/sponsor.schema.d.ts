import { z } from "zod";
export declare const createSponsorSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    publisher: z.ZodString;
    link: z.ZodOptional<z.ZodString>;
    contact: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare const updateSponsorSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    publisher: z.ZodOptional<z.ZodString>;
    link: z.ZodOptional<z.ZodString>;
    contact: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    expiresAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare const sponsorIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type CreateSponsorInput = z.infer<typeof createSponsorSchema>;
export type UpdateSponsorInput = z.infer<typeof updateSponsorSchema>;
export type SponsorIdInput = z.infer<typeof sponsorIdSchema>;
