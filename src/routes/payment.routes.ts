import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { 
  createPaymentOrder, 
  verifyPayment, 
  getPaymentStatus, 
  cancelPaymentOrder, 
  getPaymentHistory 
} from "../controllers/payment.controller";
import { paymentLimiter } from "../middlewares/rateLimit.middleware";

const paymentRouter = express.Router();

// All routes require authentication
paymentRouter.use(authMiddleware);

// Create payment order for event registration
paymentRouter.post("/create-order", paymentLimiter, createPaymentOrder);

// Verify payment after successful transaction
paymentRouter.post("/verify", paymentLimiter, verifyPayment);

// Get payment status for a registration
paymentRouter.get("/status/:registrationId", getPaymentStatus);

// Cancel payment order
paymentRouter.post("/cancel/:registrationId", cancelPaymentOrder);

// Get user's payment history
paymentRouter.get("/history", getPaymentHistory);

export default paymentRouter;
