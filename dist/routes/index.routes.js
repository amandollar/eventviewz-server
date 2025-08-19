"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const event_routes_1 = __importDefault(require("./event.routes"));
const registration_routes_1 = __importDefault(require("./registration.routes"));
const announcement_routes_1 = __importDefault(require("./announcement.routes"));
const sponsor_routes_1 = __importDefault(require("./sponsor.routes"));
const payment_routes_1 = __importDefault(require("./payment.routes"));
const organizerApplication_routes_1 = __importDefault(require("./organizerApplication.routes"));
const indexRouter = (0, express_1.Router)();
// Routes
indexRouter.use('/auth', auth_routes_1.default);
indexRouter.use('/events', event_routes_1.default);
indexRouter.use('/registrations', registration_routes_1.default);
indexRouter.use('/announcements', announcement_routes_1.default);
indexRouter.use('/sponsors', sponsor_routes_1.default);
indexRouter.use('/payments', payment_routes_1.default);
indexRouter.use('/organizer-applications', organizerApplication_routes_1.default);
exports.default = indexRouter;
//# sourceMappingURL=index.routes.js.map