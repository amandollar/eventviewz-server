import Event from "../models/Event";
import { generateHallTicket } from "./hallTicket";

export const confirmRegistrationEffects = async (registration: any) => {
  const eventDoc: any = await Event.findById(registration.event);
  if (!eventDoc) return { registration, event: null };

  // Decrement ticket availability when applicable
  if (registration.ticketType && Array.isArray(eventDoc.tickets)) {
    const ticketIndex = eventDoc.tickets.findIndex((t: any) => t.type === registration.ticketType);
    if (ticketIndex !== -1) {
      eventDoc.tickets[ticketIndex].available = Math.max(0, (eventDoc.tickets[ticketIndex].available || 0) - 1);
    }
  }

  // Add participant and increment count
  if (!eventDoc.participants.some((p: any) => String(p) === String(registration.user))) {
    eventDoc.participants.push(registration.user);
  }
  eventDoc.currentParticipants = Math.max(0, (eventDoc.currentParticipants || 0) + 1);

  await eventDoc.save();

  // Generate hall ticket if not present
  if (!registration.hallTicket) {
    const hallTicket = await generateHallTicket(String(registration._id));
    registration.hallTicket = JSON.stringify(hallTicket);
  }
  if (!registration.confirmedAt) {
    registration.confirmedAt = new Date();
  }
  await registration.save();

  return { registration, event: eventDoc };
};

export const revertConfirmedRegistrationEffects = async (registration: any) => {
  const eventDoc: any = await Event.findById(registration.event);
  if (!eventDoc) return { event: null };

  // Remove participant and decrement count
  eventDoc.participants = eventDoc.participants.filter((p: any) => String(p) !== String(registration.user));
  eventDoc.currentParticipants = Math.max(0, (eventDoc.currentParticipants || 0) - 1);

  // Restore ticket availability when applicable
  if (registration.ticketType && Array.isArray(eventDoc.tickets)) {
    const ticketIndex = eventDoc.tickets.findIndex((t: any) => t.type === registration.ticketType);
    if (ticketIndex !== -1) {
      eventDoc.tickets[ticketIndex].available = (eventDoc.tickets[ticketIndex].available || 0) + 1;
    }
  }

  await eventDoc.save();
  return { event: eventDoc };
};


