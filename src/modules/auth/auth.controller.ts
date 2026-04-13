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
    const { user, accessToken, refreshToken } = await authService.verifyUserService(req);
    console.log('verify', user, accessToken, refreshToken)
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    return res.status(200).json(
        new ApiResponse(200, "User verified successfully", user)
    );
});

const login = asyncHandler(async (req: Request, res: Response) => {
    const { userWithoutPassword, accessToken, refreshToken } = await authService.loginService(req);
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    return res.status(200).json(new ApiResponse(200, "User logged in successfully", userWithoutPassword));
});


const logout = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.logoutService(req);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json(new ApiResponse(200, "User logged out successfully"));
});


const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getCurrentUserService(req);
    return res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

export const authController = {
    register,
    login,
    verifyUser,
    logout,
    getCurrentUser
}