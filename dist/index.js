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
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const helmet_1 = __importDefault(require("helmet"));
//Express App
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
//Security Headers
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
//Middlewares
app.set('trust proxy', 1);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//Routes
app.get("/", (_req, res) => {
    res.json({
        message: "EventViewz Server is running!",
        version: "1.0.0",
    });
});
app.use("/api/v1", index_routes_1.default);
// Connect to database
(0, db_1.default)();
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map