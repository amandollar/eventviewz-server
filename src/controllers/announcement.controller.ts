// src/controllers/announcement.controller.ts
import { Request, Response } from "express";
import Announcement from "../models/Announcement";

// Create a new announcement (ADMIN ONLY)
export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const { title, content, type } = req.body;
        const adminUser = (req as any).user;

        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can create announcements"
            });
        }

        const announcement = await Announcement.create({
            title,
            content,
            type,
            createdBy: adminUser._id,
        });

        // Populate creator details
        await announcement.populate("createdBy", "name email");

        return res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            data: announcement
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create announcement",
            error: (error as any).message
        });
    }
};

// Get all announcements (public access)
export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await Announcement.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Announcements fetched successfully",
            data: announcements,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch announcements",
            error: (error as any).message
        });
    }
};

// Get announcement by ID (public access)
export const getAnnouncementById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findById(id)
            .populate("createdBy", "name email");

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Announcement fetched successfully",
            data: announcement
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch announcement",
            error: (error as any).message
        });
    }
};

// Update announcement (ADMIN ONLY)
export const updateAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, type } = req.body;
        const adminUser = (req as any).user;

        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can update announcements"
            });
        }

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            { title, content, type },
            { new: true }
        ).populate("createdBy", "name email");

        return res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            data: updatedAnnouncement
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update announcement",
            error: (error as any).message
        });
    }
};

// Delete announcement (ADMIN ONLY)
export const deleteAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminUser = (req as any).user;

        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete announcements"
            });
        }

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        await Announcement.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete announcement",
            error: (error as any).message
        });
    }
};

// Get announcements by type (public access)
export const getAnnouncementsByType = async (req: Request, res: Response) => {
    try {
        const { type } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const [announcements, total] = await Promise.all([
            Announcement.find({ type, isActive: true })
                .populate("createdBy", "name email")
                .sort({ date: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Announcement.countDocuments({ type, isActive: true })
        ]);

        const totalPages = Math.ceil(total / Number(limit));

        return res.status(200).json({
            success: true,
            message: `${type} announcements fetched successfully`,
            data: announcements,
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
            message: "Failed to fetch announcements by type",
            error: (error as any).message
        });
    }
};

// Get latest announcements (public access)
export const getLatestAnnouncements = async (req: Request, res: Response) => {
    try {
        const { limit = 5 } = req.query;

        const announcements = await Announcement.find({ isActive: true })
            .populate("createdBy", "name email")
            .sort({ date: -1 })
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            message: "Latest announcements fetched successfully",
            data: announcements
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch latest announcements",
            error: (error as any).message
        });
    }
};
