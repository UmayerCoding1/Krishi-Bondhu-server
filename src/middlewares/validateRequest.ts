import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
    (schema: ZodSchema<any>) =>
        (req: Request, res: Response, next: NextFunction) => {
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
            } catch (error: any) {
                return res.status(400).json({
                    success: false,
                    message: "zod Validation failed",
                    error: error.errors,
                });
            }
        };