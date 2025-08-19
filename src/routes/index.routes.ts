import { Router } from "express";
import authRouter from "./auth.routes";
import eventRouter from "./event.routes";
import registrationRouter from "./registration.routes";
import announcementRouter from "./announcement.routes";
import sponsorRouter from "./sponsor.routes";


const indexRouter = Router();

// Routes
indexRouter.use('/auth', authRouter);
indexRouter.use('/events', eventRouter);
indexRouter.use('/registrations', registrationRouter);
indexRouter.use('/announcements', announcementRouter);
indexRouter.use('/sponsors', sponsorRouter);

export default indexRouter;