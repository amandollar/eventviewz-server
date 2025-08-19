import mongoose, { Document } from "mongoose";
import { IUser } from "./User";
import { IEvent } from "./Event";
export interface ICertificate extends Document {
    event: IEvent["_id"];
    user: IUser["_id"];
    issuedAt: Date;
    fileUrl: string;
    issuedBy: IUser["_id"];
}
declare const _default: mongoose.Model<ICertificate, {}, {}, {}, mongoose.Document<unknown, {}, ICertificate, {}, {}> & ICertificate & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
