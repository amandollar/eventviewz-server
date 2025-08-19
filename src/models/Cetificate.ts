// src/models/Certificate.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IEvent } from "./Event";

export interface ICertificate extends Document {
  event: IEvent["_id"];
  user: IUser["_id"];
  issuedAt: Date;
  fileUrl: string;
  issuedBy: IUser["_id"];
}

const certificateSchema = new Schema<ICertificate>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    issuedAt: { type: Date, default: Date.now },
    fileUrl: { type: String, required: true },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

certificateSchema.index({ event: 1, user: 1 }, { unique: true }); 

export default mongoose.model<ICertificate>("Certificate", certificateSchema);
