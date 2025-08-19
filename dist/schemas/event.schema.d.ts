import { z } from "zod";
export declare const ticketSchema: z.ZodObject<{
    type: z.ZodString;
    price: z.ZodNumber;
    available: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const createEventSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodString;
    date: z.ZodCoercedDate<unknown>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    venue: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<{
        WORKSHOP: "WORKSHOP";
        SEMINAR: "SEMINAR";
        CULTURAL: "CULTURAL";
        TECH: "TECH";
        SPORTS: "SPORTS";
        OTHER: "OTHER";
    }>;
    createdBy: z.ZodString;
    participants: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxParticipants: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    tickets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        price: z.ZodNumber;
        available: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateEventSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    image: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    venue: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodEnum<{
        WORKSHOP: "WORKSHOP";
        SEMINAR: "SEMINAR";
        CULTURAL: "CULTURAL";
        TECH: "TECH";
        SPORTS: "SPORTS";
        OTHER: "OTHER";
    }>>;
    createdBy: z.ZodOptional<z.ZodString>;
    participants: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    maxParticipants: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    tickets: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        price: z.ZodNumber;
        available: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export declare const eventIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const updateEventWithIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        image: z.ZodOptional<z.ZodString>;
        date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        startTime: z.ZodOptional<z.ZodString>;
        endTime: z.ZodOptional<z.ZodString>;
        venue: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        category: z.ZodOptional<z.ZodEnum<{
            WORKSHOP: "WORKSHOP";
            SEMINAR: "SEMINAR";
            CULTURAL: "CULTURAL";
            TECH: "TECH";
            SPORTS: "SPORTS";
            OTHER: "OTHER";
        }>>;
        createdBy: z.ZodOptional<z.ZodString>;
        participants: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        maxParticipants: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
        tickets: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            price: z.ZodNumber;
            available: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
