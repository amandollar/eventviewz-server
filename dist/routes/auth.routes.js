"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_schemas_1 = require("../schemas/auth.schemas");
const multer_middleware_1 = __importDefault(require("../middlewares/multer.middleware"));
const authRouter = express_1.default.Router();
// Normal Authentication Routes (with strict rate limiting and validation)
authRouter.post("/register", rateLimit_middleware_1.authLimiter, multer_middleware_1.default.single('image'), (0, validate_middleware_1.validateSchema)(auth_schemas_1.registerSchema), auth_controller_1.register);
authRouter.post("/login", rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validateSchema)(auth_schemas_1.loginSchema), auth_controller_1.login);
// Google OAuth Routes
authRouter.get("/google", rateLimit_middleware_1.authLimiter, auth_controller_1.redirectToGoogle);
authRouter.get("/google/callback", rateLimit_middleware_1.authLimiter, auth_controller_1.googleCallback);
// Token Management
authRouter.post("/refresh", rateLimit_middleware_1.authLimiter, auth_controller_1.refreshToken);
authRouter.post("/logout", auth_controller_1.logout);
// User Management (protected routes)
authRouter.get("/user", auth_middleware_1.authMiddleware, auth_controller_1.getCurrentUser);
authRouter.put("/user", auth_middleware_1.authMiddleware, multer_middleware_1.default.single('image'), (0, validate_middleware_1.validateSchema)(auth_schemas_1.updateUserSchema), auth_controller_1.updateUser);
authRouter.delete("/user", auth_middleware_1.authMiddleware, auth_controller_1.deleteUser);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map