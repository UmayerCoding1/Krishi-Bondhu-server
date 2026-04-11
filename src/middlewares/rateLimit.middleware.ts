import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 5, // max 5 request per IP
    message: {
        success: false,
        message: "Too many requests, try again later",
    },
});

export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 min
    max: 3, // max 2 request per IP
    message: {
        success: false,
        message: "Too many requests, try again later",
    },
});

export const diseaseLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 2, // max 2 request per IP
    message: {
        success: false,
        message: "Too many requests, try again later",
    },
});