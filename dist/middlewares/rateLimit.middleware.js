"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLimiter = exports.registrationLimiter = exports.eventCreationLimiter = exports.uploadLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// General API rate limiter removed - no longer needed
// Stricter rate limiter for authentication endpoints
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs (more strict for auth)
    message: {
        error: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
            retryAfter: '15 minutes',
            limit: req.rateLimit?.limit,
            remaining: req.rateLimit?.remaining,
            resetTime: req.rateLimit?.resetTime
        });
    }
});
// Rate limiter for file uploads (more strict)
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 uploads per hour
    message: {
        error: 'Too many file uploads from this IP, please try again after 1 hour.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many file uploads from this IP, please try again after 1 hour.',
            retryAfter: '1 hour',
            limit: req.rateLimit?.limit,
            remaining: req.rateLimit?.remaining,
            resetTime: req.rateLimit?.resetTime
        });
    }
});
// Rate limiter for event creation (moderate)
exports.eventCreationLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 event creations per hour
    message: {
        error: 'Too many event creations from this IP, please try again after 1 hour.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many event creations from this IP, please try again after 1 hour.',
            retryAfter: '1 hour',
            limit: req.rateLimit?.limit,
            remaining: req.rateLimit?.remaining,
            resetTime: req.rateLimit?.resetTime
        });
    }
});
// Rate limiter for registration endpoints (moderate)
exports.registrationLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // limit each IP to 30 registrations per 15 minutes
    message: {
        error: 'Too many registration attempts from this IP, please try again after 15 minutes.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many registration attempts from this IP, please try again after 15 minutes.',
            retryAfter: '15 minutes',
            limit: req.rateLimit?.limit,
            remaining: req.rateLimit?.remaining,
            resetTime: req.rateLimit?.resetTime
        });
    }
});
// Rate limiter for payment endpoints (very strict for security)
exports.paymentLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 payment operations per 15 minutes
    message: {
        error: 'Too many payment operations from this IP, please try again after 15 minutes.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many payment operations from this IP, please try again after 15 minutes.',
            retryAfter: '15 minutes',
            limit: req.rateLimit?.limit,
            remaining: req.rateLimit?.remaining,
            resetTime: req.rateLimit?.resetTime
        });
    }
});
//# sourceMappingURL=rateLimit.middleware.js.map