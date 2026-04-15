import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ROLE } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const verifyRole = (roles: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req._id);
            if (!user) {
                throw new ApiError(404, "User not found");
            }
            if (user.role !== roles) {
                throw new ApiError(403, "Unauthorized");
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};