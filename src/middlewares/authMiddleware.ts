import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        const decoded = await verifyToken(token);
        console.log('decode data', decoded._id);

        // 🔥 HERE you set req._id
        req._id = decoded._id;

        next();
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
};