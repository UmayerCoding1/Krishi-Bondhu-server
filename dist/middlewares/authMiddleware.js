"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const token_1 = require("../utils/token");
const user_model_1 = require("../modules/user/user.model");
const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];
        try {
            const decoded = await (0, token_1.verifyToken)(accessToken);
            req._id = decoded._id;
            return next();
        }
        catch (err) {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw new ApiError_1.ApiError(401, "Session expired");
            }
            const decodedRefresh = await (0, token_1.verifyToken)(refreshToken);
            const user = await user_model_1.User.findById(decodedRefresh._id);
            if (!user || user.refreshToken !== refreshToken) {
                throw new ApiError_1.ApiError(401, "Invalid session");
            }
            const newAccessToken = await (0, token_1.generateAccessToken)({
                _id: user._id,
            });
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });
            req._id = user._id;
            return next();
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
