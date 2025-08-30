// src/controllers/registration.controller.ts
import { Request, Response } from "express";
import Registration from "../models/Register";
import Event from "../models/Event";
import { generateHallTicket } from "../utils/hallTicket";
import { confirmRegistrationEffects, revertConfirmedRegistrationEffects } from "../utils/registrationSideEffects";

// Register for an event
export const registerForEvent = async (req: Request, res: Response) => {
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
            notes
        } = req.body;
        const userId = (req as any).user.id;

        // Check if event exists and is active
        const event = await Event.findById(eventId);
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
        const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
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

        // Determine ticket and whether event is paid
        const ticket = (event as any).tickets?.find((t: any) => t.type === ticketType);
        const isPaidEvent = ticket && Number(ticket.price) > 0;

        // For paid events, prevent direct registration and require payment flow
        if (isPaidEvent) {
            return res.status(400).json({
                success: false,
                message: "This is a paid event. Please create a payment order and complete payment to confirm registration."
            });
        }

        // Free events: create confirmed registration and apply side effects
        const registration = await Registration.create({
            user: userId,
            event: eventId,
            status: "confirmed",
            ticketType,
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
            confirmedAt: new Date()
        });

        // Apply centralized side effects (participants, counts, tickets, hall ticket)
        await confirmRegistrationEffects(registration);

        // Populate user and event details
        await registration.populate("user", "name email image");
        await registration.populate("event", "title date startTime endTime venue location");

        return res.status(201).json({
            success: true,
            message: "Successfully registered for event",
            data: registration,
            hallTicket: registration.hallTicket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to register for event",
            error: (error as any).message
        });
    }
};

// Update registration details
export const updateRegistration = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { 
            ticketType,
            phoneNumber,
            college,
            department,
            yearOfStudy,
            dietaryPreferences,
            specialRequirements,
            emergencyContact,
            tshirtSize,
            notes
        } = req.body;

        // Find user's registration (assuming they want to update their latest registration)
        // You might want to add eventId to the request body to be more specific
        const registration = await Registration.findOne({ user: userId })
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
        if (ticketType) registration.ticketType = ticketType;
        if (phoneNumber) registration.phoneNumber = phoneNumber;
        if (college) registration.college = college;
        if (department) registration.department = department;
        if (yearOfStudy) registration.yearOfStudy = yearOfStudy;
        if (dietaryPreferences !== undefined) registration.dietaryPreferences = dietaryPreferences;
        if (specialRequirements !== undefined) registration.specialRequirements = specialRequirements;
        if (emergencyContact) registration.emergencyContact = emergencyContact;
        if (tshirtSize !== undefined) registration.tshirtSize = tshirtSize;
        if (notes !== undefined) registration.notes = notes;

        await registration.save();

        return res.status(200).json({
            success: true,
            message: "Registration updated successfully",
            data: registration
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update registration",
            error: (error as any).message
        });
    }
};

// Get user's registrations
export const getUserRegistrations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { status } = req.query;

        let filter: any = { user: userId };
        if (status) {
            filter.status = status;
        }

        const registrations = await Registration.find(filter)
            .populate("user", "name email image")
            .populate("event", "title date startTime endTime venue location category")
            .sort({ registeredAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Registrations fetched successfully",
            data: registrations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch registrations",
            error: (error as any).message
        });
    }
};

// Get event registrations (admin/organizer only)
export const getEventRegistrations = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        let filter: any = { event: eventId };
        if (status) {
            filter.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [registrations, total] = await Promise.all([
            Registration.find(filter)
                .populate("user", "name email image role")
                .populate("event", "title date startTime endTime venue")
                .sort({ registeredAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Registration.countDocuments(filter)
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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch event registrations",
            error: (error as any).message
        });
    }
};

// Update registration status
export const updateRegistrationStatus = async (req: Request, res: Response) => {
    try {
        const { registrationId } = req.params;
        const { status } = req.body;
        const user = (req as any).user;

        const registration = await Registration.findById(registrationId)
            .populate("event", "title createdBy");

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }

        // Check if user can update this registration
        const event = registration.event as any;
        if (user.role !== "admin" && user.role !== "organizer" && 
            event.createdBy.toString() !== user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this registration"
            });
        }

        // Update status
        const updatedRegistration = await Registration.findByIdAndUpdate(
            registrationId,
            { status },
            { new: true }
        ).populate("user", "name email image")
         .populate("event", "title date startTime endTime venue location");

        return res.status(200).json({
            success: true,
            message: "Registration status updated successfully",
            data: updatedRegistration
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update registration status",
            error: (error as any).message
        });
    }
};

// Cancel registration
export const cancelRegistration = async (req: Request, res: Response) => {
    try {
        const { registrationId } = req.params;
        const userId = (req as any).user.id;

        const registration = await Registration.findById(registrationId);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }

        // Check if user owns this registration
        if ((registration.user as any).toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only cancel your own registration"
            });
        }

        // Check if event has already started
        const event = await Event.findById(registration.event);
        if (event && new Date() >= new Date(event.date)) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel registration for an event that has already started"
            });
        }

        // Only revert side effects if previously confirmed
        if (registration.status === "confirmed") {
            await Registration.findByIdAndUpdate(registrationId, { status: "cancelled", cancelledAt: new Date() });
            await revertConfirmedRegistrationEffects(registration);
        } else {
            await Registration.findByIdAndUpdate(registrationId, { status: "cancelled", cancelledAt: new Date() });
        }

        return res.status(200).json({
            success: true,
            message: "Registration cancelled successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to cancel registration",
            error: (error as any).message
        });
    }
};

// Get hall ticket
export const getHallTicket = async (req: Request, res: Response) => {
    try {
        const { registrationId } = req.params;
        const userId = (req as any).user.id;

        const registration = await Registration.findById(registrationId)
            .populate("user", "name email image")
            .populate("event", "title date startTime endTime venue location category");

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }

        // Check if user owns this registration
        if ((registration.user as any)._id.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own hall ticket"
            });
        }

        // Generate hall ticket
        const hallTicket = await generateHallTicket((registration._id as any).toString());

        return res.status(200).json({
            success: true,
            message: "Hall ticket generated successfully",
            data: {
                registration,
                hallTicket
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate hall ticket",
            error: (error as any).message
        });
    }
};

// Get hall ticket for any user (admin/organizer only)
export const getHallTicketForUser = async (req: Request, res: Response) => {
    try {
        const { userId, eventId } = req.params;
        const adminUser = (req as any).user;

        // Check if user is admin or organizer
        if (adminUser.role !== "admin" && adminUser.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message: "Only admins and organizers can access this endpoint"
            });
        }

        // Find the registration
        const registration = await Registration.findOne({ 
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
        const hallTicket = await generateHallTicket((registration._id as any).toString());

        return res.status(200).json({
            success: true,
            message: "Hall ticket generated successfully",
            data: {
                registration,
                hallTicket
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate hall ticket",
            error: (error as any).message
        });
    }
};

// Get all hall tickets for an event (admin/organizer only)
export const getAllEventHallTickets = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const adminUser = (req as any).user;

        // Check if user is admin or organizer
        if (adminUser.role !== "admin" && adminUser.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message: "Only admins and organizers can access this endpoint"
            });
        }

        // Get all registrations for the event
        const registrations = await Registration.find({ event: eventId })
            .populate("user", "name email image")
            .populate("event", "title date startTime endTime venue location category")
            .sort({ registeredAt: -1 });

        // Generate hall tickets for all registrations
        const hallTickets = await Promise.all(
            registrations.map(async (registration) => {
                const hallTicket = await generateHallTicket((registration._id as any).toString());
                return {
                    registration,
                    hallTicket
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "All hall tickets generated successfully",
            data: hallTickets,
            count: hallTickets.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate hall tickets",
            error: (error as any).message
        });
    }
};
