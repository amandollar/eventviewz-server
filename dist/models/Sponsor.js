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
// src/models/Sponsor.ts
const mongoose_1 = __importStar(require("mongoose"));
const cascadeDelete_1 = require("../utils/cascadeDelete");
const sponsorSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    publisher: { type: String, required: true, trim: true, maxlength: 100 },
    images: [{ type: String, required: true }], // Array of image URLs
    link: { type: String, trim: true, maxlength: 500 }, // Optional website link
    contact: { type: String, trim: true, maxlength: 200 }, // Optional contact info
    isActive: { type: Boolean, default: true },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    },
}, { timestamps: true });
// Index for active sponsors and expiration
sponsorSchema.index({ isActive: 1, expiresAt: 1 });
// Auto-deactivate expired sponsors
sponsorSchema.pre('find', function () {
    this.where({
        isActive: true,
        expiresAt: { $gt: new Date() }
    });
});
// Safe cascade delete middleware
sponsorSchema.pre("findOneAndDelete", async function (next) {
    try {
        const sponsorId = this.getQuery()["_id"];
        if (sponsorId) {
            console.log(`Sponsor deletion triggered, starting safe cascade delete for: ${sponsorId}`);
            await (0, cascadeDelete_1.cascadeDeleteSponsor)(sponsorId.toString());
        }
        next();
    }
    catch (error) {
        console.error("Error in sponsor cascade delete middleware:", error);
        // Continue with deletion even if cascade fails
        next();
    }
});
// Also handle direct delete operations
sponsorSchema.pre("deleteOne", async function (next) {
    try {
        const sponsorId = this.getQuery()["_id"];
        if (sponsorId) {
            console.log(`Sponsor deletion triggered, starting safe cascade delete for: ${sponsorId}`);
            await (0, cascadeDelete_1.cascadeDeleteSponsor)(sponsorId.toString());
        }
        next();
    }
    catch (error) {
        console.error("Error in sponsor cascade delete middleware:", error);
        // Continue with deletion even if cascade fails
        next();
    }
});
exports.default = mongoose_1.default.model("Sponsor", sponsorSchema);
//# sourceMappingURL=Sponsor.js.map