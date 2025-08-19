import { Request, Response } from "express";
export declare const submitApplication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMyApplication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateApplication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllApplications: (req: Request, res: Response) => Promise<void>;
export declare const getApplicationById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const approveApplication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const rejectApplication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getApplicationStats: (req: Request, res: Response) => Promise<void>;
