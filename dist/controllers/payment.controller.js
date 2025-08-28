"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.cancelPaymentOrder = exports.getPaymentStatus = exports.verifyPayment = exports.createPaymentOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const Register_1 = __importDefault(require("../models/Register"));
const Event_1 = __importDefault(require("../models/Event"));
const hallTicket_1 = require("../utils/hallTicket");
// Initialize Razorpay with fallback values for development
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_key_1234567890',
});
// Create payment order
const createPaymentOrder = async (req, res) => {
    try {
        const { eventId, ticketType } = req.body;
        const userId = req.user.id;
        // Validate input
        if (!eventId || !ticketType) {
            return res.status(400).json({
                success: false,
                error: "Event ID and ticket type are required",
            });
        }
        // Get event details
        const event = await Event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found",
            });
        }
        // Find ticket details
        const ticket = event.tickets.find((t) => t.type === ticketType);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket type not found",
            });
        }
        // Check if ticket is available
        if (ticket.available <= 0) {
            return res.status(400).json({
                success: false,
                error: "Tickets not available",
            });
        }
        // Check if user is already registered
        const existingRegistration = await Register_1.default.findOne({
            user: userId,
            event: eventId,
        });
        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                error: "Already registered for this event",
            });
        }
        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: ticket.price * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `event_${eventId}_user_${userId}_${Date.now()}`,
            notes: {
                eventId: eventId,
                userId: userId,
                ticketType: ticketType,
                eventTitle: event.title,
            },
        });
        // Create pending registration
        const registration = new Register_1.default({
            user: userId,
            event: eventId,
            status: "pending",
            ticketType: ticketType,
            paymentOrderId: order.id,
            amount: ticket.price,
            registeredAt: new Date(),
        });
        await registration.save();
        return res.status(201).json({
            success: true,
            message: "Payment order created successfully",
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
            },
            registration: {
                id: registration._id,
                status: registration.status,
                ticketType: registration.ticketType,
                amount: registration.amount,
            },
        });
    }
    catch (error) {
        console.error("Payment order creation error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to create payment order",
        });
    }
};
exports.createPaymentOrder = createPaymentOrder;
// Verify payment and complete registration
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId, } = req.body;
        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registrationId) {
            return res.status(400).json({
                success: false,
                error: "All payment verification parameters are required",
            });
        }
        // Verify payment signature
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const crypto = require("crypto");
        const signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest("hex");
        if (signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                error: "Invalid payment signature",
            });
        }
        // Get registration details
        const registration = await Register_1.default.findById(registrationId);
        if (!registration) {
            return res.status(404).json({
                success: false,
                error: "Registration not found",
            });
        }
        // Check if payment is already verified
        if (registration.status === "confirmed") {
            return res.status(400).json({
                success: false,
                error: "Payment already verified",
            });
        }
        // Get event details
        const event = await Event_1.default.findById(registration.event);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found",
            });
        }
        // Update registration status
        registration.status = "confirmed";
        registration.paymentId = razorpay_payment_id;
        registration.paymentVerifiedAt = new Date();
        registration.confirmedAt = new Date();
        // Generate hall ticket
        const hallTicket = await (0, hallTicket_1.generateHallTicket)(registration._id.toString());
        registration.hallTicket = JSON.stringify(hallTicket);
        await registration.save();
        // Update event participant count
        event.currentParticipants += 1;
        // Update ticket availability
        const ticketIndex = event.tickets.findIndex((t) => t.type === registration.ticketType);
        if (ticketIndex !== -1 && event.tickets[ticketIndex]) {
            event.tickets[ticketIndex].available -= 1;
        }
        await event.save();
        // Add user to event participants
        if (!event.participants.includes(registration.user)) {
            event.participants.push(registration.user);
            await event.save();
        }
        return res.status(200).json({
            success: true,
            message: "Payment verified and registration confirmed",
            registration: {
                id: registration._id,
                status: registration.status,
                ticketType: registration.ticketType,
                amount: registration.amount,
                hallTicket: registration.hallTicket,
                confirmedAt: registration.confirmedAt,
            },
            event: {
                title: event.title,
                date: event.date,
                venue: event.venue,
                currentParticipants: event.currentParticipants,
            },
        });
    }
    catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to verify payment",
        });
    }
};
exports.verifyPayment = verifyPayment;
// Get payment status
const getPaymentStatus = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user.id;
        const registration = await Register_1.default.findById(registrationId)
            .populate("event", "title date venue")
            .populate("user", "name email");
        if (!registration) {
            return res.status(404).json({
                success: false,
                error: "Registration not found",
            });
        }
        // Check if user owns this registration
        if (registration.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Access denied",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Payment status retrieved successfully",
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
    catch (error) {
        console.error("Get payment status error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to get payment status",
        });
    }
};
exports.getPaymentStatus = getPaymentStatus;
// Cancel payment order
const cancelPaymentOrder = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user.id;
        const registration = await Register_1.default.findById(registrationId);
        if (!registration) {
            return res.status(404).json({
                success: false,
                error: "Registration not found",
            });
        }
        // Check if user owns this registration
        if (registration.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Access denied",
            });
        }
        // Check if payment is already confirmed
        if (registration.status === "confirmed") {
            return res.status(400).json({
                success: false,
                error: "Cannot cancel confirmed registration",
            });
        }
        // Update registration status
        registration.status = "cancelled";
        registration.cancelledAt = new Date();
        await registration.save();
        return res.status(200).json({
            success: true,
            message: "Payment order cancelled successfully",
            registration: {
                id: registration._id,
                status: registration.status,
                cancelledAt: registration.cancelledAt,
            },
        });
    }
    catch (error) {
        console.error("Cancel payment order error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to cancel payment order",
        });
    }
};
exports.cancelPaymentOrder = cancelPaymentOrder;
// Get user's payment history
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
            message: "Payment history retrieved successfully",
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
    catch (error) {
        console.error("Get payment history error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to get payment history",
        });
    }
};
exports.getPaymentHistory = getPaymentHistory;
//# sourceMappingURL=payment.controller.js.map