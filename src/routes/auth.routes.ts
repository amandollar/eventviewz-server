import express from "express";
import multer from "multer";
import { 
  redirectToGoogle, 
  googleCallback, 
  refreshToken, 
  logout, 
  getCurrentUser,
  updateUser,
  deleteUser,
  register,
  login
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authLimiter } from "../middlewares/rateLimit.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  updateUserSchema
} from "../schemas/auth.schemas";
import upload from "../middlewares/multer.middleware";

const authRouter = express.Router();

// Normal Authentication Routes (with strict rate limiting and validation)
authRouter.post("/register", authLimiter, upload.single('image'), validateSchema(registerSchema), register);
authRouter.post("/login", authLimiter, validateSchema(loginSchema), login);

// Google OAuth Routes
authRouter.get("/google", authLimiter, redirectToGoogle);
authRouter.get("/google/callback", authLimiter, googleCallback);

// Token Management
authRouter.post("/refresh", authLimiter, refreshToken);
authRouter.post("/logout", logout);

// User Management (protected routes)
authRouter.get("/user", authMiddleware, getCurrentUser);
authRouter.put("/user", authMiddleware, upload.single('image'), validateSchema(updateUserSchema), updateUser);
authRouter.delete("/user", authMiddleware, deleteUser);

export default authRouter;
  