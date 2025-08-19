"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestAnnouncements = exports.getAnnouncementsByType = exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.getAnnouncements = exports.createAnnouncement = void 0;
const Announcement_1 = __importDefault(require("../models/Announcement"));
// Create a new announcement (ADMIN ONLY)
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, type } = req.body;
        const adminUser = req.user;
        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can create announcements"
            });
        }
        const announcement = await Announcement_1.default.create({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create announcement",
            error: error.message
        });
    }
};
exports.createAnnouncement = createAnnouncement;
// Get all announcements (public access)
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement_1.default.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Announcements fetched successfully",
            data: announcements,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch announcements",
            error: error.message
        });
    }
};
exports.getAnnouncements = getAnnouncements;
// Get announcement by ID (public access)
const getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement_1.default.findById(id)
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch announcement",
            error: error.message
        });
    }
};
exports.getAnnouncementById = getAnnouncementById;
// Update announcement (ADMIN ONLY)
const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type } = req.body;
        const adminUser = req.user;
        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can update announcements"
            });
        }
        const announcement = await Announcement_1.default.findById(id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }
        const updatedAnnouncement = await Announcement_1.default.findByIdAndUpdate(id, { title, content, type }, { new: true }).populate("createdBy", "name email");
        return res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            data: updatedAnnouncement
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update announcement",
            error: error.message
        });
    }
};
exports.updateAnnouncement = updateAnnouncement;
// Delete announcement (ADMIN ONLY)
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const adminUser = req.user;
        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete announcements"
            });
        }
        const announcement = await Announcement_1.default.findById(id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }
        await Announcement_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete announcement",
            error: error.message
        });
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
// Get announcements by type (public access)
const getAnnouncementsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const [announcements, total] = await Promise.all([
            Announcement_1.default.find({ type, isActive: true })
                .populate("createdBy", "name email")
                .sort({ date: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Announcement_1.default.countDocuments({ type, isActive: true })
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch announcements by type",
            error: error.message
        });
    }
};
exports.getAnnouncementsByType = getAnnouncementsByType;
// Get latest announcements (public access)
const getLatestAnnouncements = async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const announcements = await Announcement_1.default.find({ isActive: true })
            .populate("createdBy", "name email")
            .sort({ date: -1 })
            .limit(Number(limit));
        return res.status(200).json({
            success: true,
            message: "Latest announcements fetched successfully",
            data: announcements
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch latest announcements",
            error: error.message
        });
    }
};
exports.getLatestAnnouncements = getLatestAnnouncements;
//# sourceMappingURL=announcement.controller.js.map