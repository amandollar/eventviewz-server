import { Request, Response, NextFunction } from "express";
export declare const authorizeRoles: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
