"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarouselSponsors = exports.deleteSponsor = exports.updateSponsor = exports.getSponsorById = exports.getSponsors = exports.createSponsor = void 0;
const Sponsor_1 = __importDefault(require("../models/Sponsor"));
// Create a new sponsor (ADMIN ONLY)
const createSponsor = async (req, res) => {
    try {
        const { title, description, publisher, link, contact, expiresAt } = req.body;
        const adminUser = req.user;
        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can create sponsors"
            });
        }
        // Handle image uploads - same way as events
        let imageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            // Multiple files uploaded
            for (const file of req.files) {
                imageUrls.push(file.path);
            }
        }
        else if (req.file) {
            // Single file uploaded
            imageUrls.push(req.file.path);
        }
        // Validate that we have at least one image
        if (imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required"
            });
        }
        const sponsor = await Sponsor_1.default.create({
            title,
            description,
            publisher,
            link,
            contact,
            images: imageUrls,
            expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week default
        });
        return res.status(201).json({
            success: true,
            message: "Sponsor created successfully",
            data: sponsor
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create sponsor",
            error: error.message
        });
    }
};
exports.createSponsor = createSponsor;
// Get all active sponsors (public access)
const getSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor_1.default.find()
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Sponsors fetched successfully",
            data: sponsors
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch sponsors",
            error: error.message
        });
    }
};
exports.getSponsors = getSponsors;
// Get sponsor by ID (public access)
const getSponsorById = async (req, res) => {
    try {
        const { id } = req.params;
        const sponsor = await Sponsor_1.default.findById(id);
        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: "Sponsor not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Sponsor fetched successfully",
            data: sponsor
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch sponsor",
            error: error.message
        });
    }
};
exports.getSponsorById = getSponsorById;
// Update sponsor (ADMIN ONLY)
const updateSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, publisher, link, contact, isActive, expiresAt } = req.body;
        const adminUser = req.user;
        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can update sponsors"
            });
        }
        const sponsor = await Sponsor_1.default.findById(id);
        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: "Sponsor not found"
            });
        }
        // Handle new image uploads if any - same way as events
        let newImageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            // Multiple files uploaded
            for (const file of req.files) {
                newImageUrls.push(file.path);
            }
        }
        else if (req.file) {
            // Single file uploaded
            newImageUrls.push(req.file.path);
        }
        // Prepare update data
        const updateData = { title, description, publisher, link, contact, isActive, expiresAt };
        // Only update images if new ones were uploaded
        if (newImageUrls.length > 0) {
            updateData.images = newImageUrls;
        }
        const updatedSponsor = await Sponsor_1.default.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).json({
            success: true,
            message: "Sponsor updated successfully",
            data: updatedSponsor
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update sponsor",
            error: error.message
        });
    }
};
exports.updateSponsor = updateSponsor;
// Delete sponsor (ADMIN ONLY)
const deleteSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const adminUser = req.user;
        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete sponsors"
            });
        }
        const sponsor = await Sponsor_1.default.findById(id);
        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: "Sponsor not found"
            });
        }
        await Sponsor_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Sponsor deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete sponsor",
            error: error.message
        });
    }
};
exports.deleteSponsor = deleteSponsor;
// Get carousel sponsors (public access - only active and non-expired)
const getCarouselSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor_1.default.find({
            isActive: true,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Carousel sponsors fetched successfully",
            data: sponsors
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch carousel sponsors",
            error: error.message
        });
    }
};
exports.getCarouselSponsors = getCarouselSponsors;
//# sourceMappingURL=sponsor.controller.js.map