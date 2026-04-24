import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { userServices } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { User } from "./user.model";
import redisClient from "../../config/redis";

export const userControllers = {
    getAllUsers: asyncHandler(async (req: Request, res: Response) => {
        const { users, total, tatalPage } = await userServices.getAllUsersService(req);
        return res.status(200).json(new ApiResponse(200, "Users fetched successfully", { users, total, tatalPage }));
    }),

    updateUserAvatar: asyncHandler(async (req: Request, res: Response) => {
        const { success, message, avatar } = await userServices.updateUserAvatarService(req);
        return res.status(success ? 200 : 400).json(new ApiResponse(success ? 200 : 400, message, { avatar }));
    }),

    updateUserName: asyncHandler(async (req: Request, res: Response) => {
        const result = await userServices.updateUserNameService(req);
        console.log('result', result)
        return res.status(result.success ? 200 : 400).json(new ApiResponse(result.success ? 200 : 400, result.message, result.data));
    }),

    updateNotificationSettings: asyncHandler(async (req: Request, res: Response) => {
        try {
            const userId = req._id;
            const { type, value } = req.body;
            const cacheKey = `user:${req._id}`;
            // 🔐 validation

            console.log(type, value)
            const allowedTypes = ["email", "system_notification", "safety_alert"];

            if (!allowedTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid notification type",
                });
            }

            // 🧠 dynamic field update
            const updateField = `system_config.notification.${type}`;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { [updateField]: value } },
                { new: true }
            ).select("system_config.notification");

            await redisClient.del(cacheKey);

            return res.status(200).json({
                success: true,
                message: "Notification updated successfully",
                data: {
                    email: updatedUser?.system_config.notification.email,
                    updates: updatedUser?.system_config.notification.system_notification,
                    safety: updatedUser?.system_config.notification.safety_alert,
                },
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    })
}