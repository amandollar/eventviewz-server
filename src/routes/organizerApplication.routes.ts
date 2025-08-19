import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
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
import upload from "../middlewares/mutlter.middleware";

const organizerApplicationRouter = express.Router();

// All routes require authentication
organizerApplicationRouter.use(authMiddleware);

// User routes (for students to apply)
organizerApplicationRouter.post("/", generalLimiter, upload.single("organizationImage"), submitApplication);
organizerApplicationRouter.get("/my-application", generalLimiter, getMyApplication);
organizerApplicationRouter.put("/", generalLimiter, upload.single("organizationImage"), updateApplication);

// Admin routes (for reviewing applications)
organizerApplicationRouter.get("/", generalLimiter, authorizeRoles("admin"), getAllApplications);
organizerApplicationRouter.get("/stats", generalLimiter, authorizeRoles("admin"), getApplicationStats);
organizerApplicationRouter.get("/:id", generalLimiter, authorizeRoles("admin"), getApplicationById);
organizerApplicationRouter.post("/:id/approve", generalLimiter, authorizeRoles("admin"), approveApplication);
organizerApplicationRouter.post("/:id/reject", generalLimiter, authorizeRoles("admin"), rejectApplication);

export default organizerApplicationRouter;
