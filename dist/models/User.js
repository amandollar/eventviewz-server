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
// src/models/User.ts
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("../types/enums");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    image: { type: String },
    role: { type: String, enum: Object.values(enums_1.UserRole), default: enums_1.UserRole.STUDENT },
    googleId: { type: String, sparse: true, index: true },
    password: { type: String, select: false },
    isEmailVerified: { type: Boolean, default: true }, // Always true for now
    lastLogin: { type: Date },
    refreshToken: { type: String, select: false }
}, { timestamps: true });
// Index for efficient queries
userSchema.index({ email: 1, googleId: 1 });
// Pre-save middleware to handle Google OAuth users
userSchema.pre("save", function (next) {
    if (this.googleId) {
        this.isEmailVerified = true; // Google accounts are pre-verified
    }
    next();
});
// Temporarily disabled cascade delete to fix the schema error
// userSchema.pre("findOneAndDelete", async function (this: any, next: Function) {
//   const userId = this.getQuery()["_id"];
//   await mongoose.model("Register").deleteMany({ user: userId });
//   await mongoose.model("Cetificate").deleteMany({ user: userId });
//   await mongoose.model("Event").deleteMany({ createdBy: userId });
//   next();
// });
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map