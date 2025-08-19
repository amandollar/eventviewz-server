"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationStats = exports.rejectApplication = exports.approveApplication = exports.getApplicationById = exports.getAllApplications = exports.updateApplication = exports.getMyApplication = exports.submitApplication = void 0;
const OrganizerApplication_1 = __importDefault(require("../models/OrganizerApplication"));
const User_1 = __importDefault(require("../models/User"));
// Submit organizer application
const submitApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { organizationName, phoneNumber, description } = req.body;
        const organizationImage = req.file?.path; // From multer
        // Check if user already has an application
        const existingApplication = await OrganizerApplication_1.default.findOne({ user: userId });
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: "You already have a pending application",
            });
        }
        // Check if user is already an organizer or admin
        const user = await User_1.default.findById(userId);
        if (user?.role === "organizer" || user?.role === "admin") {
            return res.status(400).json({
                success: false,
                error: "You are already an organizer or admin",
            });
        }
        // Create application
        const application = new OrganizerApplication_1.default({
            user: userId,
            organizationName,
            phoneNumber,
            organizationImage,
            description,
            status: "pending",
            appliedAt: new Date(),
        });
        await application.save();
        return res.status(201).json({
            success: true,
            message: "Organizer application submitted successfully",
            application: {
                id: application._id,
                organizationName: application.organizationName,
                phoneNumber: application.phoneNumber,
                organizationImage: application.organizationImage,
                description: application.description,
                status: application.status,
                appliedAt: application.appliedAt,
            },
        });
    }
    catch (error) {
        console.error("Submit application error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to submit application",
        });
    }
};
exports.submitApplication = submitApplication;
// Get user's application status
const getMyApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const application = await OrganizerApplication_1.default.findOne({ user: userId })
            .populate("reviewedBy", "name email");
        if (!application) {
            return res.status(404).json({
                success: false,
                error: "No application found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Application retrieved successfully",
            application: {
                id: application._id,
                organizationName: application.organizationName,
                phoneNumber: application.phoneNumber,
                organizationImage: application.organizationImage,
                description: application.description,
                status: application.status,
                adminNotes: application.adminNotes,
                appliedAt: application.appliedAt,
                reviewedAt: application.reviewedAt,
                reviewedBy: application.reviewedBy,
            },
        });
    }
    catch (error) {
        console.error("Get application error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to get application",
        });
    }
};
exports.getMyApplication = getMyApplication;
// Update user's application
const updateApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { organizationName, phoneNumber, description } = req.body;
        const organizationImage = req.file?.path;
        // Check if user has a pending application
        const application = await OrganizerApplication_1.default.findOne({ user: userId });
        if (!application) {
            return res.status(404).json({
                success: false,
                error: "No application found",
            });
        }
        // Only allow updates if application is pending
        if (application.status !== "pending") {
            return res.status(400).json({
                success: false,
                error: "Cannot update application that has been reviewed",
            });
        }
        // Update fields
        if (organizationName)
            application.organizationName = organizationName;
        if (phoneNumber)
            application.phoneNumber = phoneNumber;
        if (description !== undefined)
            application.description = description;
        if (organizationImage)
            application.organizationImage = organizationImage;
        await application.save();
        return res.status(200).json({
            success: true,
            message: "Application updated successfully",
            application: {
                id: application._id,
                organizationName: application.organizationName,
                phoneNumber: application.phoneNumber,
                organizationImage: application.organizationImage,
                description: application.description,
                status: application.status,
                appliedAt: application.appliedAt,
            },
        });
    }
    catch (error) {
        console.error("Update application error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to update application",
        });
    }
};
exports.updateApplication = updateApplication;
// Admin: Get all applications
const getAllApplications = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        // Build filter
        const filter = {};
        if (status)
            filter.status = status;
        const applications = await OrganizerApplication_1.default.find(filter)
            .populate("user", "name email")
            .populate("reviewedBy", "name email")
            .sort({ appliedAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await OrganizerApplication_1.default.countDocuments(filter);
        res.status(200).json({
            success: true,
            message: "Applications retrieved successfully",
            applications: applications.map((app) => ({
                id: app._id,
                user: app.user,
                organizationName: app.organizationName,
                phoneNumber: app.phoneNumber,
                organizationImage: app.organizationImage,
                description: app.description,
                status: app.status,
                adminNotes: app.adminNotes,
                appliedAt: app.appliedAt,
                reviewedAt: app.reviewedAt,
                reviewedBy: app.reviewedBy,
            })),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error("Get all applications error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to get applications",
        });
    }
};
exports.getAllApplications = getAllApplications;
// Admin: Get application by ID
const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await OrganizerApplication_1.default.findById(id)
            .populate("user", "name email image role")
            .populate("reviewedBy", "name email");
        if (!application) {
            return res.status(404).json({
                success: false,
                error: "Application not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Application retrieved successfully",
            application: {
                id: application._id,
                user: application.user,
                organizationName: application.organizationName,
                phoneNumber: application.phoneNumber,
                organizationImage: application.organizationImage,
                description: application.description,
                status: application.status,
                adminNotes: application.adminNotes,
                appliedAt: application.appliedAt,
                reviewedAt: application.reviewedAt,
                reviewedBy: application.reviewedBy,
            },
        });
    }
    catch (error) {
        console.error("Get application by ID error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to get application",
        });
    }
};
exports.getApplicationById = getApplicationById;
// Admin: Approve application
const approveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { adminNotes } = req.body;
        const application = await OrganizerApplication_1.default.findById(id);
        if (!application) {
            return res.status(404).json({
                success: false,
                error: "Application not found",
            });
        }
        if (application.status !== "pending") {
            return res.status(400).json({
                success: false,
                error: "Application has already been reviewed",
            });
        }
        // Update application status
        application.status = "approved";
        application.adminNotes = adminNotes;
        application.reviewedAt = new Date();
        application.reviewedBy = adminId;
        await application.save();
        // Update user role to organizer
        await User_1.default.findByIdAndUpdate(application.user, {
            role: "organizer",
        });
        return res.status(200).json({
            success: true,
            message: "Application approved successfully",
            application: {
                id: application._id,
                status: application.status,
                adminNotes: application.adminNotes,
                reviewedAt: application.reviewedAt,
                reviewedBy: adminId,
            },
        });
    }
    catch (error) {
        console.error("Approve application error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to approve application",
        });
    }
};
exports.approveApplication = approveApplication;
// Admin: Reject application
const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { adminNotes } = req.body;
        const application = await OrganizerApplication_1.default.findById(id);
        if (!application) {
            return res.status(404).json({
                success: false,
                error: "Application not found",
            });
        }
        if (application.status !== "pending") {
            return res.status(400).json({
                success: false,
                error: "Application has already been reviewed",
            });
        }
        // Update application status
        application.status = "rejected";
        application.adminNotes = adminNotes;
        application.reviewedAt = new Date();
        application.reviewedBy = adminId;
        await application.save();
        return res.status(200).json({
            success: true,
            message: "Application rejected successfully",
            application: {
                id: application._id,
                status: application.status,
                adminNotes: application.adminNotes,
                reviewedAt: application.reviewedAt,
                reviewedBy: adminId,
            },
        });
    }
    catch (error) {
        console.error("Reject application error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to reject application",
        });
    }
};
exports.rejectApplication = rejectApplication;
// Admin: Get application statistics
const getApplicationStats = async (req, res) => {
    try {
        const [pending, approved, rejected, total] = await Promise.all([
            OrganizerApplication_1.default.countDocuments({ status: "pending" }),
            OrganizerApplication_1.default.countDocuments({ status: "approved" }),
            OrganizerApplication_1.default.countDocuments({ status: "rejected" }),
            OrganizerApplication_1.default.countDocuments(),
        ]);
        res.status(200).json({
            success: true,
            message: "Application statistics retrieved successfully",
            stats: {
                pending,
                approved,
                rejected,
                total,
            },
        });
    }
    catch (error) {
        console.error("Get application stats error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to get application statistics",
        });
    }
};
exports.getApplicationStats = getApplicationStats;
//# sourceMappingURL=organizerApplication.controller.js.map