import mongoose, { Document } from "mongoose";
import { IUser } from "./User";
import { IEvent } from "./Event";
export interface IRegistration extends Document {
    user: IUser["_id"];
    event: IEvent["_id"];
    registeredAt: Date;
    status: "pending" | "confirmed" | "cancelled" | "failed" | "refunded";
    ticketType?: string;
    amount?: number;
    paymentOrderId?: string;
    paymentId?: string;
    paymentVerifiedAt?: Date;
    confirmedAt?: Date;
    cancelledAt?: Date;
    failedAt?: Date;
    refundedAt?: Date;
    hallTicket?: string;
    notes?: string;
}
declare const _default: mongoose.Model<IRegistration, {}, {}, {}, mongoose.Document<unknown, {}, IRegistration, {}, {}> & IRegistration & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
