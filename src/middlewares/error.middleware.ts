import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const globalErrorHandle = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode,
    })
}