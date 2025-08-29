import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import {
  submitApplication,
  getMyApplication,
  updateApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getApplicationStats
} from "../controllers/organizerApplication.controller";
import { generalLimiter } from "../middlewares/rateLimit.middleware";
import upload from "../middlewares/multer.middleware";
import {
  submitApplicationSchema,
  updateApplicationSchema,
  approveApplicationWithIdSchema,
  rejectApplicationWithIdSchema,
  getAllApplicationsWithQuerySchema
} from "../schemas/organizerApplication.schema";

const organizerApplicationRouter = express.Router();

// All routes require authentication
organizerApplicationRouter.use(authMiddleware);

// User routes (for students to apply)
organizerApplicationRouter.post("/",
  generalLimiter,
  upload.single("organizationImage"),
  validateSchema(submitApplicationSchema),
  submitApplication
);

organizerApplicationRouter.get("/my-application", generalLimiter, getMyApplication);

organizerApplicationRouter.put("/",
  generalLimiter,
  upload.single("organizationImage"),
  validateSchema(updateApplicationSchema),
  updateApplication
);

// Admin routes (for reviewing applications)
organizerApplicationRouter.get("/",
  generalLimiter,
  authorizeRoles("admin"),
  validateSchema(getAllApplicationsWithQuerySchema),
  getAllApplications
);

organizerApplicationRouter.get("/stats", generalLimiter, authorizeRoles("admin"), getApplicationStats);

organizerApplicationRouter.get("/:id", generalLimiter, authorizeRoles("admin"), getApplicationById);

organizerApplicationRouter.post("/:id/approve",
  generalLimiter,
  authorizeRoles("admin"),
  validateSchema(approveApplicationWithIdSchema),
  approveApplication
);

organizerApplicationRouter.post("/:id/reject",
  generalLimiter,
  authorizeRoles("admin"),
  validateSchema(rejectApplicationWithIdSchema),
  rejectApplication
);

export default organizerApplicationRouter;
