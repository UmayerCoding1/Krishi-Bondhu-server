"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_model_1 = require("../user/user.model");
const ApiError_1 = require("../../utils/ApiError");
const sendEmail_1 = require("../../services/sendEmail");
const crypto_hash_1 = require("../../utils/crypto-hash");
const token_1 = require("../../utils/token");
const registerService = async (req) => {
    const { name, email, password } = req.body;
    const existingUser = await user_model_1.User.findOne({ email });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const { slug, hash } = (0, crypto_hash_1.createHashPassword)(otp);
    const otpData = {
        code: hash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        slug: slug
    };
    switch (true) {
        case !!existingUser:
            throw new ApiError_1.ApiError(400, "User already exists");
        case !!existingUser && existingUser.isVerified:
            throw new ApiError_1.ApiError(400, "User already verified");
        default:
            const sendOtp = await (0, sendEmail_1.sendEmail)(email, "Verify your email", otp);
            if (sendOtp.success) {
                const user = await user_model_1.User.create({ name, email, password, otp: otpData });
                return user;
            }
    }
};
const verifyUserService = async (req) => {
    const { email, otp } = req.body;
    const user = await user_model_1.User.findOne({ email });
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
            const accessToken = await (0, token_1.generateAccessToken)({ _id: user._id });
            const refreshToken = await (0, token_1.generateRefreshToken)({ _id: user._id });
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
    const accessToken = await (0, token_1.generateAccessToken)({ _id: user._id });
    const refreshToken = await (0, token_1.generateRefreshToken)({ _id: user._id });
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
const logoutService = async (req) => {
    const user = await user_model_1.User.findById(req._id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    user.accessToken = "";
    user.refreshToken = "";
    await user.save();
    return { user };
};
const getCurrentUserService = async (req) => {
    const user = await user_model_1.User.findById(req._id).select('-password -refreshToken -accessToken -otp -slug ');
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    return user;
};
exports.authService = {
    registerService,
    loginService,
    verifyUserService,
    logoutService,
    getCurrentUserService
};
