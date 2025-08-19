"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const authRouter = express_1.default.Router();
// Apply strict rate limiting to sensitive auth endpoints
// Redirect to Google OAuth2.0
authRouter.get("/google", rateLimit_middleware_1.authLimiter, auth_controller_1.redirectToGoogle);
// Handle the callback from Google OAuth2.0
authRouter.get("/google/callback", rateLimit_middleware_1.authLimiter, auth_controller_1.googleCallback);
// Refresh token endpoint - very strict rate limiting
authRouter.post("/refresh", rateLimit_middleware_1.authLimiter, auth_controller_1.refreshToken);
// Logout endpoint - moderate rate limiting
authRouter.post("/logout", rateLimit_middleware_1.generalLimiter, auth_controller_1.logout);
// Get current user details (protected route) - moderate rate limiting
authRouter.get("/user", rateLimit_middleware_1.generalLimiter, auth_middleware_1.authMiddleware, auth_controller_1.getCurrentUser);
// Update user details (protected route) - moderate rate limiting
authRouter.put("/user", rateLimit_middleware_1.generalLimiter, auth_middleware_1.authMiddleware, auth_controller_1.updateUser);
// Delete user account (protected route) - moderate rate limiting
authRouter.delete("/user", rateLimit_middleware_1.generalLimiter, auth_middleware_1.authMiddleware, auth_controller_1.deleteUser);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map