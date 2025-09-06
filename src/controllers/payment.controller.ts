import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Registration from "../models/Register";
import Event from "../models/Event";
import { confirmRegistrationEffects } from "../utils/registrationSideEffects";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_1234567890",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret_key_1234567890",
});

// ===================
// Create Payment Order
// ===================
export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const {
      eventId,
      ticketType,
      registrationNumber,
      phoneNumber,
      college,
      department,
      yearOfStudy,
      dietaryPreferences,
      specialRequirements,
      emergencyContact,
      tshirtSize,
      notes,
    } = req.body;
    const userId = (req as any).user.id;

    if (!eventId || !ticketType) {
      return res.status(400).json({ success: false, error: "Event ID and ticket type are required" });
    }
    if (!registrationNumber || !phoneNumber || !college || !department || !yearOfStudy) {
      return res.status(400).json({
        success: false,
        error: "registrationNumber, phoneNumber, college, department and yearOfStudy are required",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });

    const ticket = event.tickets.find((t: any) => t.type === ticketType);
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket type not found" });
    if (ticket.available <= 0) return res.status(400).json({ success: false, error: "Tickets not available" });

    const existing = await Registration.findOne({ user: userId, event: eventId });
    if (existing) return res.status(400).json({ success: false, error: "Already registered for this event" });


    const eventIdStr = String(eventId); // ensures it’s a string
    const userIdStr = String(userId);


    const order = await razorpay.orders.create({
      amount: ticket.price * 100,
      currency: "INR",
      receipt: `e${eventIdStr.slice(-6)}_u${userIdStr.slice(-6)}_${Date.now()}`.slice(0, 40),
      notes: { eventId, userId, ticketType, eventTitle: event.title },
    });

    const registration = new Registration({
      user: userId,
      event: eventId,
      status: "pending",
      ticketType,
      paymentOrderId: order.id,
      amount: ticket.price,
      registeredAt: new Date(),
      registrationNumber,
      phoneNumber,
      college,
      department,
      yearOfStudy,
      dietaryPreferences,
      specialRequirements,
      emergencyContact: emergencyContact?.name && emergencyContact?.phone && emergencyContact?.relationship ? emergencyContact : undefined,
      tshirtSize,
      notes,
    });

    await registration.save();

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      order: { 
        id: order.id, 
        amount: order.amount, 
        currency: order.currency, 
        receipt: order.receipt 
      },
      registration: { 
        id: registration._id, 
        status: registration.status, 
        ticketType, 
        amount: registration.amount 
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_1234567890"
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to create payment order" });
  }
};

// ===================
// Razorpay Webhook (Single Source of Truth)
// ===================
export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers["x-razorpay-signature"] as string;
    const body = JSON.stringify(req.body);

    // Verify webhook
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (expected !== signature) {
      return res.status(400).json({ success: false, error: "Invalid webhook signature" });
    }

    const eventType = req.body.event;

    if (eventType === "payment.captured") {
      const payment = req.body.payload.payment.entity;
      const registration = await Registration.findOne({ paymentOrderId: payment.order_id });
      if (registration && registration.status !== "confirmed") {
        registration.status = "confirmed";
        registration.paymentId = payment.id;
        registration.paymentVerifiedAt = new Date();
        registration.confirmedAt = new Date();
        await registration.save();

        await confirmRegistrationEffects(registration);
      }
    }

    if (eventType === "payment.failed") {
      const payment = req.body.payload.payment.entity;
      const registration = await Registration.findOne({ paymentOrderId: payment.order_id });
      if (registration) {
        registration.status = "failed";
        await registration.save();
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

// ===================
// Get Payment Status
// ===================
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;
    const userId = (req as any).user.id;

    const registration = await Registration.findById(registrationId)
      .populate("event", "title date venue")
      .populate("user", "name email");

    if (!registration) return res.status(404).json({ success: false, error: "Registration not found" });
    if ((registration.user as any).toString() !== String(userId)) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      registration: {
        id: registration._id,
        status: registration.status,
        ticketType: registration.ticketType,
        amount: registration.amount,
        paymentOrderId: registration.paymentOrderId,
        paymentId: registration.paymentId,
        paymentVerifiedAt: registration.paymentVerifiedAt,
        confirmedAt: registration.confirmedAt,
        hallTicket: registration.hallTicket,
        event: registration.event,
        user: registration.user,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to get payment status" });
  }
};

// ===================
// Cancel Payment Order
// ===================
export const cancelPaymentOrder = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;
    const userId = (req as any).user.id;

    const registration = await Registration.findById(registrationId);
    if (!registration) return res.status(404).json({ success: false, error: "Registration not found" });
    if ((registration.user as any).toString() !== String(userId)) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }
    if (registration.status === "confirmed") {
      return res.status(400).json({ success: false, error: "Cannot cancel confirmed registration" });
    }

    registration.status = "cancelled";
    registration.cancelledAt = new Date();
    await registration.save();

    return res.status(200).json({
      success: true,
      message: "Payment order cancelled successfully",
      registration: { id: registration._id, status: registration.status, cancelledAt: registration.cancelledAt },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to cancel payment order" });
  }
};

// ===================
// Get User's Payment History
// ===================
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 10 } = req.query;

    const registrations = await Registration.find({ user: userId })
      .populate("event", "title date venue image")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Registration.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      registrations: registrations.map((reg: any) => ({
        id: reg._id,
        status: reg.status,
        ticketType: reg.ticketType,
        amount: reg.amount,
        paymentOrderId: reg.paymentOrderId,
        paymentId: reg.paymentId,
        paymentVerifiedAt: reg.paymentVerifiedAt,
        confirmedAt: reg.confirmedAt,
        cancelledAt: reg.cancelledAt,
        hallTicket: reg.hallTicket,
        event: reg.event,
        registeredAt: reg.registeredAt,
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Failed to get payment history" });
  }
};
