"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('No authorization header');
        res.status(401).json({ error: "No token" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log('Invalid token format');
        res.status(401).json({ error: "Invalid token format" });
        return;
    }
    console.log('Token:', token.substring(0, 20) + '...');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log('JWT verification failed:', error);
        res.status(403).json({ error: "Invalid token" });
        return;
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map