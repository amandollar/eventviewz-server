// src/models/Registration.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IEvent } from "./Event";

export interface IRegistration extends Document {
  user: IUser["_id"];
  event: IEvent["_id"];
  registeredAt: Date;
  status: "pending" | "confirmed" | "cancelled" | "failed" | "refunded";
  ticketType?: string;
  amount?: number;
  paymentOrderId?: string;
  paymentId?: string;
  paymentVerifiedAt?: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  hallTicket?: string;
  notes?: string;
}

const registrationSchema = new Schema<IRegistration>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "failed", "refunded"], 
      default: "pending" 
    },
    registeredAt: { type: Date, default: Date.now },
    ticketType: { type: String, required: false },
    amount: { type: Number, required: false },
    paymentOrderId: { type: String, required: false },
    paymentId: { type: String, required: false },
    paymentVerifiedAt: { type: Date, required: false },
    confirmedAt: { type: Date, required: false },
    cancelledAt: { type: Date, required: false },
    failedAt: { type: Date, required: false },
    refundedAt: { type: Date, required: false },
    hallTicket: { type: String, required: false },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

// Index for unique user-event combination (only for confirmed registrations)
registrationSchema.index(
  { user: 1, event: 1, status: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { status: "confirmed" } 
  }
);

// Index for payment tracking
registrationSchema.index({ paymentOrderId: 1 });
registrationSchema.index({ paymentId: 1 });
registrationSchema.index({ status: 1 });

export default mongoose.model<IRegistration>("Registration", registrationSchema);
