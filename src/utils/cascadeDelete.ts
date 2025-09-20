import mongoose from "mongoose";

/**
 * Utility functions for safe cascade deletion
 * Handles edge cases when referenced documents don't exist
 */

/**
 * Safely delete multiple documents by query
 * Returns the number of documents actually deleted
 */
export const safeDeleteMany = async (
  modelName: string, 
  query: any
): Promise<number> => {
  try {
    const model = mongoose.model(modelName);
    const result = await model.deleteMany(query);
    return result.deletedCount || 0;
  } catch (error) {
    console.warn(`Warning: Failed to delete ${modelName} documents:`, error);
    return 0;
  }
};

/**
 * Safely delete a single document by ID
 * Returns true if deleted, false if not found or error
 */
export const safeDeleteOne = async (
  modelName: string, 
  id: string
): Promise<boolean> => {
  try {
    const model = mongoose.model(modelName);
    const result = await model.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.warn(`Warning: Failed to delete ${modelName} document ${id}:`, error);
    return false;
  }
};

/**
 * Check if a document exists before attempting operations
 */
export const documentExists = async (
  modelName: string, 
  query: any
): Promise<boolean> => {
  try {
    const model = mongoose.model(modelName);
    const count = await model.countDocuments(query);
    return count > 0;
  } catch (error) {
    console.warn(`Warning: Failed to check ${modelName} document existence:`, error);
    return false;
  }
};

/**
 * Safe cascade delete for User model
 * Deletes all related documents when a user is deleted
 */
export const cascadeDeleteUser = async (userId: string): Promise<void> => {

  
  // Check if user exists first
  const userExists = await documentExists("User", { _id: userId });
  if (!userExists) {
    return;
  }

  // Delete registrations
  const registrationsDeleted = await safeDeleteMany("Registration", { user: userId });

  // Delete organizer applications
  const applicationsDeleted = await safeDeleteMany("OrganizerApplication", { user: userId });


  // Delete events created by user
  const eventsDeleted = await safeDeleteMany("Event", { createdBy: userId });


  // Delete announcements created by user
  const announcementsDeleted = await safeDeleteMany("Announcement", { createdBy: userId });

;
};

/**
 * Safe cascade delete for Event model
 * Deletes all related documents when an event is deleted
 */
export const cascadeDeleteEvent = async (eventId: string): Promise<void> => {

  
  // Check if event exists first
  const eventExists = await documentExists("Event", { _id: eventId });
  if (!eventExists) {
    return;
  }

  // Delete registrations for this event
  const registrationsDeleted = await safeDeleteMany("Registration", { event: eventId });

  // Note: Certificate model not implemented yet, skipping certificate deletion


};

/**
 * Safe cascade delete for Registration model
 * Handles any cleanup needed when a registration is deleted
 */
export const cascadeDeleteRegistration = async (registrationId: string): Promise<void> => {

  
  // Check if registration exists first
  const registrationExists = await documentExists("Registration", { _id: registrationId });
  if (!registrationExists) {
    return;
  }

  // Get registration details for cleanup
  try {
    const Registration = mongoose.model("Registration");
    const registration = await Registration.findById(registrationId);
    
    if (registration) {
      // Update event participant count if registration was confirmed
      if (registration.status === "confirmed") {
        const Event = mongoose.model("Event");
        await Event.findByIdAndUpdate(
          registration.event,
          { $inc: { currentParticipants: -1 } }
        );
      }
    }
  } catch (error) {
    console.warn(`Warning: Failed to update event participant count:`, error);
  }

};

/**
 * Safe cascade delete for Announcement model
 * Handles any cleanup needed when an announcement is deleted
 */
export const cascadeDeleteAnnouncement = async (announcementId: string): Promise<void> => {
  
  // Check if announcement exists first
  const announcementExists = await documentExists("Announcement", { _id: announcementId });
  if (!announcementExists) {
    return;
  }

  // Add any announcement-specific cleanup here
  
};

/**
 * Safe cascade delete for Sponsor model
 * Handles any cleanup needed when a sponsor is deleted
 */
export const cascadeDeleteSponsor = async (sponsorId: string): Promise<void> => {

  
  // Check if sponsor exists first
  const sponsorExists = await documentExists("Sponsor", { _id: sponsorId });
  if (!sponsorExists) {
    return;
  }

  // Add any sponsor-specific cleanup here
};

/**
 * Safe cascade delete for OrganizerApplication model
 * Handles any cleanup needed when an application is deleted
 */
export const cascadeDeleteOrganizerApplication = async (applicationId: string): Promise<void> => {

  
  // Check if application exists first
  const applicationExists = await documentExists("OrganizerApplication", { _id: applicationId });
  if (!applicationExists) {
    return;
  }

  // Add any application-specific cleanup here
  // For now, just log completion
};

/**
 * Generic safe cascade delete function
 * Automatically determines the model and calls appropriate cascade function
 */
export const safeCascadeDelete = async (
  modelName: string, 
  documentId: string
): Promise<void> => {
  switch (modelName.toLowerCase()) {
    case "user":
      await cascadeDeleteUser(documentId);
      break;
    case "event":
      await cascadeDeleteEvent(documentId);
      break;
    case "registration":
      await cascadeDeleteRegistration(documentId);
      break;
    case "announcement":
      await cascadeDeleteAnnouncement(documentId);
      break;
    case "sponsor":
      await cascadeDeleteSponsor(documentId);
      break;
    case "organizerapplication":
      await cascadeDeleteOrganizerApplication(documentId);
      break;
    default:
      console.warn(`No cascade delete function defined for model: ${modelName}`);
  }
};
