"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const Event_1 = __importDefault(require("../models/Event"));
// Create new event
const createEvent = async (req, res) => {
    try {
        const { title, description, date, startTime, endTime, venue, location, category, participants, maxParticipants, tickets } = req.body;
        const image = req.file?.path;
        // Get user ID from authenticated user (from JWT token)
        const createdBy = req.user?.id;
        if (!createdBy) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const event = await Event_1.default.create({
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
        });
        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create event",
            error: error.message,
        });
    }
};
exports.createEvent = createEvent;
//get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event_1.default.find();
        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            events,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch events",
            error: error.message,
        });
    }
};
exports.getEvents = getEvents;
//get event by id
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event_1.default.findById(id);
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            event,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch event",
            error: error.message,
        });
    }
};
exports.getEventById = getEventById;
//update event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, startTime, endTime, venue, location, category, maxParticipants, isActive, tickets } = req.body;
        const image = req.file?.path;
        const event = await Event_1.default.findByIdAndUpdate(id, {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update event",
            error: error.message,
        });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Event_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete event",
            error: error.message,
        });
    }
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=event.controller.js.map