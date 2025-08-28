import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
    file: z.ZodOptional<z.ZodObject<{
        fieldname: z.ZodString;
        originalname: z.ZodString;
        encoding: z.ZodString;
        mimetype: z.ZodString;
        size: z.ZodNumber;
        destination: z.ZodString;
        filename: z.ZodString;
        path: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const forgotPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    params: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const verifyEmailSchema: z.ZodObject<{
    params: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    file: z.ZodOptional<z.ZodObject<{
        fieldname: z.ZodString;
        originalname: z.ZodString;
        encoding: z.ZodString;
        mimetype: z.ZodString;
        size: z.ZodNumber;
        destination: z.ZodString;
        filename: z.ZodString;
        path: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const refreshTokenSchema: z.ZodObject<{
    cookies: z.ZodObject<{
        refreshToken: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const logoutSchema: z.ZodObject<{
    cookies: z.ZodObject<{
        refreshToken: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
