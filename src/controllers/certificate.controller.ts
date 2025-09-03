// src/controllers/certificate.controller.ts
import { Request, Response } from "express";
import Registration from "../models/Register";
import Event from "../models/Event";
import User from "../models/User";
import { 
  generateCertificatePDF, 
  generateCertificateData, 
  generateStreamingCertificate,
  validateCertificateOptions,
  getAvailableThemes,
  ICertificateOptions 
} from "../utils/certificateGenerator";

// Mark attendance for a user at an event
export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;
    const managerId = (req as any).user?.id;

    if (!managerId) {
      res.status(401).json({ error: "Manager not authenticated" });
      return;
    }

    // Check if manager has permission (admin or organizer)
    const manager = await User.findById(managerId);
    if (!manager || !['admin', 'organizer'].includes(manager.role)) {
      res.status(403).json({ error: "Insufficient permissions to mark attendance" });
      return;
    }

    // Find registration
    const registration = await Registration.findById(registrationId)
      .populate('event', 'title date');

    if (!registration) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }

    // Check if event has already passed
    const event = registration.event as any;
    const eventDate = new Date(event.date);
    const today = new Date();
    if (eventDate > today) {
      res.status(400).json({ error: "Cannot mark attendance for future events" });
      return;
    }

    // Check if already marked as attended
    if (registration.isAttended) {
      res.status(400).json({ error: "Attendance already marked for this registration" });
      return;
    }

    // Mark attendance
    registration.isAttended = true;
    registration.attendedAt = new Date();
    registration.attendedBy = managerId;
    await registration.save();

    res.json({
      success: true,
      message: "Attendance marked successfully",
      registration: {
        id: registration._id,
        eventTitle: (registration.event as any).title,
        userName: (await User.findById(registration.user))?.name || 'Unknown User',
        attendedAt: registration.attendedAt,
        markedBy: manager.name
      }
    });

  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Generate certificate for a specific registration
export const generateCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;
    const managerId = (req as any).user?.id;
    const { 
      template, 
      greeting, 
      includeQRCode, 
      primaryColor, 
      secondaryColor,
      theme,
      includeLogo,
      includeSignature,
      fontSize
    } = req.body;

    if (!managerId) {
      res.status(401).json({ error: "Manager not authenticated" });
      return;
    }

    // Check if manager has permission
    const manager = await User.findById(managerId);
    if (!manager || !['admin', 'organizer'].includes(manager.role)) {
      res.status(403).json({ error: "Insufficient permissions to generate certificates" });
      return;
    }

    // Check if registration exists and attendance is marked
    const registration = await Registration.findById(registrationId)
      .populate('user', 'name email')
      .populate('event', 'title date venue location');

    if (!registration) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }

    if (!registration.isAttended) {
      res.status(400).json({ error: "Cannot generate certificate for non-attended event" });
      return;
    }

    // Certificate options with enhanced features
    const options: ICertificateOptions = {
      template: template || 'classic',
      greeting: greeting || 'Congratulations on successfully completing',
      includeQRCode: includeQRCode || false,
      primaryColor: primaryColor || undefined,
      secondaryColor: secondaryColor || undefined,
      theme: theme || 'corporate',
      includeLogo: includeLogo || false,
      includeSignature: includeSignature || false,
      fontSize: fontSize || 'medium'
    };

    // Validate options
    const validationErrors = validateCertificateOptions(options);
    if (validationErrors.length > 0) {
      res.status(400).json({ 
        error: "Invalid certificate options", 
        details: validationErrors 
      });
      return;
    }

    // Use streaming for better performance
    await generateStreamingCertificate(registrationId!, options, res);

  } catch (error) {
    console.error("Generate certificate error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get certificate data (without PDF generation)
export const getCertificateData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;
    const managerId = (req as any).user?.id;

    if (!managerId) {
      res.status(401).json({ error: "Manager not authenticated" });
      return;
    }

    // Check if manager has permission
    const manager = await User.findById(managerId);
    if (!manager || !['admin', 'organizer'].includes(manager.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    // Get certificate data
    const certificateData = await generateCertificateData(registrationId!);

    res.json({
      success: true,
      certificateData
    });

  } catch (error) {
    console.error("Get certificate data error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get available certificate themes and options
export const getCertificateThemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const managerId = (req as any).user?.id;

    if (!managerId) {
      res.status(401).json({ error: "Manager not authenticated" });
      return;
    }

    // Check if manager has permission
    const manager = await User.findById(managerId);
    if (!manager || !['admin', 'organizer'].includes(manager.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    const themes = getAvailableThemes();

    res.json({
      success: true,
      themes,
      templates: ['classic', 'modern', 'elegant'],
      fontSizes: ['small', 'medium', 'large'],
      defaultOptions: {
        template: 'classic',
        theme: 'corporate',
        fontSize: 'medium',
        includeQRCode: false,
        includeLogo: false,
        includeSignature: false
      }
    });

  } catch (error) {
    console.error("Get certificate themes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark attendance for multiple users (bulk operation)
export const markBulkAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationIds } = req.body;
    const managerId = (req as any).user?.id;

    if (!managerId) {
      res.status(401).json({ error: "Manager not authenticated" });
      return;
    }

    // Check if manager has permission
    const manager = await User.findById(managerId);
    if (!manager || !['admin', 'organizer'].includes(manager.role)) {
      res.status(403).json({ error: "Insufficient permissions to mark attendance" });
      return;
    }

    if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
      res.status(400).json({ error: "Registration IDs array is required" });
      return;
    }

    const results = [];
    const errors = [];

    for (const registrationId of registrationIds) {
      try {
        const registration = await Registration.findById(registrationId)
          .populate('event', 'title date')
          .populate('user', 'name');

        if (!registration) {
          errors.push({ registrationId, error: "Registration not found" });
          continue;
        }

        if (registration.isAttended) {
          errors.push({ registrationId, error: "Already marked as attended" });
          continue;
        }

        // Check if event has passed
        const event = registration.event as any;
        const eventDate = new Date(event.date);
        const today = new Date();
        if (eventDate > today) {
          errors.push({ registrationId, error: "Event has not occurred yet" });
          continue;
        }

        // Mark attendance
        registration.isAttended = true;
        registration.attendedAt = new Date();
        registration.attendedBy = managerId;
        await registration.save();

        results.push({
          registrationId,
          eventTitle: (registration.event as any).title,
          userName: (registration.user as any).name,
          attendedAt: registration.attendedAt
        });

      } catch (error) {
        errors.push({ registrationId, error: (error as any).message });
      }
    }

    res.json({
      success: true,
      message: `Processed ${registrationIds.length} registrations`,
      results,
      errors,
      summary: {
        total: registrationIds.length,
        successful: results.length,
        failed: errors.length
      }
    });

  } catch (error) {
    console.error("Bulk attendance error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get attendance statistics for an event
export const getEventAttendanceStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const managerId = (req as any).user?.id;

    if (!managerId) {
      res.status(401).json({ error: "Manager not authenticated" });
      return;
    }

    // Check if manager has permission
    const manager = await User.findById(managerId);
    if (!manager || !['admin', 'organizer'].includes(manager.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    // Get attendance statistics
    const totalRegistrations = await Registration.countDocuments({ 
      event: eventId, 
      status: 'confirmed' 
    });

    const attendedRegistrations = await Registration.countDocuments({ 
      event: eventId, 
      status: 'confirmed',
      isAttended: true 
    });

    const pendingAttendance = totalRegistrations - attendedRegistrations;

    // Get recent attendance
    const recentAttendance = await Registration.find({
      event: eventId,
      isAttended: true
    })
    .populate('user', 'name')
    .populate('attendedBy', 'name')
    .sort({ attendedAt: -1 })
    .limit(10);

    res.json({
      success: true,
      event: {
        id: event._id,
        title: event.title,
        date: event.date
      },
      statistics: {
        totalRegistrations,
        attendedRegistrations,
        pendingAttendance,
        attendanceRate: totalRegistrations > 0 ? (attendedRegistrations / totalRegistrations * 100).toFixed(2) : 0
      },
      recentAttendance: recentAttendance.map(reg => ({
        userName: (reg.user as any).name,
        attendedAt: reg.attendedAt,
        markedBy: (reg.attendedBy as any).name
      }))
    });

  } catch (error) {
    console.error("Get attendance stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Generate certificate for student's own registration
export const generateStudentCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Check if registration exists and belongs to the authenticated user
    const registration = await Registration.findById(registrationId)
      .populate('user', 'name email')
      .populate('event', 'title date venue location');

    if (!registration) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }

    // Check if the registration belongs to the authenticated user
    const registrationUserId = typeof registration.user === 'string' 
      ? registration.user 
      : (registration.user as any)?._id?.toString();
    
    console.log('Certificate generation debug:', {
      userId,
      registrationUserId,
      registrationUser: registration.user,
      userType: typeof registration.user,
      isMatch: registrationUserId === userId
    });
    
    if (registrationUserId !== userId) {
      console.log('User validation failed:', { userId, registrationUserId });
      res.status(403).json({ error: "You can only download certificates for your own registrations" });
      return;
    }

    // Check if attendance is marked
    if (!registration.isAttended) {
      res.status(400).json({ error: "Cannot generate certificate for non-attended event" });
      return;
    }

    // Use default certificate options for students
    const options: ICertificateOptions = {
      template: 'classic',
      greeting: 'Congratulations on successfully completing',
      includeQRCode: true,
      theme: 'corporate',
      includeLogo: true,
      includeSignature: true,
      fontSize: 'medium'
    };

    // Use streaming for better performance
    await generateStreamingCertificate(registrationId!, options, res);

  } catch (error) {
    console.error("Generate student certificate error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all registrations for an event with attendance status
export const getEventRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const managerId = (req as any).user?.id;

    if (!managerId) {
      res.status(401).json({ error: "Manager not authenticated" });
      return;
    }

    // Check if manager has permission
    const manager = await User.findById(managerId);
    if (!manager || !['admin', 'organizer'].includes(manager.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    // Get all registrations for the event
    const registrations = await Registration.find({ 
      event: eventId,
      status: 'confirmed'
    })
    .populate('user', 'name email')
    .populate('attendedBy', 'name')
    .sort({ registeredAt: 1 });

    const formattedRegistrations = registrations.map(reg => ({
      id: reg._id,
      userName: (reg.user as any).name,
      userEmail: (reg.user as any).email,
      registrationNumber: reg.registrationNumber,
      college: reg.college,
      department: reg.department,
      yearOfStudy: reg.yearOfStudy,
      registeredAt: reg.registeredAt,
      isAttended: reg.isAttended,
      attendedAt: reg.attendedAt,
      attendedBy: reg.attendedBy ? (reg.attendedBy as any).name : null,
      canGenerateCertificate: reg.isAttended
    }));

    res.json({
      success: true,
      eventId,
      registrations: formattedRegistrations,
      summary: {
        total: formattedRegistrations.length,
        attended: formattedRegistrations.filter(r => r.isAttended).length,
        pending: formattedRegistrations.filter(r => !r.isAttended).length
      }
    });

  } catch (error) {
    console.error("Get event registrations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
