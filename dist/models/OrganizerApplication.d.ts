import mongoose, { Document } from "mongoose";
import { IUser } from "./User";
export interface IOrganizerApplication extends Document {
    user: IUser["_id"];
    organizationName: string;
    phoneNumber: string;
    organizationImage?: string;
    description?: string;
    status: "pending" | "approved" | "rejected";
    adminNotes?: string;
    appliedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: IUser["_id"];
}
declare const _default: mongoose.Model<IOrganizerApplication, {}, {}, {}, mongoose.Document<unknown, {}, IOrganizerApplication, {}, {}> & IOrganizerApplication & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
