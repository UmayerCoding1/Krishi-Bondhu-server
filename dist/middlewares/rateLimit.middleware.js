"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diseaseLimiter = exports.authLimiter = exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 5, // max 5 request per IP
    message: {
        success: false,
        message: "Too many requests, try again later",
    },
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 min
    max: 3, // max 2 request per IP
    message: {
        success: false,
        message: "Too many requests, try again later",
    },
});
exports.diseaseLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 2, // max 2 request per IP
    message: {
        success: false,
        message: "Too many requests, try again later",
    },
});
