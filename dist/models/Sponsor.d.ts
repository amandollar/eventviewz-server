import mongoose, { Document } from "mongoose";
export interface ISponsor extends Document {
    title: string;
    description: string;
    publisher: string;
    images: string[];
    link?: string;
    contact?: string;
    isActive: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISponsor, {}, {}, {}, mongoose.Document<unknown, {}, ISponsor, {}, {}> & ISponsor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
