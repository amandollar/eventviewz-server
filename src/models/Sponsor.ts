// src/models/Sponsor.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISponsor extends Document {
  title: string;
  description: string;
  publisher: string;
  images: string[];
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sponsorSchema = new Schema<ISponsor>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    publisher: { type: String, required: true, trim: true, maxlength: 100 },
    images: [{ type: String, required: true }], // Array of image URLs
    isActive: { type: Boolean, default: true },
    expiresAt: { 
      type: Date, 
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    },
  },
  { timestamps: true }
);

// Index for active sponsors and expiration
sponsorSchema.index({ isActive: 1, expiresAt: 1 });

// Auto-deactivate expired sponsors
sponsorSchema.pre('find', function() {
  this.where({ 
    isActive: true, 
    expiresAt: { $gt: new Date() } 
  });
});

export default mongoose.model<ISponsor>("Sponsor", sponsorSchema);
