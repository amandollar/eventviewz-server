"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getCurrentUser = exports.logout = exports.refreshToken = exports.googleCallback = exports.redirectToGoogle = exports.login = exports.register = void 0;
const googleapis_1 = require("googleapis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_utils_1 = require("../utils/auth.utils");
dotenv_1.default.config();
// Create OAuth2 client with proper redirect URI handling
const getRedirectUri = () => {
    // For production, use the full URL
    if (process.env.NODE_ENV === 'production') {
        return process.env.GOOGLE_REDIRECT_URI || 'https://eventviewz-server.onrender.com/api/v1/auth/google/callback';
    }
    // For development, use localhost
    return process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/v1/auth/google/callback';
};
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, getRedirectUri());
// Normal Authentication Functions
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const image = req.file?.path; // Get uploaded image path
        // Validation
        if (!name || !email || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        if (!(0, auth_utils_1.validateEmail)(email)) {
            res.status(400).json({ error: "Invalid email format" });
            return;
        }
        const passwordValidation = (0, auth_utils_1.validatePasswordStrength)(password);
        if (!passwordValidation.isValid) {
            res.status(400).json({ error: "Password is too weak", details: passwordValidation.errors });
            return;
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "User with this email already exists" });
            return;
        }
        // Hash password
        const hashedPassword = await (0, auth_utils_1.hashPassword)(password);
        // Create user (automatically verified for now)
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
            image, // Include profile image if uploaded
            isEmailVerified: true // Skip email verification for now
        });
        // Generate tokens
        const { accessToken, refreshToken } = (0, auth_utils_1.generateTokens)(user._id.toString(), user.role);
        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();
        // Set refresh token cookie
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image || null,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            accessToken
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        // Find user with password
        const user = await User_1.default.findOne({ email }).select("+password");
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        // Check if user has password (not Google OAuth user)
        if (!user.password) {
            res.status(401).json({ error: "This account uses Google OAuth. Please use Google login." });
            return;
        }
        // Verify password
        const isPasswordValid = await (0, auth_utils_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate tokens
        const { accessToken, refreshToken } = (0, auth_utils_1.generateTokens)(user._id.toString(), user.role);
        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();
        // Set refresh token cookie
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
        res.json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image || null,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            accessToken
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.login = login;
// Existing Google OAuth Functions
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
            console.error("Google OAuth: No authorization code provided");
            res.status(400).json({ error: "No code provided" });
            return;
        }
        console.log("Google OAuth: Attempting to exchange code for tokens");
        console.log("Google OAuth: Environment variables check:", {
            CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING",
            CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING",
            REDIRECT_URI: getRedirectUri(),
            NODE_ENV: process.env.NODE_ENV
        });
        // Check if environment variables are properly set
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            console.error("Google OAuth: Missing required environment variables (CLIENT_ID or CLIENT_SECRET)");
            res.status(500).json({ error: "OAuth configuration error" });
            return;
        }
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        console.log("Google OAuth: Successfully obtained tokens, fetching user info");
        const oauth2 = googleapis_1.google.oauth2({ version: "v2", auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
        console.log("Google OAuth: User info received:", {
            email: data.email,
            name: data.name,
            id: data.id
        });
        let user = await User_1.default.findOne({ email: data.email });
        if (!user) {
            // Ensure we have a name - fallback to email if Google doesn't provide name
            const userName = data.name || data.email?.split('@')[0] || 'Google User';
            user = await User_1.default.create({
                email: data.email,
                name: userName,
                image: data.picture, // Google provides profile picture URL
                googleId: data.id,
                isEmailVerified: true
            });
        }
        else {
            // Update profile picture if it changed
            if (data.picture && user.image !== data.picture) {
                user.image = data.picture;
            }
            user.lastLogin = new Date();
            await user.save();
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?accessToken=${accessToken}`);
    }
    catch (error) {
        console.error("Google OAuth callback error:", error);
        // Handle specific OAuth errors
        if (error.code === 400 && error.message?.includes('invalid_grant')) {
            console.error("Google OAuth: Invalid grant - check redirect URI and environment variables");
            res.status(400).json({
                error: "OAuth authentication failed",
                details: "Please try logging in again"
            });
            return;
        }
        // Handle other specific errors
        if (error.response?.data?.error) {
            console.error("Google API error:", error.response.data);
            res.status(400).json({
                error: "Google authentication failed",
                details: error.response.data.error_description || error.response.data.error
            });
            return;
        }
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
        const user = await User_1.default.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            res.status(403).json({ error: "Invalid refresh token" });
            return;
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
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
            await User_1.default.findByIdAndUpdate(decoded.id, { refreshToken: null });
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
        const userId = req.user?.id;
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
            image: user.image || null,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
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
        const userId = req.user?.id; // injected by your auth middleware
        if (!userId) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        console.log('Update user request - userId:', userId);
        console.log('Update user request - body:', req.body);
        console.log('Update user request - file:', req.file);
        const updates = {};
        // Handle name update from body
        if (req.body.name !== undefined) {
            updates.name = req.body.name;
        }
        // Handle image update from file upload
        if (req.file) {
            updates.image = req.file.path; // Cloudinary URL from multer
            console.log('Image update - new path:', req.file.path);
        }
        console.log('Updates to apply:', updates);
        // Only allow name and image updates (prevent role/email tampering)
        const allowedFields = ["name", "image"];
        const filteredUpdates = {};
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        }
        console.log('Filtered updates:', filteredUpdates);
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { $set: filteredUpdates }, { new: true, runValidators: true }).select("-refreshToken -__v");
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        console.log('Updated user response:', {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
            role: updatedUser.role
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const userId = req.user?.id;
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
        // Clear refresh token cookie since user is deleted
        res.clearCookie("refreshToken");
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=auth.controller.js.map