"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_model_1 = require("../user/user.model");
const ApiError_1 = require("../../utils/ApiError");
const crypto_hash_1 = require("../../utils/crypto-hash");
const token_1 = require("../../utils/token");
const ApiResponse_1 = require("../../utils/ApiResponse");
const redis_1 = __importDefault(require("../../config/redis"));
const user_interface_1 = require("../user/user.interface");
const sendEmail_1 = require("../../services/sendEmail");
const registerService = async (req) => {
    const { name, email, password } = req.body;
    const existingUser = await user_model_1.User.findOne({ email });
    if (existingUser) {
        if (existingUser.isVerified) {
            return new ApiResponse_1.ApiResponse(400, "User already verified");
        }
        else {
            return new ApiResponse_1.ApiResponse(400, "User already exists");
        }
    }
    const user = await user_model_1.User.create({ name, email, password });
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    console.log(accessToken, refreshToken);
    return { user, accessToken, refreshToken };
};
const verifyUserService = async (req) => {
    const { email, otp } = req.body;
    const user = await user_model_1.User.findOne({ email });
    if (user?.isTwoFactorEnabled) {
        const verifyOTP = (0, crypto_hash_1.verifyHashPassword)(String(otp), user?.otp?.slug, user?.otp?.code);
        if (!verifyOTP) {
            throw new ApiError_1.ApiError(400, "Invalid OTP");
        }
        if (user?.otp?.expiresAt < new Date()) {
            throw new ApiError_1.ApiError(400, "OTP expired");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.isVerified = true;
        user.otp = "";
        user.otpExpires = undefined;
        user.accessToken = String(accessToken);
        user.refreshToken = String(refreshToken);
        await user.save();
        return { user, accessToken, refreshToken };
    }
    if (user?.isVerified) {
        throw new ApiError_1.ApiError(400, "User already verified");
    }
    const verifyOTP = (0, crypto_hash_1.verifyHashPassword)(String(otp), user?.otp?.slug, user?.otp?.code);
    switch (true) {
        case !verifyOTP:
            throw new ApiError_1.ApiError(400, "Invalid OTP");
        case user?.otp?.expiresAt < new Date():
            throw new ApiError_1.ApiError(400, "OTP expired");
        case verifyOTP:
            const accessToken = await (0, token_1.generateAccessToken)({ _id: user._id, role: user.role });
            const refreshToken = await (0, token_1.generateRefreshToken)({ _id: user._id, role: user.role });
            user.isVerified = true;
            user.otp = "";
            user.otpExpires = undefined;
            user.accessToken = String(accessToken);
            user.refreshToken = String(refreshToken);
            await user.save();
            return { user, accessToken, refreshToken };
        default:
            throw new ApiError_1.ApiError(404, "User not found");
    }
};
const loginService = async (req) => {
    const { email, password } = req.body;
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const verifyPassword = (0, crypto_hash_1.verifyHashPassword)(password, user.slug, user.password);
    if (!verifyPassword) {
        throw new ApiError_1.ApiError(400, "Invalid password");
    }
    if (!user.isVerified) {
        throw new ApiError_1.ApiError(400, "User not verified");
    }
    if (user.status === user_interface_1.STATUS.BANNED) {
        throw new ApiError_1.ApiError(400, "User is banned");
    }
    if (user.status === user_interface_1.STATUS.BLOCK) {
        throw new ApiError_1.ApiError(400, "User is blocked");
    }
    if (user.status === user_interface_1.STATUS.DELETED) {
        throw new ApiError_1.ApiError(400, "User is deleted");
    }
    const accessToken = await (0, token_1.generateAccessToken)({ _id: user._id, role: user.role });
    const refreshToken = await (0, token_1.generateRefreshToken)({ _id: user._id, role: user.role });
    user.accessToken = String(accessToken);
    user.refreshToken = String(refreshToken);
    await user.save();
    const userWithoutPassword = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    return { userWithoutPassword, accessToken, refreshToken };
};
const changePasswordService = async (req) => {
    const { oldPassword, newPassword } = req.body;
    const user = await user_model_1.User.findById(req._id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const verifyPassword = (0, crypto_hash_1.verifyHashPassword)(oldPassword, user.slug, user.password);
    if (!verifyPassword) {
        throw new ApiError_1.ApiError(400, "Invalid password");
    }
    const { slug, hash } = (0, crypto_hash_1.createHashPassword)(newPassword);
    const updateResult = await user_model_1.User.updateOne({ _id: user._id }, { $set: { password: hash, slug: slug } });
    return { success: true, message: "Password changed successfully" };
};
const toggleTwoFactorService = async (req) => {
    const user = await user_model_1.User.findById(req._id);
    const cacheKey = `user:${req._id}`;
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    user.isTwoFactorEnabled = !user.isTwoFactorEnabled;
    await user.save();
    await redis_1.default.del(cacheKey);
    return {
        statusCode: 200,
        message: "Two-factor authentication " + (user.isTwoFactorEnabled ? "enabled" : "disabled")
    };
};
const logoutService = async (req) => {
    const user = await user_model_1.User.findById(req._id);
    const cacheKey = `user:${req._id}`;
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    await redis_1.default.del(cacheKey);
    user.accessToken = "";
    user.refreshToken = "";
    await user.save();
    return { user };
};
const getCurrentUserService = async (req) => {
    const cacheKey = `user:${req._id}`;
    try {
        const cachedUser = await redis_1.default.get(cacheKey);
        if (cachedUser)
            return JSON.parse(cachedUser);
    }
    catch (err) {
        console.log("Redis error:", err);
    }
    const user = await user_model_1.User.findById(req._id)
        .select("-password -accessToken -refreshToken -otp -__v ")
        .lean();
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    await redis_1.default.set(cacheKey, JSON.stringify(user), {
        EX: 60 * 60 // 1 hour
    });
    return user;
};
const resendOTPService = async (req) => {
    const { email } = req.body;
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const { slug, hash } = (0, crypto_hash_1.createHashPassword)(otp);
    const otpData = {
        code: hash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        slug: slug
    };
    await (0, sendEmail_1.sendEmail)(email, "Verify your email", otp);
    await user_model_1.User.updateOne({ _id: user._id }, { $set: { otp: otpData } });
    return { success: true, message: "OTP sent successfully" };
};
exports.authService = {
    registerService,
    loginService,
    verifyUserService,
    logoutService,
    getCurrentUserService,
    changePasswordService,
    resendOTPService,
    toggleTwoFactorService
};
