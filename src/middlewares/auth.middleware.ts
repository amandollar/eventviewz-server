import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('=== AUTH MIDDLEWARE DEBUG ===');
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header');
    res.status(401).json({ error: "No token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log('Invalid token format');
    res.status(401).json({ error: "Invalid token format" });
    return;
  }

  console.log('Token:', token.substring(0, 20) + '...');

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('Decoded token:', decoded);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.log('JWT verification failed:', error);
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};
