// src/utils/hallTicket.ts
import Registration from "../models/Register";
import { v4 as uuidv4 } from "uuid";

export interface IHallTicket {
  ticketId: string;
  registrationId: string;
  eventTitle: string;
  eventDate: Date;
  eventTime: string;
  eventVenue: string;
  eventLocation: string;
  userName: string;
  userEmail: string;
  registrationDate: Date;
  status: string;
  qrCode?: string;
}

// Generate a unique hall ticket
export const generateHallTicket = async (registrationId: string): Promise<IHallTicket> => {
    try {
        const registration = await Registration.findById(registrationId)
            .populate("user", "name email")
            .populate("event", "title date startTime endTime venue location");

        if (!registration) {
            throw new Error("Registration not found");
        }

        const user = registration.user as any;
        const event = registration.event as any;

        // Generate unique ticket ID
        const ticketId = `HT-${uuidv4().substring(0, 8).toUpperCase()}`;

        // Format event time
        const eventTime = `${event.startTime} - ${event.endTime}`;

        // Generate QR code data (you can implement actual QR generation here)
        const qrData = {
            ticketId,
            registrationId: (registration._id as any).toString(),
            eventId: (event._id as any).toString(),
            userId: (user._id as any).toString()
        };

        const hallTicket: IHallTicket = {
            ticketId,
            registrationId: (registration._id as any).toString(),
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
    } catch (error) {
        throw new Error(`Failed to generate hall ticket: ${(error as any).message}`);
    }
};

// Validate hall ticket
export const validateHallTicket = async (ticketId: string): Promise<boolean> => {
    try {
        // You can implement ticket validation logic here
        // For now, just check if the format is correct
        const ticketPattern = /^HT-[A-F0-9]{8}$/;
        return ticketPattern.test(ticketId);
    } catch (error) {
        return false;
    }
};

// Get hall ticket by ID
export const getHallTicketById = async (ticketId: string): Promise<IHallTicket | null> => {
    try {
        // This is a placeholder - you might want to store hall tickets in a separate collection
        // For now, we'll generate it on-demand
        const registration = await Registration.findOne({ 
            "hallTicket.ticketId": ticketId 
        }).populate("user event");

        if (!registration) {
            return null;
        }

        return await generateHallTicket((registration._id as any).toString());
    } catch (error) {
        return null;
    }
};
