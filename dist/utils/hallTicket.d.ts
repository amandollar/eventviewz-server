export interface IHallTicket {
    ticketId: string;
    registrationId: string;
    eventTitle: string;
    eventDate: Date;
    eventTime: string;
    eventVenue: string;
    eventLocation: string;
    userName: string;
    userEmail: string;
    registrationDate: Date;
    status: string;
    qrCode?: string;
}
export declare const generateHallTicket: (registrationId: string) => Promise<IHallTicket>;
export declare const validateHallTicket: (ticketId: string) => Promise<boolean>;
export declare const getHallTicketById: (ticketId: string) => Promise<IHallTicket | null>;
