// src/models/Announcement.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { AnnouncementType } from "../types/enums";
import { cascadeDeleteAnnouncement } from "../utils/cascadeDelete";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: AnnouncementType;
  createdBy?: IUser["_id"];
  date: Date;
  isActive: boolean;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: { type: String, enum: Object.values(AnnouncementType), required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

announcementSchema.index({ type: 1, date: -1 }); // quick filtering

// Safe cascade delete middleware
announcementSchema.pre("findOneAndDelete", async function(this: any, next: Function) {
  try {
    const announcementId = this.getQuery()["_id"];
    if (announcementId) {
      console.log(`Announcement deletion triggered, starting safe cascade delete for: ${announcementId}`);
      await cascadeDeleteAnnouncement(announcementId.toString());
    }
    next();
  } catch (error) {
    console.error("Error in announcement cascade delete middleware:", error);
    // Continue with deletion even if cascade fails
    next();
  }
});

// Also handle direct delete operations
announcementSchema.pre("deleteOne", async function(this: any, next: Function) {
  try {
    const announcementId = this.getQuery()["_id"];
    if (announcementId) {
      console.log(`Announcement deletion triggered, starting safe cascade delete for: ${announcementId}`);
      await cascadeDeleteAnnouncement(announcementId.toString());
    }
    next();
  } catch (error) {
    console.error("Error in announcement cascade delete middleware:", error);
    // Continue with deletion even if cascade fails
    next();
  }
});

export default mongoose.model<IAnnouncement>("Announcement", announcementSchema);
