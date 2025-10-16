import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Registration from "../models/Register";
import Event from "../models/Event";
import { confirmRegistrationEffects } from "../utils/registrationSideEffects";

// Initialize Razorpay
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay credentials: RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET");
}
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
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
    } = req.body;
    const userId = (req as any).user.id;

    const event: any = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });
    if (!event.isActive) return res.status(400).json({ success: false, error: "Event is not active" });

    const ticket = event.tickets.find((t: any) => t.type === ticketType);
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket type not found" });
    if (ticket.available <= 0) return res.status(400).json({ success: false, error: "Tickets not available" });
    if (event.maxParticipants && Array.isArray(event.participants) && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ success: false, error: "Event is full" });
    }

    const existing = await Registration.findOne({ user: userId, event: eventId });
    if (existing) return res.status(400).json({ success: false, error: "Already registered for this event" });

    const eventIdStr = String(eventId);
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
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
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
    const rawBody = (req as any).body as Buffer; // raw body from express.raw

    // Verify webhook using raw body
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    if (expected !== signature) {
      return res.status(400).json({ success: false, error: "Invalid webhook signature" });
    }

    const payload = JSON.parse(rawBody.toString("utf8"));
    const eventType = payload.event;

    if (eventType === "payment.captured") {
      const payment = payload.payload.payment.entity as any;

      // Original logic: resolve by order_id, optional fallback by notes
      let registration: any = await Registration.findOne({ paymentOrderId: payment.order_id });
      if (!registration && payment?.notes?.userId && payment?.notes?.eventId) {
        registration = await Registration.findOne({
          user: String(payment.notes.userId),
          event: String(payment.notes.eventId),
          status: { $in: ["pending", "failed", "cancelled"] },
        })
          .sort({ createdAt: -1 })
          .exec();
      }

      if (!registration) {
        return res.status(404).json({ success: false, error: "Registration not found for this payment" });
      }

      if (registration.status !== "confirmed") {
        registration.status = "confirmed";
        registration.paymentId = payment.id;
        registration.paymentVerifiedAt = new Date();
        registration.confirmedAt = new Date();
        await registration.save();
        await confirmRegistrationEffects(registration);
      }

      return res.status(200).json({ success: true });
    }

    if (eventType === "payment.failed") {
      const payment = payload.payload.payment.entity;
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

    const registration: any = await Registration.findById(registrationId)
      .populate("event", "title date venue")
      .populate("user", "name email");

    if (!registration) return res.status(404).json({ success: false, error: "Registration not found" });
    if (String((registration.user as any)?._id || registration.user) !== String(userId)) {
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
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
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

// ===================
// Renew Payment Order for Pending Registration
// ===================
export const renewPaymentOrder = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;
    const userId = (req as any).user.id;

    const registration: any = await Registration.findById(registrationId).populate('event');
    if (!registration) return res.status(404).json({ success: false, error: 'Registration not found' });
    if (String(registration.user) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    // Allow renew for pending/failed/cancelled; set back to pending
    if (!['pending', 'failed', 'cancelled'].includes(registration.status)) {
      return res.status(400).json({ success: false, error: 'Only pending/failed/cancelled registrations can be renewed' });
    }

    const event: any = registration.event;
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    if (!event.isActive) return res.status(400).json({ success: false, error: 'Event is not active' });

    const ticket = Array.isArray(event.tickets)
      ? event.tickets.find((t: any) => t.type === registration.ticketType)
      : null;
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket type not found' });
    if (ticket.available <= 0) return res.status(400).json({ success: false, error: 'Tickets not available' });
    if (event.maxParticipants && Array.isArray(event.participants) && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ success: false, error: 'Event is full' });
    }

    const order = await razorpay.orders.create({
      amount: Number(ticket.price) * 100,
      currency: 'INR',
      receipt: `renew_${registrationId}_${Date.now()}`.slice(0, 40),
      notes: { eventId: String(event._id), userId: String(userId), ticketType: registration.ticketType, eventTitle: event.title },
    });

    registration.paymentOrderId = order.id;
    registration.amount = Number(ticket.price);
    registration.status = 'pending';
    await registration.save();

    return res.status(200).json({
      success: true,
      message: 'Payment order renewed successfully',
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to renew payment order' });
  }
};
