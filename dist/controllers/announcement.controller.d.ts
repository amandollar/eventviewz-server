import { Request, Response } from "express";
export declare const createAnnouncement: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAnnouncements: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAnnouncementById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAnnouncement: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAnnouncement: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAnnouncementsByType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getLatestAnnouncements: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
