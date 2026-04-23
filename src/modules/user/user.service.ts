import { Request } from "express";
import { User } from "./user.model";
import { imagekit } from "../../config/imagekit";
import redisClient from "../../config/redis";

export const userServices = {
    getAllUsersService: async (req: Request) => {
        const { page, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const users = await User.find().skip(skip).limit(Number(limit)).select("-password -accessToken -refreshToken -otp -__v ");
        const total = await User.countDocuments();
        const tatalPage = Math.ceil(total / Number(limit));
        return { users, total, tatalPage };
    },
    updateUserAvatarService: async (req: Request) => {
        const file = req.file;

        const cacheKey = `user:${req._id}`;
        redisClient.del(cacheKey);

        if (!file) {
            throw new Error("Avatar and user ID are required");
        }

        const result = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "avatar",
        });


        const user = await User.findByIdAndUpdate(req._id, { avatar: result.url }, { returnDocument: 'after' }).select("-password -accessToken -refreshToken -otp -__v ");
        if (!user) {
            throw new Error("User not found");
        }

        await redisClient.set(cacheKey, JSON.stringify(user), {
            EX: 60 * 60 // 1 hour
        });
        return {
            success: true, message: "Avatar updated successfully",
            avatar: user.avatar
        }
    }
}