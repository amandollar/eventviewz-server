"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHallTicketById = exports.validateHallTicket = exports.generateHallTicket = void 0;
// src/utils/hallTicket.ts
const Register_1 = __importDefault(require("../models/Register"));
const uuid_1 = require("uuid");
// Generate a unique hall ticket
const generateHallTicket = async (registrationId) => {
    try {
        const registration = await Register_1.default.findById(registrationId)
            .populate("user", "name email")
            .populate("event", "title date startTime endTime venue location");
        if (!registration) {
            throw new Error("Registration not found");
        }
        const user = registration.user;
        const event = registration.event;
        // Generate unique ticket ID
        const ticketId = `HT-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`;
        // Format event time
        const eventTime = `${event.startTime} - ${event.endTime}`;
        // Generate QR code data (you can implement actual QR generation here)
        const qrData = {
            ticketId,
            registrationId: registration._id.toString(),
            eventId: event._id.toString(),
            userId: user._id.toString()
        };
        const hallTicket = {
            ticketId,
            registrationId: registration._id.toString(),
            eventTitle: event.title,
            eventDate: event.date,
            eventTime,
            eventVenue: event.venue,
            eventLocation: event.location || "TBD",
            userName: user.name,
            userEmail: user.email,
            registrationDate: registration.registeredAt,
            status: registration.status,
            qrCode: JSON.stringify(qrData)
        };
        return hallTicket;
    }
    catch (error) {
        throw new Error(`Failed to generate hall ticket: ${error.message}`);
    }
};
exports.generateHallTicket = generateHallTicket;
// Validate hall ticket
const validateHallTicket = async (ticketId) => {
    try {
        // You can implement ticket validation logic here
        // For now, just check if the format is correct
        const ticketPattern = /^HT-[A-F0-9]{8}$/;
        return ticketPattern.test(ticketId);
    }
    catch (error) {
        return false;
    }
};
exports.validateHallTicket = validateHallTicket;
// Get hall ticket by ID
const getHallTicketById = async (ticketId) => {
    try {
        // This is a placeholder - you might want to store hall tickets in a separate collection
        // For now, we'll generate it on-demand
        const registration = await Register_1.default.findOne({
            "hallTicket.ticketId": ticketId
        }).populate("user event");
        if (!registration) {
            return null;
        }
        return await (0, exports.generateHallTicket)(registration._id.toString());
    }
    catch (error) {
        return null;
    }
};
exports.getHallTicketById = getHallTicketById;
//# sourceMappingURL=hallTicket.js.map