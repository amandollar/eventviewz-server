"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.refreshTokenSchema = exports.updateUserSchema = exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Registration schema
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(2, "Name must be at least 2 characters long")
            .max(50, "Name must be less than 50 characters")
            .trim(),
        email: zod_1.z.string()
            .email("Invalid email format")
            .toLowerCase()
            .trim(),
        password: zod_1.z.string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    }),
    file: zod_1.z.object({
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mimetype: zod_1.z.string(),
        size: zod_1.z.number(),
        destination: zod_1.z.string(),
        filename: zod_1.z.string(),
        path: zod_1.z.string()
    }).optional()
});
// Login schema
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string()
            .email("Invalid email format")
            .toLowerCase()
            .trim(),
        password: zod_1.z.string()
            .min(1, "Password is required")
    })
});
// Forgot password schema
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string()
            .email("Invalid email format")
            .toLowerCase()
            .trim()
    })
});
// Reset password schema
exports.resetPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        token: zod_1.z.string().min(1, "Reset token is required")
    }),
    body: zod_1.z.object({
        password: zod_1.z.string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    })
});
// Verify email schema
exports.verifyEmailSchema = zod_1.z.object({
    params: zod_1.z.object({
        token: zod_1.z.string().min(1, "Verification token is required")
    })
});
// Update user schema
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(2, "Name must be at least 2 characters long")
            .max(50, "Name must be less than 50 characters")
            .trim()
            .optional()
    }),
    file: zod_1.z.object({
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mimetype: zod_1.z.string(),
        size: zod_1.z.number(),
        destination: zod_1.z.string(),
        filename: zod_1.z.string(),
        path: zod_1.z.string()
    }).optional()
});
// Refresh token schema
exports.refreshTokenSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, "Refresh token is required")
    })
});
// Logout schema
exports.logoutSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string().optional()
    })
});
//# sourceMappingURL=auth.schemas.js.map