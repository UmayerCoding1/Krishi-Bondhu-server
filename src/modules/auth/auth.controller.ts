import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";

const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.registerService(req);

    if (result) {
        return res.status(201).json(new ApiResponse(201, "User registered successfully"));
    }
});


const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken } = await authService.verifyUserService(req);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });

    return res.status(200).json(
        new ApiResponse(200, "User verified successfully", user)
    );
});

const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.loginService(req);
    // if (!result.success) {
    //     console.log(result)
    //     return res.status(result.statusCode).json(new ApiResponse(result.statusCode, result.message || "Something went wrong"));
    // }
    // return res.status(201).json(new ApiResponse(201, result, "User logged in successfully"));
});

export const authController = {
    register,
    login,
    verifyUser
}