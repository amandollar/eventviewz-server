import { Request, Response } from "express";
import Event from "../models/Event";

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, description, date, startTime, endTime, venue, location, category, createdBy, participants, maxParticipants } = req.body;
        const image = req.file?.path;

        const event = await Event.create({
            title,
            description,
            date,
            startTime,
            endTime,
            venue,
            location,
            category,
            createdBy,
            participants: participants || [],
            maxParticipants,
            currentParticipants: participants ? participants.length : 0,
            image,
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create event",
            error: (error as any).message,
        });
    }
};


//get all events
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find();
        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch events",
            error: (error as any).message,
        });
    }
};

//get event by id

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch event",
            error: (error as any).message,
        });
    }
};

//update event

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, date, startTime, endTime, venue, location, category, maxParticipants, isActive, tickets } = req.body;
        const image = req.file?.path;

        const event = await Event.findByIdAndUpdate(id, {
            title,
            description,
            date,
            startTime,
            endTime,
            venue,
            location,
            category,
            maxParticipants,
            isActive,
            tickets,
            image,
        });

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update event",
            error: (error as any).message,
        });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete event",
            error: (error as any).message,
        });
    }
};