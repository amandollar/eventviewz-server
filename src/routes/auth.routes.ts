import express from "express";
import { redirectToGoogle, googleCallback, refreshToken, logout, getCurrentUser,updateUser,deleteUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authLimiter, generalLimiter } from "../middlewares/rateLimit.middleware";

const authRouter = express.Router();

// Apply strict rate limiting to sensitive auth endpoints
// Redirect to Google OAuth2.0
authRouter.get("/google", authLimiter, redirectToGoogle);

// Handle the callback from Google OAuth2.0
authRouter.get("/google/callback", authLimiter, googleCallback);

// Refresh token endpoint - very strict rate limiting
authRouter.post("/refresh", authLimiter, refreshToken);

// Logout endpoint - moderate rate limiting
authRouter.post("/logout", generalLimiter, logout);

// Get current user details (protected route) - moderate rate limiting
authRouter.get("/user", generalLimiter, authMiddleware, getCurrentUser);

// Update user details (protected route) - moderate rate limiting
authRouter.put("/user", generalLimiter, authMiddleware, updateUser);

// Delete user account (protected route) - moderate rate limiting
authRouter.delete("/user", generalLimiter, authMiddleware, deleteUser); 

export default authRouter;
  