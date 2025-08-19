"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const organizerApplication_controller_1 = require("../controllers/organizerApplication.controller");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const mutlter_middleware_1 = __importDefault(require("../middlewares/mutlter.middleware"));
const organizerApplicationRouter = express_1.default.Router();
// All routes require authentication
organizerApplicationRouter.use(auth_middleware_1.authMiddleware);
// User routes (for students to apply)
organizerApplicationRouter.post("/", rateLimit_middleware_1.generalLimiter, mutlter_middleware_1.default.single("organizationImage"), organizerApplication_controller_1.submitApplication);
organizerApplicationRouter.get("/my-application", rateLimit_middleware_1.generalLimiter, organizerApplication_controller_1.getMyApplication);
organizerApplicationRouter.put("/", rateLimit_middleware_1.generalLimiter, mutlter_middleware_1.default.single("organizationImage"), organizerApplication_controller_1.updateApplication);
// Admin routes (for reviewing applications)
organizerApplicationRouter.get("/", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin"), organizerApplication_controller_1.getAllApplications);
organizerApplicationRouter.get("/stats", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin"), organizerApplication_controller_1.getApplicationStats);
organizerApplicationRouter.get("/:id", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin"), organizerApplication_controller_1.getApplicationById);
organizerApplicationRouter.post("/:id/approve", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin"), organizerApplication_controller_1.approveApplication);
organizerApplicationRouter.post("/:id/reject", rateLimit_middleware_1.generalLimiter, (0, role_middleware_1.authorizeRoles)("admin"), organizerApplication_controller_1.rejectApplication);
exports.default = organizerApplicationRouter;
//# sourceMappingURL=organizerApplication.routes.js.map