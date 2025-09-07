// src/controllers/certificate.controller.ts
import { Request, Response } from "express";
import Registration from "../models/Register";
import Event from "../models/Event";
import User from "../models/User";
import {
  generateStreamingTemplateCertificate,
  getAvailableTemplates,
  validateTemplateCertificateOptions,
  ITemplateCertificateOptions
} from "../utils/sharpTemplateGenerator";

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
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get certificate data (without generation)
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

    // Get registration data
    const registration = await Registration.findById(registrationId)
      .populate('user', 'name email')
      .populate('event', 'title date venue location')
      .populate('attendedBy', 'name');

    if (!registration) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }

    if (!registration.isAttended) {
      res.status(400).json({ error: "Cannot generate certificate for non-attended event" });
      return;
    }

    const user = registration.user as any;
    const event = registration.event as any;
    const attendedBy = registration.attendedBy as any;

    const certificateData = {
      eventTitle: event.title,
      userName: user.name,
      eventDate: event.date,
      eventVenue: event.venue,
      eventLocation: event.location,
      greeting: 'Congratulations on successfully completing',
      issuedAt: registration.attendedAt || new Date(),
      issuedBy: attendedBy?.name || 'Event Manager',
      registrationId: (registration._id as any).toString(),
      eventId: (event._id as any).toString(),
      userId: (user._id as any).toString()
    };

    res.json({
      success: true,
      certificateData
    });

  } catch (error) {
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
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===================
// TEMPLATE-BASED CERTIFICATE GENERATION
// ===================

// Generate template-based certificate for a specific registration
export const generateTemplateCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;
    const managerId = (req as any).user?.id;
    const { 
      templateId,
      includeQRCode,
      customText,
      fontSize,
      textColor,
      qrCodeColor
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

    // Template certificate options
    const options: ITemplateCertificateOptions = {
      templateId: templateId || 'template1',
      includeQRCode: includeQRCode || false,
      customText: customText || {},
      fontSize: fontSize || 'medium',
      textColor: textColor || undefined,
      qrCodeColor: qrCodeColor || undefined
    };

    // Validate options
    const validationErrors = validateTemplateCertificateOptions(options);
    if (validationErrors.length > 0) {
      res.status(400).json({ 
        error: "Invalid template certificate options", 
        details: validationErrors 
      });
      return;
    }

    // Get registration data
    const user = registration.user as any;
    const event = registration.event as any;
    const attendedBy = registration.attendedBy as any;

    const certificateData = {
      eventTitle: event.title,
      userName: user.name,
      eventDate: event.date,
      eventVenue: event.venue,
      eventLocation: event.location,
      greeting: 'Congratulations on successfully completing',
      issuedAt: registration.attendedAt || new Date(),
      issuedBy: attendedBy?.name || 'Event Manager',
      registrationId: (registration._id as any).toString(),
      eventId: (event._id as any).toString(),
      userId: (user._id as any).toString()
    };

    // Use template-based generation
    await generateStreamingTemplateCertificate(certificateData, options, res);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Generate template-based certificate for student's own registration
export const generateStudentTemplateCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;
    const userId = (req as any).user?.id;
    const { templateId } = req.body;

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
    
    if (registrationUserId !== userId) {
      res.status(403).json({ error: "You can only download certificates for your own registrations" });
      return;
    }

    // Check if attendance is marked
    if (!registration.isAttended) {
      res.status(400).json({ error: "Cannot generate certificate for non-attended event" });
      return;
    }

    // Use default template options for students
    const options: ITemplateCertificateOptions = {
      templateId: templateId || 'template1',
      includeQRCode: true,
      fontSize: 'medium',
      customText: {
        title: 'EventViewz Organization',
        greeting: 'This is to certify that',
        completionText: 'has successfully completed'
      }
    };

    // Get registration data
    const user = registration.user as any;
    const event = registration.event as any;
    const attendedBy = registration.attendedBy as any;

    const certificateData = {
      eventTitle: event.title,
      userName: user.name,
      eventDate: event.date,
      eventVenue: event.venue,
      eventLocation: event.location,
      greeting: 'Congratulations on successfully completing',
      issuedAt: registration.attendedAt || new Date(),
      issuedBy: attendedBy?.name || 'Event Manager',
      registrationId: (registration._id as any).toString(),
      eventId: (event._id as any).toString(),
      userId: (user._id as any).toString()
    };

    // Use template-based generation
    await generateStreamingTemplateCertificate(certificateData, options, res);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get available certificate templates
export const getCertificateTemplates = async (req: Request, res: Response): Promise<void> => {
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

    const templates = getAvailableTemplates();

    res.json({
      success: true,
      templates,
      defaultOptions: {
        templateId: 'template1',
        includeQRCode: false,
        fontSize: 'medium',
        customText: {
          title: 'EventViewz Organization',
          greeting: 'This is to certify that',
          completionText: 'has successfully completed'
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};