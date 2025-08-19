"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/sponsor.routes.ts
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const mutlter_middleware_1 = __importDefault(require("../middlewares/mutlter.middleware"));
const sponsor_controller_1 = require("../controllers/sponsor.controller");
const sponsor_schema_1 = require("../schemas/sponsor.schema");
const sponsorRouter = express_1.default.Router();
// Public routes (no authentication required)
sponsorRouter.get("/", sponsor_controller_1.getSponsors);
sponsorRouter.get("/carousel", sponsor_controller_1.getCarouselSponsors);
sponsorRouter.get("/:id", sponsor_controller_1.getSponsorById);
// Admin-only routes (require authentication and admin role)
sponsorRouter.use(auth_middleware_1.authMiddleware);
sponsorRouter.use((0, role_middleware_1.authorizeRoles)("admin"));
// Handle multiple image uploads for create and update - same way as events
sponsorRouter.post("/", mutlter_middleware_1.default.array("images", 10), (0, validate_middleware_1.validateSchema)(sponsor_schema_1.createSponsorSchema), sponsor_controller_1.createSponsor);
sponsorRouter.put("/:id", mutlter_middleware_1.default.array("images", 10), (0, validate_middleware_1.validateSchema)(sponsor_schema_1.updateSponsorSchema), sponsor_controller_1.updateSponsor);
sponsorRouter.delete("/:id", sponsor_controller_1.deleteSponsor);
exports.default = sponsorRouter;
//# sourceMappingURL=sponsor.routes.js.map