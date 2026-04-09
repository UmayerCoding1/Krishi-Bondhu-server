"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing",
            });
        }
        const parsed = schema.parse(req.body);
        req.body = parsed;
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "zod Validation failed",
            error: error.errors,
        });
    }
};
exports.validateRequest = validateRequest;
