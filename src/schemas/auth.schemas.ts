import { z } from "zod";

// Registration schema
export const registerSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be less than 50 characters")
      .trim(),
    email: z.string()
      .email("Invalid email format")
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
  }),
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    size: z.number(),
    destination: z.string(),
    filename: z.string(),
    path: z.string()
  }).optional()
});

// Login schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string()
      .email("Invalid email format")
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(1, "Password is required")
  })
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string()
      .email("Invalid email format")
      .toLowerCase()
      .trim()
  })
});

// Reset password schema
export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Reset token is required")
  }),
  body: z.object({
    password: z.string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
  })
});

// Verify email schema
export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Verification token is required")
  })
});

// Update user schema
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be less than 50 characters")
      .trim()
      .optional(),
    image: z.string().url("Invalid image URL").optional()
  }),
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    size: z.number(),
    destination: z.string(),
    filename: z.string(),
    path: z.string()
  }).optional()
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
  })
});

// Logout schema
export const logoutSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().optional()
  })
});
