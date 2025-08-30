import { Request, Response } from "express";
export declare const createEvent: (req: Request, res: Response) => Promise<void>;
export declare const getEvents: (req: Request, res: Response) => Promise<void>;
export declare const getEventById: (req: Request, res: Response) => Promise<void>;
export declare const updateEvent: (req: Request, res: Response) => Promise<void>;
export declare const deleteEvent: (req: Request, res: Response) => Promise<void>;
export declare const searchEvents: (req: Request, res: Response) => Promise<void>;
export declare const getEventsByCategory: (req: Request, res: Response) => Promise<void>;
