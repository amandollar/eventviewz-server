// src/types/auth.ts
import { Request } from 'express';

export interface JWTPayload {
  userId: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}
