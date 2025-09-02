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
  upload.single("organizationImage"),
  validateSchema(submitApplicationSchema),
  submitApplication
);

organizerApplicationRouter.get("/my-application", getMyApplication);

organizerApplicationRouter.put("/",
  upload.single("organizationImage"),
  validateSchema(updateApplicationSchema),
  updateApplication
);

// Admin routes (for reviewing applications)
organizerApplicationRouter.get("/",
  authorizeRoles("admin"),
  validateSchema(getAllApplicationsWithQuerySchema),
  getAllApplications
);

organizerApplicationRouter.get("/stats", authorizeRoles("admin"), getApplicationStats);

organizerApplicationRouter.get("/:id", authorizeRoles("admin"), getApplicationById);

organizerApplicationRouter.post("/:id/approve",
  authorizeRoles("admin"),
  validateSchema(approveApplicationWithIdSchema),
  approveApplication
);

organizerApplicationRouter.post("/:id/reject",
  authorizeRoles("admin"),
  validateSchema(rejectApplicationWithIdSchema),
  rejectApplication
);

export default organizerApplicationRouter;
