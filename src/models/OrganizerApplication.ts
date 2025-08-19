import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IOrganizerApplication extends Document {
  user: IUser["_id"];
  organizationName: string;
  phoneNumber: string;
  organizationImage?: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: IUser["_id"];
}

const organizerApplicationSchema = new Schema<IOrganizerApplication>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true // One application per user
    },
    organizationName: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    phoneNumber: { 
      type: String, 
      required: true,
      trim: true,
      match: /^[+]?[\d\s\-\(\)]+$/ // Basic phone number validation
    },
    organizationImage: { 
      type: String, 
      required: false 
    },
    description: { 
      type: String, 
      required: false,
      maxlength: 500
    },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    adminNotes: { 
      type: String, 
      required: false,
      maxlength: 200
    },
    appliedAt: { 
      type: Date, 
      default: Date.now 
    },
    reviewedAt: { 
      type: Date, 
      required: false 
    },
    reviewedBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: false 
    }
  },
  { timestamps: true }
);

// Indexes for efficient querying
organizerApplicationSchema.index({ status: 1 });
organizerApplicationSchema.index({ user: 1 });
organizerApplicationSchema.index({ appliedAt: -1 });

export default mongoose.model<IOrganizerApplication>("OrganizerApplication", organizerApplicationSchema);
