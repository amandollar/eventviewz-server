import mongoose, { Document } from "mongoose";
import { IUser } from "./User";
import { AnnouncementType } from "../types/enums";
export interface IAnnouncement extends Document {
    title: string;
    content: string;
    type: AnnouncementType;
    createdBy?: IUser["_id"];
    date: Date;
    isActive: boolean;
}
declare const _default: mongoose.Model<IAnnouncement, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncement, {}, {}> & IAnnouncement & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
