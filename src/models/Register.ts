// src/models/Registration.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IEvent } from "./Event";
import { cascadeDeleteRegistration } from "../utils/cascadeDelete";

export interface IRegistration extends Document {
  user: IUser["_id"];
  event: IEvent["_id"];
  name:string
  registeredAt: Date;
  status: "pending" | "confirmed" | "cancelled" | "failed" | "refunded";
  ticketType: string;
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
  // Attendance tracking
  isAttended: boolean;
  attendedAt?: Date;
  attendedBy?: IUser["_id"]; // Manager who marked attendance
  // Enhanced user data
  registrationNumber: string;
  phoneNumber: string;
  college: string;
  department: string;
  yearOfStudy: string;
  // Optional team registration fields
  teamType?: "individual" | "team";
  teamSize?: number;
  teamMembers?: {
    name: string;
    registrationNumber?: string;
    phoneNumber?: string;
  }[];
  // Organizer details (copied from event for reference)
  organizerDetails?: {
    logo: string;
    organizationName: string;
    organizerName: string;
  };
}

const registrationSchema = new Schema<IRegistration>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name:{type:String,required:true},
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "failed", "refunded"], 
      default: "pending" 
    },
    registeredAt: { type: Date, default: Date.now },
    ticketType: { type: String, required: true },
    amount: { type: Number, required: false },
    // Optional team registration fields
    teamType: { type: String, enum: ["individual", "team"], default: "individual" },
    teamSize: { type: Number, required: false },
    teamMembers: [{
      name: { type: String, required: false, trim: true },
      registrationNumber: { type: String, required: false },
      phoneNumber: { type: String, required: false },
    }],
    paymentOrderId: { type: String, required: false },
    paymentId: { type: String, required: false },
    paymentVerifiedAt: { type: Date, required: false },
    confirmedAt: { type: Date, required: false },
    cancelledAt: { type: Date, required: false },
    failedAt: { type: Date, required: false },
    refundedAt: { type: Date, required: false },
    hallTicket: { type: String, required: false },
    notes: { type: String, required: false },
    // Attendance tracking fields
    isAttended: { type: Boolean, default: false },
    attendedAt: { type: Date, required: false },
    attendedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
    // Enhanced user data fields
    registrationNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    yearOfStudy: { 
      type: String, 
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduate", "Other"],
      required: true 
    },
    // Organizer details (copied from event for reference)
    organizerDetails: {
      logo: { type: String, required: false },
      organizationName: { type: String, required: false, trim: true },
      organizerName: { type: String, required: false, trim: true }
    }
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

// Index for enhanced user data queries
registrationSchema.index({ registrationNumber: 1 });
registrationSchema.index({ college: 1 });
registrationSchema.index({ department: 1 });
registrationSchema.index({ yearOfStudy: 1 });

// Safe cascade delete middleware
registrationSchema.pre("findOneAndDelete", async function(this: any, next: Function) {
  try {
    const registrationId = this.getQuery()["_id"];
    if (registrationId) {
      await cascadeDeleteRegistration(registrationId.toString());
    }
    next();
  } catch (error) {
    // Continue with deletion even if cascade fails
    next();
  }
});

// Also handle direct delete operations
registrationSchema.pre("deleteOne", async function(this: any, next: Function) {
  try {
    const registrationId = this.getQuery()["_id"];
    if (registrationId) {
      await cascadeDeleteRegistration(registrationId.toString());
    }
    next();
  } catch (error) {
    // Continue with deletion even if cascade fails
    next();
  }
});

export default mongoose.model<IRegistration>("Registration", registrationSchema);
