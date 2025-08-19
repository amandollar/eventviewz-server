// src/models/Registration.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IEvent } from "./Event";

export interface IRegistration extends Document {
  user: IUser["_id"];
  event: IEvent["_id"];
  registeredAt: Date;
  status: "registered" | "attended" | "cancelled";
}

const registrationSchema = new Schema<IRegistration>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: { type: String, enum: ["registered", "attended", "cancelled"], default: "registered" },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model<IRegistration>("Registration", registrationSchema);
