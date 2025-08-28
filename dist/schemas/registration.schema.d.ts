import { z } from "zod";
export declare const registerForEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    ticketType: z.ZodString;
    registrationNumber: z.ZodString;
    phoneNumber: z.ZodString;
    college: z.ZodString;
    department: z.ZodString;
    yearOfStudy: z.ZodEnum<{
        "1st Year": "1st Year";
        "2nd Year": "2nd Year";
        "3rd Year": "3rd Year";
        "4th Year": "4th Year";
        "Final Year": "Final Year";
        Graduate: "Graduate";
        Other: "Other";
    }>;
    dietaryPreferences: z.ZodOptional<z.ZodEnum<{
        Vegetarian: "Vegetarian";
        "Non-Vegetarian": "Non-Vegetarian";
        Vegan: "Vegan";
        "No Preference": "No Preference";
    }>>;
    specialRequirements: z.ZodOptional<z.ZodString>;
    emergencyContact: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        relationship: z.ZodString;
    }, z.core.$strip>>;
    tshirtSize: z.ZodOptional<z.ZodEnum<{
        M: "M";
        S: "S";
        XS: "XS";
        L: "L";
        XL: "XL";
        XXL: "XXL";
        "No T-shirt": "No T-shirt";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateRegistrationSchema: z.ZodObject<{
    ticketType: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    college: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    yearOfStudy: z.ZodOptional<z.ZodEnum<{
        "1st Year": "1st Year";
        "2nd Year": "2nd Year";
        "3rd Year": "3rd Year";
        "4th Year": "4th Year";
        "Final Year": "Final Year";
        Graduate: "Graduate";
        Other: "Other";
    }>>;
    dietaryPreferences: z.ZodOptional<z.ZodEnum<{
        Vegetarian: "Vegetarian";
        "Non-Vegetarian": "Non-Vegetarian";
        Vegan: "Vegan";
        "No Preference": "No Preference";
    }>>;
    specialRequirements: z.ZodOptional<z.ZodString>;
    emergencyContact: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        relationship: z.ZodString;
    }, z.core.$strip>>;
    tshirtSize: z.ZodOptional<z.ZodEnum<{
        M: "M";
        S: "S";
        XS: "XS";
        L: "L";
        XL: "XL";
        XXL: "XXL";
        "No T-shirt": "No T-shirt";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
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
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>;
export type UpdateRegistrationStatusInput = z.infer<typeof updateRegistrationStatusSchema>;
export type RegistrationIdInput = z.infer<typeof registrationIdSchema>;
export type EventIdInput = z.infer<typeof eventIdSchema>;
export type RegistrationQueryInput = z.infer<typeof registrationQuerySchema>;
