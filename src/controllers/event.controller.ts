import { Request, Response } from "express";
import Event from "../models/Event";
import Registration from "../models/Register";

// Create new event
export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, description, date, startTime, endTime, venue, location, category, participants, maxParticipants, tickets ,prizePool,goodies} = req.body;
        const image = req.file?.path;
        
        // Get user ID from authenticated user (from JWT token)
        const createdBy = (req as any).user?.id;
        
        if (!createdBy) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }

        const event = await Event.create({
            title,
            description,
            date,
            startTime,
            endTime,
            venue,
            location,
            category,
            createdBy, //by authenticated user
            participants: participants || [],
            tickets,
            maxParticipants,
            currentParticipants: participants ? participants.length : 0,
            image,
            prizePool,
            goodies
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
        const { title, description, date, startTime, endTime, venue, location, category, maxParticipants, isActive, tickets,prizePool,goodies } = req.body;
        const image = req.file?.path;
        
        // Get user info from auth middleware
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        // First, find the event to check ownership
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
            return;
        }

        // Check authorization: Only event owner or admin can update
        if (userRole !== "admin" && (existingEvent.createdBy as any).toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "You can only update events you created",
            });
            return;
        }

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
            prizePool,
            goodies
        }, { new: true });

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
        
        // Get user info from auth middleware
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        // First, find the event to check ownership
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
            return;
        }

        // Check authorization: Only event owner or admin can delete
        if (userRole !== "admin" && (existingEvent.createdBy as any).toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "You can only delete events you created",
            });
            return;
        }

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

// Get events created by the current user (for organizer dashboard)
export const getMyEvents = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        let events;
        if (userRole === "admin") {
            // Admin can see all events
            events = await Event.find().sort({ createdAt: -1 });
        } else {
            // Organizers can only see their own events
            events = await Event.find({ createdBy: userId }).sort({ createdAt: -1 });
        }

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

// Search events by title or description
export const searchEvents = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        
        if (!q || typeof q !== 'string') {
            res.status(400).json({
                success: false,
                message: "Search query is required",
            });
            return;
        }

        const events = await Event.find({
            $text: { $search: q },
            isActive: true
        }).sort({ score: { $meta: "textScore" } });

        res.status(200).json({
            success: true,
            message: "Events searched successfully",
            events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to search events",
            error: (error as any).message,
        });
    }
};

// Get events by category
export const getEventsByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        
        if (!category) {
            res.status(400).json({
                success: false,
                message: "Category is required",
            });
            return;
        }

        const events = await Event.find({
            category: category.toLowerCase(),
            isActive: true
        }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch events by category",
            error: (error as any).message,
        });
    }
};

// Get event participants with detailed information
export const getEventParticipants = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        // Find the event
        const event = await Event.findById(id);
        if (!event) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
            return;
        }

        // Check authorization: Only event owner or admin can view participants
        if (userRole !== "admin" && (event.createdBy as any).toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "You can only view participants for events you created",
            });
            return;
        }

        // Get registrations for this event with user details
        const registrations = await Registration.find({ event: id })
            .populate('user', 'name email phone')
            .sort({ registeredAt: -1 });

        // Format participants data
        const participants = registrations
            .filter((reg: any) => reg.user) // Filter out registrations without user data
            .map((reg: any) => ({
                _id: reg.user._id,
                name: reg.user.name,
                email: reg.user.email,
                phone: reg.user.phone,
                registeredAt: reg.registeredAt,
                ticketType: reg.ticketType,
                isAttended: reg.isAttended,
                attendedAt: reg.attendedAt
            }));

        res.status(200).json({
            success: true,
            message: "Participants fetched successfully",
            participants,
        });
    } catch (error) {
        console.error('Error in getEventParticipants:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch participants",
            error: (error as any).message,
        });
    }
};

// Mark participant attendance
export const markParticipantAttendance = async (req: Request, res: Response) => {
    try {
        const { id: eventId, participantId } = req.params;
        const { isAttended } = req.body;
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
            return;
        }

        // Check authorization: Only event owner or admin can mark attendance
        if (userRole !== "admin" && (event.createdBy as any).toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "You can only mark attendance for events you created",
            });
            return;
        }

        // Find the registration first
        const existingRegistration = await Registration.findOne({ event: eventId, user: participantId });
        
        if (!existingRegistration) {
            res.status(404).json({
                success: false,
                message: "Participant registration not found",
            });
            return;
        }

        // Update the registration
        const registration = await Registration.findByIdAndUpdate(
            existingRegistration._id,
            { 
                isAttended,
                attendedAt: isAttended ? new Date() : null
            },
            { new: true }
        ).populate('user', 'name email phone');

        if (!registration) {
            res.status(404).json({
                success: false,
                message: "Participant registration not found",
            });
            return;
        }

        // Type assertion for populated user
        const populatedUser = registration.user as any;

        res.status(200).json({
            success: true,
            message: `Attendance ${isAttended ? 'marked' : 'unmarked'} successfully`,
            participant: {
                _id: populatedUser._id,
                name: populatedUser.name,
                email: populatedUser.email,
                phone: populatedUser.phone,
                isAttended: registration.isAttended,
                attendedAt: registration.attendedAt
            }
        });
    } catch (error) {
        console.error('Error in markParticipantAttendance:', error);
        res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: (error as any).message,
        });
    }
};