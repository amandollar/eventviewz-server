"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getCurrentUser = exports.logout = exports.refreshToken = exports.googleCallback = exports.redirectToGoogle = void 0;
const googleapis_1 = require("googleapis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
const redirectToGoogle = (_req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["email", "profile"],
    });
    res.redirect(url);
};
exports.redirectToGoogle = redirectToGoogle;
const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            res.status(400).json({ error: "No code provided" });
            return;
        }
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = googleapis_1.google.oauth2({ version: "v2", auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
        let user = await User_1.default.findOne({ email: data.email });
        if (!user) {
            user = await User_1.default.create({ email: data.email, name: data.name });
        }
        else {
            user.lastLogin = new Date();
            await user.save();
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?accessToken=${accessToken}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.googleCallback = googleCallback;
const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        res.status(401).json({ error: "No refresh token" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            res.status(403).json({ error: "Invalid refresh token" });
            return;
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
    }
    catch {
        res.status(403).json({ error: "Refresh failed" });
        return;
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            await User_1.default.findByIdAndUpdate(decoded.userId, { refreshToken: null });
        }
        catch (_error) {
            // ignore invalid token and proceed with logout
        }
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    try {
        // The user ID should be available from the auth middleware
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const user = await User_1.default.findById(userId).select('-refreshToken -__v');
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            lastLogin: user.lastLogin
        });
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
const updateUser = async (req, res) => {
    try {
        const userId = req.user?.userId; // injected by your auth middleware
        if (!userId) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const allowedFields = ["name", "image"]; // prevent role/email tampering
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select("-refreshToken -__v");
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateUser = updateUser;
/**
 * Delete user account
 * - A user can delete themselves
 * - Admin can delete any account
 */
const deleteUser = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (!userId) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const targetUserId = req.params.id || userId;
        // Only allow self-delete or admin
        if (userId !== targetUserId && role !== "admin") {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        const deletedUser = await User_1.default.findByIdAndDelete(targetUserId);
        if (!deletedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=auth.controller.js.map