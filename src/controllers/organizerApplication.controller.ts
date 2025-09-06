import { Request, Response } from "express";
import OrganizerApplication from "../models/OrganizerApplication";
import User from "../models/User";

// Submit organizer application
export const submitApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { organizationName, phoneNumber, description } = req.body;
    const organizationImage = req.file?.path; // From multer

    // Check if user already has an application
    const existingApplication = await OrganizerApplication.findOne({ user: userId });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: "You already have a pending application",
      });
    }

    // Check if user is already an organizer or admin
    const user = await User.findById(userId);
    if (user?.role === "organizer" || user?.role === "admin") {
      return res.status(400).json({
        success: false,
        error: "You are already an organizer or admin",
      });
    }

    // Create application
    const application = new OrganizerApplication({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to submit application",
    });
  }
};

// Get user's application status
export const getMyApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const application = await OrganizerApplication.findOne({ user: userId })
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to get application",
    });
  }
};

// Update user's application
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { organizationName, phoneNumber, description } = req.body;
    const organizationImage = req.file?.path;

    // Check if user has a pending application
    const application = await OrganizerApplication.findOne({ user: userId });
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
    if (organizationName) application.organizationName = organizationName;
    if (phoneNumber) application.phoneNumber = phoneNumber;
    if (description !== undefined) application.description = description;
    if (organizationImage) application.organizationImage = organizationImage;

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update application",
    });
  }
};

// Admin: Get all applications
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Build filter
    const filter: any = {};
    if (status) filter.status = status;

    const applications = await OrganizerApplication.find(filter)
      .populate("user", "name email")
      .populate("reviewedBy", "name email")
      .sort({ appliedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await OrganizerApplication.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Applications retrieved successfully",
      applications: applications.map((app: any) => ({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get applications",
    });
  }
};

// Admin: Get application by ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const application = await OrganizerApplication.findById(id)
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to get application",
    });
  }
};

// Admin: Approve application
export const approveApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user.id;
    const { adminNotes } = req.body;

    const application = await OrganizerApplication.findById(id);
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
    await User.findByIdAndUpdate(application.user, {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to approve application",
    });
  }
};

// Admin: Reject application
export const rejectApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user.id;
    const { adminNotes } = req.body;

    const application = await OrganizerApplication.findById(id);
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to reject application",
    });
  }
};

// Admin: Get application statistics
export const getApplicationStats = async (req: Request, res: Response) => {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      OrganizerApplication.countDocuments({ status: "pending" }),
      OrganizerApplication.countDocuments({ status: "approved" }),
      OrganizerApplication.countDocuments({ status: "rejected" }),
      OrganizerApplication.countDocuments(),
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get application statistics",
    });
  }
};
