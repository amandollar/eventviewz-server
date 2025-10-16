import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { 
  createPaymentOrder, 
  getPaymentStatus, 
  cancelPaymentOrder, 
  getPaymentHistory, 
  razorpayWebhook, 
  renewPaymentOrder 
} from "../controllers/payment.controller";
import { validateSchema } from "../middlewares/validate.middleware";
import {registerForEventSchema} from "../schemas/registration.schema";

const paymentRouter = express.Router();

//  Webhook (must be unauthenticated, Razorpay calls this directly)
paymentRouter.post("/webhook", razorpayWebhook);

// All other routes require authentication
paymentRouter.use(authMiddleware);

// Create payment order for event registration
paymentRouter.post("/create-order",validateSchema(registerForEventSchema), createPaymentOrder);

// Get payment status for a registration
paymentRouter.get("/status/:registrationId", getPaymentStatus);

// Cancel payment order
paymentRouter.post("/cancel/:registrationId", cancelPaymentOrder);

// Renew payment order for pending registration
paymentRouter.post("/renew-order/:registrationId", renewPaymentOrder);

// Get user's payment history
paymentRouter.get("/history", getPaymentHistory);

export default paymentRouter;
