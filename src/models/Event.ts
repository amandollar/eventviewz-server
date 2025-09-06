// src/models/Event.ts
import mongoose, { Schema, Document } from "mongoose";
import { EventCategory } from "../types/enums";
import { IUser } from "./User";
import { cascadeDeleteEvent } from "../utils/cascadeDelete";

export interface ITicket {
  type: string;      // e.g. "VIP", "General", "Student"
  price: number;     // ticket price
  available: number; // how many tickets are available
}

export interface IEvent extends Document {
  title: string;
  description?: string;
  image: string;
  date: Date;
  startTime: string; // e.g., "14:30" (24-hour format)
  endTime: string;   // e.g., "16:30" (24-hour format)
  venue: string;     // specific venue name
  location?: string; // general location/address
  category: EventCategory;
  createdBy: IUser["_id"];
  participants: IUser["_id"][];
  maxParticipants?: number;
  currentParticipants: number;
  isActive: boolean;
  tickets: ITicket[];
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    type: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    available: { type: Number, default: 100, min: 0 },
  },
  { _id: false } // no need for separate _id per ticket
);

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true }, // URL of event poster/banner
    date: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true }, // e.g., "14:30"
    endTime: { type: String, required: true, trim: true },   // e.g., "16:30"
    venue: { type: String, required: true, trim: true },     // specific venue name
    location: { type: String }, // general location/address
    category: { type: String, enum: Object.values(EventCategory), required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    maxParticipants: { type: Number, default: 100 },
    currentParticipants: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },

    // Ticket categories (VIP, Regular, etc)
    tickets: { type: [ticketSchema], default: [] ,required: true},
  },
  { timestamps: true }
);

// Safe cascade delete middleware
eventSchema.pre("findOneAndDelete", async function(this: any, next: Function) {
  try {
    const eventId = this.getQuery()["_id"];
    if (eventId) {
      await cascadeDeleteEvent(eventId.toString());
    }
    next();
  } catch (error) {

    // Continue with deletion even if cascade fails
    next();
  }
});

// Also handle direct delete operations
eventSchema.pre("deleteOne", async function(this: any, next: Function) {
  try {
    const eventId = this.getQuery()["_id"];
    if (eventId) {
      await cascadeDeleteEvent(eventId.toString());
    }
    next();
  } catch (error) {
    next();
  }
});

// Text index for search
eventSchema.index({ title: "text", description: "text" });

export default mongoose.model<IEvent>("Event", eventSchema);
