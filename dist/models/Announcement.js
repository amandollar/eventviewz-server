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
// src/models/Announcement.ts
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("../types/enums");
const cascadeDelete_1 = require("../utils/cascadeDelete");
const announcementSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: { type: String, enum: Object.values(enums_1.AnnouncementType), required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
announcementSchema.index({ type: 1, date: -1 }); // quick filtering
// Safe cascade delete middleware
announcementSchema.pre("findOneAndDelete", async function (next) {
    try {
        const announcementId = this.getQuery()["_id"];
        if (announcementId) {
            console.log(`Announcement deletion triggered, starting safe cascade delete for: ${announcementId}`);
            await (0, cascadeDelete_1.cascadeDeleteAnnouncement)(announcementId.toString());
        }
        next();
    }
    catch (error) {
        console.error("Error in announcement cascade delete middleware:", error);
        // Continue with deletion even if cascade fails
        next();
    }
});
// Also handle direct delete operations
announcementSchema.pre("deleteOne", async function (next) {
    try {
        const announcementId = this.getQuery()["_id"];
        if (announcementId) {
            console.log(`Announcement deletion triggered, starting safe cascade delete for: ${announcementId}`);
            await (0, cascadeDelete_1.cascadeDeleteAnnouncement)(announcementId.toString());
        }
        next();
    }
    catch (error) {
        console.error("Error in announcement cascade delete middleware:", error);
        // Continue with deletion even if cascade fails
        next();
    }
});
exports.default = mongoose_1.default.model("Announcement", announcementSchema);
//# sourceMappingURL=Announcement.js.map