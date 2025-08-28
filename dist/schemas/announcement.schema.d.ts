import { z } from "zod";
export declare const createAnnouncementSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    type: z.ZodEnum<{
        holiday: "holiday";
        "duty-leave": "duty-leave";
        exclusive: "exclusive";
    }>;
}, z.core.$strip>;
export declare const updateAnnouncementSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        holiday: "holiday";
        "duty-leave": "duty-leave";
        exclusive: "exclusive";
    }>>;
}, z.core.$strip>;
