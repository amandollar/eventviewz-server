import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
export declare const validateSchema: <T extends ZodObject<any>>(schema: T) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
