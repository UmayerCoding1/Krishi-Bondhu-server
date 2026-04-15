import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyToken, generateAccessToken } from "../utils/token";
import { User } from "../modules/user/user.model";


export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        try {
            const decoded = await verifyToken(accessToken);
            req._id = decoded._id;
            return next();
        } catch (err) {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new ApiError(401, "Session expired");
            }

            const decodedRefresh = await verifyToken(refreshToken);


            const user = await User.findById(decodedRefresh._id);
            console.log(user.refreshToken === refreshToken, user)



            if (user.refreshToken !== refreshToken) {
                throw new ApiError(401, "Invalid session");
            }
            console.log(user, 'new fass @=eeee')
            const newAccessToken = await generateAccessToken({
                _id: user._id,
                role: user.role
            });

            console.log(newAccessToken)
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });

            req._id = user._id;
            return next();
        }
    } catch (error) {
        next(error);
    }
};