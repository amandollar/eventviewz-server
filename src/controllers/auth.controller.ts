import { Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export const redirectToGoogle = (_req: Request, res: Response): void => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["email", "profile"],
    });
    res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code } = req.query;

        if(!code) {
            res.status(400).json({ error: "No code provided" });
            return;
        }

        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();

        let user = await User.findOne({ email: data.email });

        if (!user) {
            user = await User.create({ email: data.email, name: data.name });
        } else {
            user.lastLogin = new Date();
            await user.save();
        }

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?accessToken=${accessToken}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken;
    if (!token) {
        res.status(401).json({ error: "No refresh token" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== token) {
            res.status(403).json({ error: "Invalid refresh token" });
            return;
        }

        const newAccessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch {
        res.status(403).json({ error: "Refresh failed" });
        return;
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
        } catch (_error) {
            // ignore invalid token and proceed with logout
        }
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // The user ID should be available from the auth middleware
        const userId = (req as any).user?.userId;
        
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const user = await User.findById(userId).select('-refreshToken -__v');
        
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
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId; // injected by your auth middleware

    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const allowedFields = ["name", "image"]; // prevent role/email tampering
    const updates: any = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-refreshToken -__v");

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete user account
 * - A user can delete themselves
 * - Admin can delete any account
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const role = (req as any).user?.role;

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

    const deletedUser = await User.findByIdAndDelete(targetUserId);
    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

