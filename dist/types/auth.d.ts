import { Request } from 'express';
export interface JWTPayload {
    id: string;
    role?: string;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
