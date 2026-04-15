"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const user_model_1 = require("./user.model");
exports.userServices = {
    getAllUsersService: async (req) => {
        const { page, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const users = await user_model_1.User.find().skip(skip).limit(Number(limit)).select("-password -accessToken -refreshToken -otp -__v ");
        const total = await user_model_1.User.countDocuments();
        const tatalPage = Math.ceil(total / Number(limit));
        return { users, total, tatalPage };
    }
};
