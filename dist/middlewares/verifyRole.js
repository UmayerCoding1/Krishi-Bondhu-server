"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = void 0;
const ApiError_1 = require("../utils/ApiError");
const user_model_1 = require("../modules/user/user.model");
const verifyRole = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await user_model_1.User.findById(req._id);
            if (!user) {
                throw new ApiError_1.ApiError(404, "User not found");
            }
            if (user.role !== roles) {
                throw new ApiError_1.ApiError(403, "Unauthorized");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.verifyRole = verifyRole;
