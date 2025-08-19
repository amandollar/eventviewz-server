import { Request, Response } from "express";
export declare const redirectToGoogle: (_req: Request, res: Response) => void;
export declare const googleCallback: (req: Request, res: Response) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
export declare const getCurrentUser: (req: Request, res: Response) => Promise<void>;
export declare const updateUser: (req: Request, res: Response) => Promise<void>;
/**
 * Delete user account
 * - A user can delete themselves
 * - Admin can delete any account
 */
export declare const deleteUser: (req: Request, res: Response) => Promise<void>;
