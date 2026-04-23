import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { userServices } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";

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
    })
}