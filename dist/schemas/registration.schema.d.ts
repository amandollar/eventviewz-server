import { z } from "zod";
export declare const registerForEventSchema: z.ZodObject<{
    eventId: z.ZodString;
}, z.core.$strip>;
export declare const updateRegistrationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        cancelled: "cancelled";
        registered: "registered";
        attended: "attended";
    }>;
}, z.core.$strip>;
export declare const registrationIdSchema: z.ZodObject<{
    registrationId: z.ZodString;
}, z.core.$strip>;
export declare const eventIdSchema: z.ZodObject<{
    eventId: z.ZodString;
}, z.core.$strip>;
export declare const registrationQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        cancelled: "cancelled";
        registered: "registered";
        attended: "attended";
    }>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type RegisterForEventInput = z.infer<typeof registerForEventSchema>;
export type UpdateRegistrationStatusInput = z.infer<typeof updateRegistrationStatusSchema>;
export type RegistrationIdInput = z.infer<typeof registrationIdSchema>;
export type EventIdInput = z.infer<typeof eventIdSchema>;
export type RegistrationQueryInput = z.infer<typeof registrationQuerySchema>;
