"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.cancelPaymentOrder = exports.getPaymentStatus = exports.razorpayWebhook = exports.createPaymentOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const Register_1 = __importDefault(require("../models/Register"));
const Event_1 = __importDefault(require("../models/Event"));
const registrationSideEffects_1 = require("../utils/registrationSideEffects");
// Initialize Razorpay
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_1234567890",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret_key_1234567890",
});
// ===================
// Create Payment Order
// ===================
const createPaymentOrder = async (req, res) => {
    try {
        const { eventId, ticketType, registrationNumber, phoneNumber, college, department, yearOfStudy, dietaryPreferences, specialRequirements, emergencyContact, tshirtSize, notes, } = req.body;
        const userId = req.user.id;
        if (!eventId || !ticketType) {
            return res.status(400).json({ success: false, error: "Event ID and ticket type are required" });
        }
        if (!registrationNumber || !phoneNumber || !college || !department || !yearOfStudy) {
            return res.status(400).json({
                success: false,
                error: "registrationNumber, phoneNumber, college, department and yearOfStudy are required",
            });
        }
        const event = await Event_1.default.findById(eventId);
        if (!event)
            return res.status(404).json({ success: false, error: "Event not found" });
        const ticket = event.tickets.find((t) => t.type === ticketType);
        if (!ticket)
            return res.status(404).json({ success: false, error: "Ticket type not found" });
        if (ticket.available <= 0)
            return res.status(400).json({ success: false, error: "Tickets not available" });
        const existing = await Register_1.default.findOne({ user: userId, event: eventId });
        if (existing)
            return res.status(400).json({ success: false, error: "Already registered for this event" });
        const eventIdStr = String(eventId); // ensures it’s a string
        const userIdStr = String(userId);
        const order = await razorpay.orders.create({
            amount: ticket.price * 100,
            currency: "INR",
            receipt: `e${eventIdStr.slice(-6)}_u${userIdStr.slice(-6)}_${Date.now()}`.slice(0, 40),
            notes: { eventId, userId, ticketType, eventTitle: event.title },
        });
        const registration = new Register_1.default({
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
    }
    catch (err) {
        console.error("createPaymentOrder error:", err);
        return res.status(500).json({ success: false, error: "Failed to create payment order" });
    }
};
exports.createPaymentOrder = createPaymentOrder;
// ===================
// Razorpay Webhook (Single Source of Truth)
// ===================
const razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];
        const body = JSON.stringify(req.body);
        // Verify webhook
        const expected = crypto_1.default.createHmac("sha256", secret).update(body).digest("hex");
        if (expected !== signature) {
            return res.status(400).json({ success: false, error: "Invalid webhook signature" });
        }
        const eventType = req.body.event;
        if (eventType === "payment.captured") {
            console.log("payment.captured");
            const payment = req.body.payload.payment.entity;
            const registration = await Register_1.default.findOne({ paymentOrderId: payment.order_id });
            if (registration && registration.status !== "confirmed") {
                registration.status = "confirmed";
                registration.paymentId = payment.id;
                registration.paymentVerifiedAt = new Date();
                registration.confirmedAt = new Date();
                await registration.save();
                await (0, registrationSideEffects_1.confirmRegistrationEffects)(registration);
            }
        }
        if (eventType === "payment.failed") {
            const payment = req.body.payload.payment.entity;
            const registration = await Register_1.default.findOne({ paymentOrderId: payment.order_id });
            if (registration) {
                registration.status = "failed";
                await registration.save();
            }
        }
        return res.status(200).json({ success: true });
    }
    catch (err) {
        console.error("razorpayWebhook error:", err);
        return res.status(500).json({ success: false });
    }
};
exports.razorpayWebhook = razorpayWebhook;
// ===================
// Get Payment Status
// ===================
const getPaymentStatus = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user.id;
        const registration = await Register_1.default.findById(registrationId)
            .populate("event", "title date venue")
            .populate("user", "name email");
        if (!registration)
            return res.status(404).json({ success: false, error: "Registration not found" });
        if (registration.user.toString() !== String(userId)) {
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
    }
    catch (err) {
        console.error("getPaymentStatus error:", err);
        return res.status(500).json({ success: false, error: "Failed to get payment status" });
    }
};
exports.getPaymentStatus = getPaymentStatus;
// ===================
// Cancel Payment Order
// ===================
const cancelPaymentOrder = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user.id;
        const registration = await Register_1.default.findById(registrationId);
        if (!registration)
            return res.status(404).json({ success: false, error: "Registration not found" });
        if (registration.user.toString() !== String(userId)) {
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
    }
    catch (err) {
        console.error("cancelPaymentOrder error:", err);
        return res.status(500).json({ success: false, error: "Failed to cancel payment order" });
    }
};
exports.cancelPaymentOrder = cancelPaymentOrder;
// ===================
// Get User's Payment History
// ===================
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const registrations = await Register_1.default.find({ user: userId })
            .populate("event", "title date venue image")
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Register_1.default.countDocuments({ user: userId });
        return res.status(200).json({
            success: true,
            registrations: registrations.map((reg) => ({
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
    }
    catch (err) {
        console.error("getPaymentHistory error:", err);
        return res.status(500).json({ success: false, error: "Failed to get payment history" });
    }
};
exports.getPaymentHistory = getPaymentHistory;
//# sourceMappingURL=payment.controller.js.map