"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const user_model_1 = require("./user.model");
const imagekit_1 = require("../../config/imagekit");
const redis_1 = __importDefault(require("../../config/redis"));
exports.userServices = {
    getAllUsersService: async (req) => {
        const { page, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const users = await user_model_1.User.find().skip(skip).limit(Number(limit)).select("-password -accessToken -refreshToken -otp -__v ");
        const total = await user_model_1.User.countDocuments();
        const tatalPage = Math.ceil(total / Number(limit));
        return { users, total, tatalPage };
    },
    updateUserAvatarService: async (req) => {
        const file = req.file;
        const cacheKey = `user:${req._id}`;
        redis_1.default.del(cacheKey);
        if (!file) {
            throw new Error("Avatar and user ID are required");
        }
        const result = await imagekit_1.imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "avatar",
        });
        const user = await user_model_1.User.findByIdAndUpdate(req._id, { avatar: result.url }, { returnDocument: 'after' }).select("-password -accessToken -refreshToken -otp -__v ");
        if (!user) {
            throw new Error("User not found");
        }
        await redis_1.default.set(cacheKey, JSON.stringify(user), {
            EX: 60 * 60 // 1 hour
        });
        return {
            success: true, message: "Avatar updated successfully",
            avatar: user.avatar
        };
    },
    updateUserNameService: async (req) => {
        const { name } = req.body;
        if (!name) {
            throw new Error("Name is required");
        }
        const cacheKey = `user:${req._id}`;
        redis_1.default.del(cacheKey);
        const user = await user_model_1.User.findByIdAndUpdate(req._id, { name }, { returnDocument: 'after' }).select("-password -accessToken -refreshToken -otp -__v ");
        if (!user) {
            throw new Error("User not found");
        }
        await redis_1.default.set(cacheKey, JSON.stringify(user), {
            EX: 60 * 60 // 1 hour
        });
        return {
            success: true,
            message: "Name updated successfully",
            data: user
        };
    }
};
