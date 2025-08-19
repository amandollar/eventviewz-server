// src/controllers/sponsor.controller.ts
import { Request, Response } from "express";
import Sponsor from "../models/Sponsor";

// Create a new sponsor (ADMIN ONLY)
export const createSponsor = async (req: Request, res: Response) => {
    try {
        const { title, description, publisher, expiresAt } = req.body;
        const adminUser = (req as any).user;

        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can create sponsors"
            });
        }

        // Handle image uploads - same way as events
        let imageUrls: string[] = [];
        
        if (req.files && Array.isArray(req.files)) {
            // Multiple files uploaded
            for (const file of req.files) {
                imageUrls.push((file as any).path);
            }
        } else if (req.file) {
            // Single file uploaded
            imageUrls.push((req.file as any).path);
        }

        // Validate that we have at least one image
        if (imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required"
            });
        }

        const sponsor = await Sponsor.create({
            title,
            description,
            publisher,
            images: imageUrls,
            expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week default
        });

        return res.status(201).json({
            success: true,
            message: "Sponsor created successfully",
            data: sponsor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create sponsor",
            error: (error as any).message
        });
    }
};

// Get all active sponsors (public access)
export const getSponsors = async (req: Request, res: Response) => {
    try {
        const sponsors = await Sponsor.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Sponsors fetched successfully",
            data: sponsors
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch sponsors",
            error: (error as any).message
        });
    }
};

// Get sponsor by ID (public access)
export const getSponsorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const sponsor = await Sponsor.findById(id);

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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch sponsor",
            error: (error as any).message
        });
    }
};

// Update sponsor (ADMIN ONLY)
export const updateSponsor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, publisher, isActive, expiresAt } = req.body;
        const adminUser = (req as any).user;

        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can update sponsors"
            });
        }

        const sponsor = await Sponsor.findById(id);
        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: "Sponsor not found"
            });
        }

        // Handle new image uploads if any - same way as events
        let newImageUrls: string[] = [];
        
        if (req.files && Array.isArray(req.files)) {
            // Multiple files uploaded
            for (const file of req.files) {
                newImageUrls.push((file as any).path);
            }
        } else if (req.file) {
            // Single file uploaded
            newImageUrls.push((req.file as any).path);
        }

        // Prepare update data
        const updateData: any = { title, description, publisher, isActive, expiresAt };
        
        // Only update images if new ones were uploaded
        if (newImageUrls.length > 0) {
            updateData.images = newImageUrls;
        }

        const updatedSponsor = await Sponsor.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Sponsor updated successfully",
            data: updatedSponsor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update sponsor",
            error: (error as any).message
        });
    }
};

// Delete sponsor (ADMIN ONLY)
export const deleteSponsor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminUser = (req as any).user;

        // Check if user is admin
        if (adminUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete sponsors"
            });
        }

        const sponsor = await Sponsor.findById(id);
        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: "Sponsor not found"
            });
        }

        await Sponsor.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Sponsor deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete sponsor",
            error: (error as any).message
        });
    }
};

// Get carousel sponsors (public access - only active and non-expired)
export const getCarouselSponsors = async (req: Request, res: Response) => {
    try {
        const sponsors = await Sponsor.find({
            isActive: true,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Carousel sponsors fetched successfully",
            data: sponsors
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch carousel sponsors",
            error: (error as any).message
        });
    }
};
