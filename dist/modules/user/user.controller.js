"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const user_service_1 = require("./user.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
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
    })
};
