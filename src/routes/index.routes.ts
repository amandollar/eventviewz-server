import { Router } from "express";
import authRouter from "./auth.routes";
import eventRouter from "./event.routes";
import registrationRouter from "./registration.routes";
import announcementRouter from "./announcement.routes";
import sponsorRouter from "./sponsor.routes";
import paymentRouter from "./payment.routes";
import organizerApplicationRouter from "./organizerApplication.routes";
import certificateRouter from "./certificate.routes";

const indexRouter = Router();

// Routes
indexRouter.use('/auth', authRouter);
indexRouter.use('/events', eventRouter);
indexRouter.use('/registrations', registrationRouter);
indexRouter.use('/announcements', announcementRouter);
indexRouter.use('/sponsors', sponsorRouter);
indexRouter.use('/payments', paymentRouter);
indexRouter.use('/organizer-applications', organizerApplicationRouter);
indexRouter.use('/certificates', certificateRouter);

export default indexRouter;