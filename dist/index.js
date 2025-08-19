"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./libs/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const event_route_1 = __importDefault(require("./routes/event.route"));
const registration_routes_1 = __importDefault(require("./routes/registration.routes"));
const announcement_routes_1 = __importDefault(require("./routes/announcement.routes"));
const sponsor_routes_1 = __importDefault(require("./routes/sponsor.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// Middleware
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/auth', auth_routes_1.default);
app.use('/events', event_route_1.default);
app.use('/registrations', registration_routes_1.default);
app.use('/announcements', announcement_routes_1.default);
app.use('/sponsors', sponsor_routes_1.default);
// Health check
app.get("/", (_req, res) => {
    res.json({
        message: "EventViewz Server is running!",
        version: "1.0.0",
        endpoints: {
            auth: "/auth",
            events: "/events",
            registrations: "/registrations",
            announcements: "/announcements",
            sponsors: "/sponsors",
            health: "/"
        }
    });
});
// Connect to database
(0, db_1.default)();
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map