"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authRouter = express_1.default.Router();
// Redirect to Google OAuth2.0
authRouter.get("/google", auth_controller_1.redirectToGoogle);
// Handle the callback from Google OAuth2.0
authRouter.get("/google/callback", auth_controller_1.googleCallback);
// Refresh token endpoint
authRouter.post("/refresh", auth_controller_1.refreshToken);
// Logout endpoint
authRouter.post("/logout", auth_controller_1.logout);
// Get current user details (protected route)
authRouter.get("/user", auth_middleware_1.authMiddleware, auth_controller_1.getCurrentUser);
// Update user details (protected route)
authRouter.put("/user", auth_middleware_1.authMiddleware, auth_controller_1.updateUser);
// Delete user account (protected route)
authRouter.delete("/user", auth_middleware_1.authMiddleware, auth_controller_1.deleteUser);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map