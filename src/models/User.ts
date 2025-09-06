// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../types/enums";
import { cascadeDeleteUser } from "../utils/cascadeDelete";

export interface IUser extends Document {
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  googleId?: string | null;
  password?: string | null;
  isEmailVerified: boolean;
  lastLogin?: Date | null;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    image: { type: String },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
    googleId: { type: String, sparse: true, index: true },
    password: { type: String, select: false },
    isEmailVerified: { type: Boolean, default: true }, // Always true for now
    lastLogin: { type: Date },
    refreshToken: { type: String, select: false }
  },
  { timestamps: true }
);

// Index for efficient queries
userSchema.index({ email: 1, googleId: 1 });

// Pre-save middleware to handle Google OAuth users
userSchema.pre("save", function(this: IUser, next: Function) {
  if (this.googleId) {
    this.isEmailVerified = true; // Google accounts are pre-verified
  }
  next();
});

// Safe cascade delete middleware
userSchema.pre("findOneAndDelete", async function(this: any, next: Function) {
  try {
    const userId = this.getQuery()["_id"];
    if (userId) {
      await cascadeDeleteUser(userId.toString());
    }
    next();
  } catch (error) {

    // Continue with deletion even if cascade fails
    next();
  }
});

// Also handle direct delete operations
userSchema.pre("deleteOne", async function(this: any, next: Function) {
  try {
    const userId = this.getQuery()["_id"];
    if (userId) {
      await cascadeDeleteUser(userId.toString());
    }
    next();
  } catch (error) {
    // Continue with deletion even if cascade fails
    next();
  }
});

export default mongoose.model<IUser>("User", userSchema);
