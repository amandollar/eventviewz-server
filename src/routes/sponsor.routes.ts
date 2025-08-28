// src/routes/sponsor.routes.ts
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import upload from "../middlewares/multer.middleware";
import {
    createSponsor,
    getSponsors,
    getSponsorById,
    updateSponsor,
    deleteSponsor,
    getCarouselSponsors
} from "../controllers/sponsor.controller";
import {
    createSponsorSchema,
    updateSponsorSchema,
} from "../schemas/sponsor.schema";

const sponsorRouter = express.Router();

// Public routes (no authentication required)
sponsorRouter.get("/", getSponsors);
sponsorRouter.get("/carousel", getCarouselSponsors);
sponsorRouter.get("/:id", getSponsorById);

// Admin-only routes (require authentication and admin role)
sponsorRouter.use(authMiddleware);
sponsorRouter.use(authorizeRoles("admin"));

// Handle multiple image uploads for create and update - same way as events
sponsorRouter.post("/", upload.array("images", 10), validateSchema(createSponsorSchema), createSponsor);
sponsorRouter.put("/:id", upload.array("images", 10), validateSchema(updateSponsorSchema), updateSponsor);
sponsorRouter.delete("/:id", deleteSponsor);

export default sponsorRouter;
