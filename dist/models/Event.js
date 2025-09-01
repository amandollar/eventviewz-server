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
// src/models/Event.ts
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("../types/enums");
const cascadeDelete_1 = require("../utils/cascadeDelete");
const ticketSchema = new mongoose_1.Schema({
    type: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    available: { type: Number, default: 100, min: 0 },
}, { _id: false } // no need for separate _id per ticket
);
const eventSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true }, // URL of event poster/banner
    date: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true }, // e.g., "14:30"
    endTime: { type: String, required: true, trim: true }, // e.g., "16:30"
    venue: { type: String, required: true, trim: true }, // specific venue name
    location: { type: String }, // general location/address
    category: { type: String, enum: Object.values(enums_1.EventCategory), required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    maxParticipants: { type: Number, default: 100 },
    currentParticipants: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    // Ticket categories (VIP, Regular, etc
    tickets: { type: [ticketSchema], default: [], required: true },
}, { timestamps: true });
// Safe cascade delete middleware
eventSchema.pre("findOneAndDelete", async function (next) {
    try {
        const eventId = this.getQuery()["_id"];
        if (eventId) {
            console.log(`Event deletion triggered, starting safe cascade delete for: ${eventId}`);
            await (0, cascadeDelete_1.cascadeDeleteEvent)(eventId.toString());
        }
        next();
    }
    catch (error) {
        console.error("Error in event cascade delete middleware:", error);
        // Continue with deletion even if cascade fails
        next();
    }
});
// Also handle direct delete operations
eventSchema.pre("deleteOne", async function (next) {
    try {
        const eventId = this.getQuery()["_id"];
        if (eventId) {
            console.log(`Event deletion triggered, starting safe cascade delete for: ${eventId}`);
            await (0, cascadeDelete_1.cascadeDeleteEvent)(eventId.toString());
        }
        next();
    }
    catch (error) {
        console.error("Error in event cascade delete middleware:", error);
        // Continue with deletion even if cascade fails
        next();
    }
});
// Text index for search
eventSchema.index({ title: "text", description: "text" });
exports.default = mongoose_1.default.model("Event", eventSchema);
//# sourceMappingURL=Event.js.map