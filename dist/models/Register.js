"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Registration.ts
const mongoose_1 = __importStar(require("mongoose"));
const cascadeDelete_1 = require("../utils/cascadeDelete");
const registrationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose_1.Schema.Types.ObjectId, ref: "Event", required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "failed", "refunded"],
        default: "pending"
    },
    registeredAt: { type: Date, default: Date.now },
    ticketType: { type: String, required: true },
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
    dietaryPreferences: {
        type: String,
        enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"],
        required: false
    },
    specialRequirements: { type: String, required: false },
    emergencyContact: {
        name: { type: String, required: false },
        phone: { type: String, required: false },
        relationship: { type: String, required: false }
    },
    tshirtSize: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "No T-shirt"],
        required: false
    }
}, { timestamps: true });
// Index for unique user-event combination (only for confirmed registrations)
registrationSchema.index({ user: 1, event: 1, status: 1 }, {
    unique: true,
    partialFilterExpression: { status: "confirmed" }
});
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
registrationSchema.pre("findOneAndDelete", async function (next) {
    try {
        const registrationId = this.getQuery()["_id"];
        if (registrationId) {
            console.log(`Registration deletion triggered, starting safe cascade delete for: ${registrationId}`);
            await (0, cascadeDelete_1.cascadeDeleteRegistration)(registrationId.toString());
        }
        next();
    }
    catch (error) {
        console.error("Error in registration cascade delete middleware:", error);
        // Continue with deletion even if cascade fails
        next();
    }
});
// Also handle direct delete operations
registrationSchema.pre("deleteOne", async function (next) {
    try {
        const registrationId = this.getQuery()["_id"];
        if (registrationId) {
            console.log(`Registration deletion triggered, starting safe cascade delete for: ${registrationId}`);
            await (0, cascadeDelete_1.cascadeDeleteRegistration)(registrationId.toString());
        }
        next();
    }
    catch (error) {
        console.error("Error in registration cascade delete middleware:", error);
        // Continue with deletion even if cascade fails
        next();
    }
});
exports.default = mongoose_1.default.model("Registration", registrationSchema);
//# sourceMappingURL=Register.js.map