import mongoose, { Document } from "mongoose";
import { UserRole } from "../types/enums";
export interface IUser extends Document {
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
    googleId?: string | null;
    password?: string | null;
    isEmailVerified: boolean;
    lastLogin?: Date | null;
    refreshToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
