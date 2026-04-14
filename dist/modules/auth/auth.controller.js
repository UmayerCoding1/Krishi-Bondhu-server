"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_service_1 = require("./auth.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none', // cross-domain এর জন্য আবশ্যক
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
console.log(cookieOptions);
const register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await auth_service_1.authService.registerService(req);
    if (result) {
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, "User registered successfully"));
    }
});
const verifyUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user, accessToken, refreshToken } = await auth_service_1.authService.verifyUserService(req);
    console.log('verify', user, accessToken, refreshToken);
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "User verified successfully", user));
});
const login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userWithoutPassword, accessToken, refreshToken } = await auth_service_1.authService.loginService(req);
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "User logged in successfully", userWithoutPassword));
});
const logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await auth_service_1.authService.logoutService(req);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "User logged out successfully"));
});
const getCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await auth_service_1.authService.getCurrentUserService(req);
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "User fetched successfully", user));
});
exports.authController = {
    register,
    login,
    verifyUser,
    logout,
    getCurrentUser
};
