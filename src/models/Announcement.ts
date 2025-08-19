// src/models/Announcement.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { AnnouncementType } from "../types/enums";

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

export default mongoose.model<IAnnouncement>("Announcement", announcementSchema);
