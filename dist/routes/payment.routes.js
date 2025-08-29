"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const payment_controller_1 = require("../controllers/payment.controller");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const paymentRouter = express_1.default.Router();
//  Webhook (must be unauthenticated, Razorpay calls this directly)
paymentRouter.post("/webhook", payment_controller_1.razorpayWebhook);
// All other routes require authentication
paymentRouter.use(auth_middleware_1.authMiddleware);
// Create payment order for event registration
paymentRouter.post("/create-order", rateLimit_middleware_1.paymentLimiter, payment_controller_1.createPaymentOrder);
// Get payment status for a registration
paymentRouter.get("/status/:registrationId", payment_controller_1.getPaymentStatus);
// Cancel payment order
paymentRouter.post("/cancel/:registrationId", payment_controller_1.cancelPaymentOrder);
// Get user's payment history
paymentRouter.get("/history", payment_controller_1.getPaymentHistory);
exports.default = paymentRouter;
//# sourceMappingURL=payment.routes.js.map