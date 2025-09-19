import express from "express";
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
import { validateSchema } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  updateUserSchema
} from "../schemas/auth.schemas";
import upload from "../middlewares/multer.middleware";

const authRouter = express.Router();

// Normal Authentication Routes (with strict rate limiting and validation)
authRouter.post("/register", upload.single('image'), validateSchema(registerSchema), register);
authRouter.post("/login", validateSchema(loginSchema), login);

// Google OAuth Routes
authRouter.get("/google", redirectToGoogle);
authRouter.get("/google/callback", googleCallback);

// Token Management
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", logout);

// User Management (protected routes)
authRouter.get("/user", authMiddleware, getCurrentUser);
authRouter.put("/user", authMiddleware, upload.single('image'), validateSchema(updateUserSchema), updateUser);
authRouter.delete("/user", authMiddleware, deleteUser);

export default authRouter;
  