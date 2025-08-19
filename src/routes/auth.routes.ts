import express from "express";
import { redirectToGoogle, googleCallback, refreshToken, logout, getCurrentUser,updateUser,deleteUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRouter = express.Router();

// Redirect to Google OAuth2.0
authRouter.get("/google", redirectToGoogle);

// Handle the callback from Google OAuth2.0
authRouter.get("/google/callback", googleCallback);

// Refresh token endpoint
authRouter.post("/refresh", refreshToken);

// Logout endpoint
authRouter.post("/logout", logout);

// Get current user details (protected route)
authRouter.get("/user", authMiddleware, getCurrentUser);

// Update user details (protected route)
authRouter.put("/user", authMiddleware, updateUser);

// Delete user account (protected route)
authRouter.delete("/user", authMiddleware, deleteUser); 

export default authRouter;
  