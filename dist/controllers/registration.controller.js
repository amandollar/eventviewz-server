"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEventHallTickets = exports.getHallTicketForUser = exports.getHallTicket = exports.cancelRegistration = exports.updateRegistrationStatus = exports.getEventRegistrations = exports.getUserRegistrations = exports.updateRegistration = exports.registerForEvent = void 0;
const Register_1 = __importDefault(require("../models/Register"));
const Event_1 = __importDefault(require("../models/Event"));
const hallTicket_1 = require("../utils/hallTicket");
// Register for an event
const registerForEvent = async (req, res) => {
    try {
        const { eventId, ticketType, registrationNumber, phoneNumber, college, department, yearOfStudy, dietaryPreferences, specialRequirements, emergencyContact, tshirtSize, notes } = req.body;
        const userId = req.user._id;
        // Check if event exists and is active
        const event = await Event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
        if (!event.isActive) {
            return res.status(400).json({
                success: false,
                message: "Event is not active"
            });
        }
        // Check if user is already registered
        const existingRegistration = await Register_1.default.findOne({ user: userId, event: eventId });
        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: "You are already registered for this event"
            });
        }
        // Check if event is full
        if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: "Event is full"
            });
        }
        // Create registration with enhanced data
        const registration = await Register_1.default.create({
            user: userId,
            event: eventId,
            status: "registered",
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
            notes
        });
        // Add user to event participants (idempotent)
        await Event_1.default.findByIdAndUpdate(eventId, {
            $addToSet: { participants: userId },
            $inc: { currentParticipants: 1 }
        });
        // Generate hall ticket
        const hallTicket = await (0, hallTicket_1.generateHallTicket)(registration._id.toString());
        // Populate user and event details
        await registration.populate("user", "name email image");
        await registration.populate("event", "title date startTime endTime venue location");
        return res.status(201).json({
            success: true,
            message: "Successfully registered for event",
            data: registration,
            hallTicket
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to register for event",
            error: error.message
        });
    }
};
exports.registerForEvent = registerForEvent;
// Update registration details
const updateRegistration = async (req, res) => {
    try {
        const userId = req.user._id;
        const { ticketType, phoneNumber, college, department, yearOfStudy, dietaryPreferences, specialRequirements, emergencyContact, tshirtSize, notes } = req.body;
        // Find user's registration (assuming they want to update their latest registration)
        // You might want to add eventId to the request body to be more specific
        const registration = await Register_1.default.findOne({ user: userId })
            .sort({ registeredAt: -1 })
            .populate("event", "title date");
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "No registration found for this user"
            });
        }
        // Only allow updates if registration is still pending/confirmed
        if (registration.status === "cancelled" || registration.status === "failed" || registration.status === "refunded") {
            return res.status(400).json({
                success: false,
                message: "Cannot update registration that has been cancelled, failed, or refunded"
            });
        }
        // Update fields if provided
        if (ticketType)
            registration.ticketType = ticketType;
        if (phoneNumber)
            registration.phoneNumber = phoneNumber;
        if (college)
            registration.college = college;
        if (department)
            registration.department = department;
        if (yearOfStudy)
            registration.yearOfStudy = yearOfStudy;
        if (dietaryPreferences !== undefined)
            registration.dietaryPreferences = dietaryPreferences;
        if (specialRequirements !== undefined)
            registration.specialRequirements = specialRequirements;
        if (emergencyContact)
            registration.emergencyContact = emergencyContact;
        if (tshirtSize !== undefined)
            registration.tshirtSize = tshirtSize;
        if (notes !== undefined)
            registration.notes = notes;
        await registration.save();
        return res.status(200).json({
            success: true,
            message: "Registration updated successfully",
            data: registration
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update registration",
            error: error.message
        });
    }
};
exports.updateRegistration = updateRegistration;
// Get user's registrations
const getUserRegistrations = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;
        let filter = { user: userId };
        if (status) {
            filter.status = status;
        }
        const registrations = await Register_1.default.find(filter)
            .populate("user", "name email image")
            .populate("event", "title date startTime endTime venue location category")
            .sort({ registeredAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Registrations fetched successfully",
            data: registrations
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch registrations",
            error: error.message
        });
    }
};
exports.getUserRegistrations = getUserRegistrations;
// Get event registrations (admin/organizer only)
const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;
        let filter = { event: eventId };
        if (status) {
            filter.status = status;
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [registrations, total] = await Promise.all([
            Register_1.default.find(filter)
                .populate("user", "name email image role")
                .populate("event", "title date startTime endTime venue")
                .sort({ registeredAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Register_1.default.countDocuments(filter)
        ]);
        const totalPages = Math.ceil(total / Number(limit));
        return res.status(200).json({
            success: true,
            message: "Event registrations fetched successfully",
            data: registrations,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch event registrations",
            error: error.message
        });
    }
};
exports.getEventRegistrations = getEventRegistrations;
// Update registration status
const updateRegistrationStatus = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const { status } = req.body;
        const user = req.user;
        const registration = await Register_1.default.findById(registrationId)
            .populate("event", "title createdBy");
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }
        // Check if user can update this registration
        const event = registration.event;
        if (user.role !== "admin" && user.role !== "organizer" &&
            event.createdBy.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this registration"
            });
        }
        // Update status
        const updatedRegistration = await Register_1.default.findByIdAndUpdate(registrationId, { status }, { new: true }).populate("user", "name email image")
            .populate("event", "title date startTime endTime venue location");
        return res.status(200).json({
            success: true,
            message: "Registration status updated successfully",
            data: updatedRegistration
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update registration status",
            error: error.message
        });
    }
};
exports.updateRegistrationStatus = updateRegistrationStatus;
// Cancel registration
const cancelRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user._id;
        const registration = await Register_1.default.findById(registrationId);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }
        // Check if user owns this registration
        if (registration.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only cancel your own registration"
            });
        }
        // Check if event has already started
        const event = await Event_1.default.findById(registration.event);
        if (event && new Date() >= new Date(event.date)) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel registration for an event that has already started"
            });
        }
        // Update status to cancelled
        await Register_1.default.findByIdAndUpdate(registrationId, { status: "cancelled" });
        // Remove user from event participants and prevent negative counts
        await Event_1.default.findByIdAndUpdate(registration.event, {
            $pull: { participants: userId },
            $inc: { currentParticipants: -1 },
            $max: { currentParticipants: 0 }
        });
        return res.status(200).json({
            success: true,
            message: "Registration cancelled successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to cancel registration",
            error: error.message
        });
    }
};
exports.cancelRegistration = cancelRegistration;
// Get hall ticket
const getHallTicket = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user._id;
        const registration = await Register_1.default.findById(registrationId)
            .populate("user", "name email image")
            .populate("event", "title date startTime endTime venue location category");
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }
        // Check if user owns this registration
        if (registration.user._id.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own hall ticket"
            });
        }
        // Generate hall ticket
        const hallTicket = await (0, hallTicket_1.generateHallTicket)(registration._id.toString());
        return res.status(200).json({
            success: true,
            message: "Hall ticket generated successfully",
            data: {
                registration,
                hallTicket
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate hall ticket",
            error: error.message
        });
    }
};
exports.getHallTicket = getHallTicket;
// Get hall ticket for any user (admin/organizer only)
const getHallTicketForUser = async (req, res) => {
    try {
        const { userId, eventId } = req.params;
        const adminUser = req.user;
        // Check if user is admin or organizer
        if (adminUser.role !== "admin" && adminUser.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message: "Only admins and organizers can access this endpoint"
            });
        }
        // Find the registration
        const registration = await Register_1.default.findOne({
            user: userId,
            event: eventId
        }).populate("user", "name email image")
            .populate("event", "title date startTime endTime venue location category");
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found for this user and event"
            });
        }
        // Generate hall ticket
        const hallTicket = await (0, hallTicket_1.generateHallTicket)(registration._id.toString());
        return res.status(200).json({
            success: true,
            message: "Hall ticket generated successfully",
            data: {
                registration,
                hallTicket
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate hall ticket",
            error: error.message
        });
    }
};
exports.getHallTicketForUser = getHallTicketForUser;
// Get all hall tickets for an event (admin/organizer only)
const getAllEventHallTickets = async (req, res) => {
    try {
        const { eventId } = req.params;
        const adminUser = req.user;
        // Check if user is admin or organizer
        if (adminUser.role !== "admin" && adminUser.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message: "Only admins and organizers can access this endpoint"
            });
        }
        // Get all registrations for the event
        const registrations = await Register_1.default.find({ event: eventId })
            .populate("user", "name email image")
            .populate("event", "title date startTime endTime venue location category")
            .sort({ registeredAt: -1 });
        // Generate hall tickets for all registrations
        const hallTickets = await Promise.all(registrations.map(async (registration) => {
            const hallTicket = await (0, hallTicket_1.generateHallTicket)(registration._id.toString());
            return {
                registration,
                hallTicket
            };
        }));
        return res.status(200).json({
            success: true,
            message: "All hall tickets generated successfully",
            data: hallTickets,
            count: hallTickets.length
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate hall tickets",
            error: error.message
        });
    }
};
exports.getAllEventHallTickets = getAllEventHallTickets;
//# sourceMappingURL=registration.controller.js.map