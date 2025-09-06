import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Invalid token format" });
    return;
  }


  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};
