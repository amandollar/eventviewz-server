"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const organizerApplication_controller_1 = require("../controllers/organizerApplication.controller");
const multer_middleware_1 = __importDefault(require("../middlewares/multer.middleware"));
const organizerApplication_schema_1 = require("../schemas/organizerApplication.schema");
const organizerApplicationRouter = express_1.default.Router();
// All routes require authentication
organizerApplicationRouter.use(auth_middleware_1.authMiddleware);
// User routes (for students to apply)
organizerApplicationRouter.post("/", multer_middleware_1.default.single("organizationImage"), (0, validate_middleware_1.validateSchema)(organizerApplication_schema_1.submitApplicationSchema), organizerApplication_controller_1.submitApplication);
organizerApplicationRouter.get("/my-application", organizerApplication_controller_1.getMyApplication);
organizerApplicationRouter.put("/", multer_middleware_1.default.single("organizationImage"), (0, validate_middleware_1.validateSchema)(organizerApplication_schema_1.updateApplicationSchema), organizerApplication_controller_1.updateApplication);
// Admin routes (for reviewing applications)
organizerApplicationRouter.get("/", (0, role_middleware_1.authorizeRoles)("admin"), (0, validate_middleware_1.validateSchema)(organizerApplication_schema_1.getAllApplicationsWithQuerySchema), organizerApplication_controller_1.getAllApplications);
organizerApplicationRouter.get("/stats", (0, role_middleware_1.authorizeRoles)("admin"), organizerApplication_controller_1.getApplicationStats);
organizerApplicationRouter.get("/:id", (0, role_middleware_1.authorizeRoles)("admin"), organizerApplication_controller_1.getApplicationById);
organizerApplicationRouter.post("/:id/approve", (0, role_middleware_1.authorizeRoles)("admin"), (0, validate_middleware_1.validateSchema)(organizerApplication_schema_1.approveApplicationWithIdSchema), organizerApplication_controller_1.approveApplication);
organizerApplicationRouter.post("/:id/reject", (0, role_middleware_1.authorizeRoles)("admin"), (0, validate_middleware_1.validateSchema)(organizerApplication_schema_1.rejectApplicationWithIdSchema), organizerApplication_controller_1.rejectApplication);
exports.default = organizerApplicationRouter;
//# sourceMappingURL=organizerApplication.routes.js.map