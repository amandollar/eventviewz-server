import { Request, Response } from "express";
export declare const createPaymentOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const razorpayWebhook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPaymentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelPaymentOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPaymentHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
