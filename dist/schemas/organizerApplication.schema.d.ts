import { z } from "zod";
export declare const submitApplicationSchema: z.ZodObject<{
    organizationName: z.ZodString;
    phoneNumber: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateApplicationSchema: z.ZodObject<{
    organizationName: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const approveApplicationSchema: z.ZodObject<{
    adminNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const rejectApplicationSchema: z.ZodObject<{
    adminNotes: z.ZodString;
}, z.core.$strip>;
export declare const applicationIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const applicationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
    }>>;
}, z.core.$strip>;
export declare const submitApplicationWithIdSchema: z.ZodObject<{
    body: z.ZodObject<{
        organizationName: z.ZodString;
        phoneNumber: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateApplicationWithIdSchema: z.ZodObject<{
    body: z.ZodObject<{
        organizationName: z.ZodOptional<z.ZodString>;
        phoneNumber: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const approveApplicationWithIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        adminNotes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const rejectApplicationWithIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        adminNotes: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getAllApplicationsWithQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            approved: "approved";
            rejected: "rejected";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ApproveApplicationInput = z.infer<typeof approveApplicationSchema>;
export type RejectApplicationInput = z.infer<typeof rejectApplicationSchema>;
export type ApplicationIdInput = z.infer<typeof applicationIdSchema>;
export type ApplicationQueryInput = z.infer<typeof applicationQuerySchema>;
