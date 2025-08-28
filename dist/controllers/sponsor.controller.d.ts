import { Request, Response } from "express";
export declare const createSponsor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSponsors: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSponsorById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateSponsor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteSponsor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCarouselSponsors: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
