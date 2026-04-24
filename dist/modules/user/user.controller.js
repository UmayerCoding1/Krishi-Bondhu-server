"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const user_service_1 = require("./user.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const user_model_1 = require("./user.model");
const redis_1 = __importDefault(require("../../config/redis"));
exports.userControllers = {
    getAllUsers: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { users, total, tatalPage } = await user_service_1.userServices.getAllUsersService(req);
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, "Users fetched successfully", { users, total, tatalPage }));
    }),
    updateUserAvatar: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { success, message, avatar } = await user_service_1.userServices.updateUserAvatarService(req);
        return res.status(success ? 200 : 400).json(new ApiResponse_1.ApiResponse(success ? 200 : 400, message, { avatar }));
    }),
    updateUserName: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await user_service_1.userServices.updateUserNameService(req);
        console.log('result', result);
        return res.status(result.success ? 200 : 400).json(new ApiResponse_1.ApiResponse(result.success ? 200 : 400, result.message, result.data));
    }),
    updateNotificationSettings: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        try {
            const userId = req._id;
            const { type, value } = req.body;
            const cacheKey = `user:${req._id}`;
            // 🔐 validation
            console.log(type, value);
            const allowedTypes = ["email", "system_notification", "safety_alert"];
            if (!allowedTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid notification type",
                });
            }
            // 🧠 dynamic field update
            const updateField = `system_config.notification.${type}`;
            const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, { $set: { [updateField]: value } }, { new: true }).select("system_config.notification");
            await redis_1.default.del(cacheKey);
            return res.status(200).json({
                success: true,
                message: "Notification updated successfully",
                data: {
                    email: updatedUser?.system_config.notification.email,
                    updates: updatedUser?.system_config.notification.system_notification,
                    safety: updatedUser?.system_config.notification.safety_alert,
                },
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: error.message,
            });
        }
    })
};
