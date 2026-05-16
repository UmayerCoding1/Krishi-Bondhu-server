import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";




let cookieOptions;
// process.env.NODE_ENV === 'production' ? cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'none' as const,
// } : cookieOptions = {
//     httpOnly: true,
//     secure: false,
//     sameSite: 'lax' as const,
//     // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// };

// console.log(cookieOptions)


cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' as const,
}

const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.registerService(req);
    console.log(result);
    if (result) {
        return res.status(201).json(new ApiResponse(201, "User registered successfully"));
    }
});


const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.verifyUserService(req);
    console.log('verify', user, accessToken, refreshToken)
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.status(200).json(
        new ApiResponse(200, "User verified successfully", user)
    );
});

const login = asyncHandler(async (req: Request, res: Response) => {
    const { userWithoutPassword, accessToken, refreshToken } = await authService.loginService(req);

    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
    return res.status(200).json(new ApiResponse(200, "User logged in successfully", userWithoutPassword, true));
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.changePasswordService(req);
    if (result.success) {
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
    }
    return res.status(result.success ? 200 : 400).json(new ApiResponse(result.success ? 200 : 400, result.message, undefined, result.success));
});

const toggleTwoFactor = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.toggleTwoFactorService(req);
    return res.status(result.statusCode).json(new ApiResponse(result.statusCode, result.message, undefined, true));
});

const resendOTP = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.resendOTPService(req);
    return res.status(result.success ? 200 : 400).json(new ApiResponse(result.success ? 200 : 400, result.message));
});


const logout = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.logoutService(req);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(200).json(new ApiResponse(200, "User logged out successfully", undefined, true));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getCurrentUserService(req);
    return res
        .status(200)
        .json(new ApiResponse(200, "User fetched successfully", user));
});
export const authController = {
    register,
    login,
    verifyUser,
    logout,
    getCurrentUser,
    changePassword,
    resendOTP,
    toggleTwoFactor
}