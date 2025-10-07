import { Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import {
  hashPassword,
  verifyPassword,
  generateTokens
} from "../utils/auth.utils";

dotenv.config();

// Create OAuth2 client with proper redirect URI handling
const getRedirectUri = () => {
  // For production, use the full URL
  if (process.env.NODE_ENV === "production") {
    return (
      process.env.GOOGLE_REDIRECT_URI ||
      "https://eventviewz-server.onrender.com/api/v1/auth/google/callback"
    );
  }
  // For development, use localhost
  return (
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:5000/api/v1/auth/google/callback"
  );
};

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  getRedirectUri()
);

// Normal Authentication Functions

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const image = req.file?.path; // Get uploaded image path

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user (automatically verified for now)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image, // Include profile image if uploaded
      isEmailVerified: true, // Skip email verification for now
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      (user as any)._id.toString(),
      user.role
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token cookie
    const isProd = process.env.NODE_ENV === "production";
    // In development, use 'lax' for same-origin requests, 'none' for cross-origin
    const cookieOptions = {
      httpOnly: true,
      sameSite: isProd ? 'none' as const : 'lax' as const,
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);

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
        updatedAt: user.updatedAt,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check if user has password (not Google OAuth user)
    if (!user.password) {
      res
        .status(401)
        .json({
          error: "This account uses Google OAuth. Please use Google login.",
        });
      return;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      (user as any)._id.toString(),
      user.role
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token cookie
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      sameSite: isProd ? 'none' as const : 'lax' as const,
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);

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
        updatedAt: user.updatedAt,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Existing Google OAuth Functions

export const redirectToGoogle = (_req: Request, res: Response): void => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["email", "profile"],
  });
  res.redirect(url);
};

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.query;

    if (!code) {
      res.status(400).json({ error: "No code provided" });
      return;
    }

    // Check if environment variables are properly set
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      res.status(500).json({ error: "OAuth configuration error" });
      return;
    }

    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    let user = await User.findOne({ email: data.email });

    if (!user) {
      // Ensure we have a name - fallback to email if Google doesn't provide name
      const userName = data.name || data.email?.split("@")[0] || "Google User";

      user = await User.create({
        email: data.email,
        name: userName,
        image: data.picture, // Google provides profile picture URL
        googleId: data.id,
        isEmailVerified: true,
      });
    } else {
      // Use findOneAndUpdate to avoid validation issues with save()
      const updateData: any = {
        lastLogin: new Date(),
      };

      // Update profile picture if it changed
      if (data.picture && user.image !== data.picture) {
        updateData.image = data.picture;
      }

      // Ensure name is set (in case it was missing from previous OAuth)
      if (!user.name && data.name) {
        updateData.name = data.name;
      }

      try {
        await User.findByIdAndUpdate(user._id, updateData, {
          runValidators: true,
        });
      } catch (validationError: any) {
        // If validation fails, try to fix the user document
        if (
          validationError.name === "ValidationError" &&
          validationError.errors?.name
        ) {
          await User.findByIdAndUpdate(
            user._id,
            {
              name: data.name || data.email?.split("@")[0] || "Google User",
              lastLogin: new Date(),
            },
            { runValidators: true }
          );
        } else {
          throw validationError;
        }
      }
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    // Cookie settings: use appropriate SameSite based on environment
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      sameSite: isProd ? 'none' as const : 'lax' as const,
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);
    
    // Prepare user data for frontend
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image || null,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    
    // Encode user data for URL parameter
    const encodedUserData = encodeURIComponent(JSON.stringify(userData));
    
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?accessToken=${accessToken}&user=${encodedUserData}`
    );
  } catch (error: any) {
    // Handle specific OAuth errors
    if (error.code === 400 && error.message?.includes("invalid_grant")) {
      return;
    }

    // Handle other specific errors
    if (error.response?.data?.error) {
      res.status(400).json({
        error: "Google authentication failed",
        details:
          error.response.data.error_description || error.response.data.error,
      });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ error: "No refresh token" });
    return;
  }

  console.log("refresh token", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.id).select('+refreshToken');
    console.log("user", user);
    
    if (!user || user.refreshToken !== token) {
      res.status(403).json({ error: "Invalid refresh token" });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: "Refresh failed" });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch (_error) {
      // ignore invalid token and proceed with logout
    }
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // The user ID should be available from the auth middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    const user = await User.findById(userId).select("-refreshToken -__v");

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
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id; // injected by your auth middleware

    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const updates: any = {};

    // Handle name update from body
    if (req.body.name !== undefined) {
      updates.name = req.body.name;
    }

    // Handle image update from file upload
    if (req.file) {
      updates.image = req.file.path; // Cloudinary URL from multer
    }

    // Only allow name and image updates (prevent role/email tampering)
    const allowedFields = ["name", "image"];
    const filteredUpdates: any = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select("-refreshToken -__v");

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
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

    // Clear refresh token cookie since user is deleted
    res.clearCookie("refreshToken");

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
