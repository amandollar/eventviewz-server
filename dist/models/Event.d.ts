import mongoose, { Document } from "mongoose";
import { EventCategory } from "../types/enums";
import { IUser } from "./User";
export interface ITicket {
    type: string;
    price: number;
    available: number;
}
export interface IEvent extends Document {
    title: string;
    description?: string;
    image?: string;
    date: Date;
    startTime: string;
    endTime: string;
    venue: string;
    location?: string;
    category: EventCategory;
    createdBy: IUser["_id"];
    participants: IUser["_id"][];
    maxParticipants?: number;
    currentParticipants: number;
    isActive: boolean;
    tickets: ITicket[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IEvent, {}, {}, {}, mongoose.Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
