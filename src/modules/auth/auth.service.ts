import { Request, Response } from "express";
import { User } from "../user/user.model";
import { ApiError } from "../../utils/ApiError";
import { createHashPassword, verifyHashPassword } from "../../utils/crypto-hash";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { ApiResponse } from "../../utils/ApiResponse";
import { sendEmailQueue } from "../../queue/sendEmailQueue";
import redisClient from "../../config/redis";


const registerService = async (req: Request) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (existingUser.isVerified) {
            return new ApiResponse(400, "User already verified");
        }
        else {
            return new ApiResponse(400, "User already exists");
        }

    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const { slug, hash } = createHashPassword(otp);

    const otpData = {
        code: hash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        slug: slug

    }

    sendEmailQueue({ to: email, sub: "Verify your email", otp });
    const user = await User.create({ name, email, password, otp: otpData });
    return user;


};


const verifyUserService = async (req: Request) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });


    if (user?.isVerified) {
        throw new ApiError(400, "User already verified");
    }

    const verifyOTP = verifyHashPassword(String(otp), user?.otp?.slug, user?.otp?.code);



    switch (true) {
        case !verifyOTP:
            throw new ApiError(400, "Invalid OTP");

        case user?.otp?.expiresAt < new Date():
            throw new ApiError(400, "OTP expired");


        case verifyOTP:
            const accessToken = await generateAccessToken({ _id: user._id, role: user.role });
            const refreshToken = await generateRefreshToken({ _id: user._id, role: user.role });
            user.isVerified = true;
            user.otp = "";
            user.otpExpires = undefined;
            user.accessToken = String(accessToken);
            user.refreshToken = String(refreshToken);
            await user.save();

            return { user, accessToken, refreshToken };


        default:
            throw new ApiError(404, "User not found");
    }
};


const loginService = async (req: Request) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const verifyPassword = verifyHashPassword(password, user.slug, user.password);
    if (!verifyPassword) {
        throw new ApiError(400, "Invalid password");
    }
    const accessToken = await generateAccessToken({ _id: user._id, role: user.role });
    const refreshToken = await generateRefreshToken({ _id: user._id, role: user.role });
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
    }
    return { userWithoutPassword, accessToken, refreshToken };
}

const logoutService = async (req: Request) => {
    const user = await User.findById(req._id)
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.accessToken = "";
    user.refreshToken = "";
    await user.save();
    return { user };
}

const getCurrentUserService = async (req: Request) => {

    const cacheKey = `user:${req._id}`;

    try {
        const cachedUser = await redisClient.get(cacheKey);
        if (cachedUser) return JSON.parse(cachedUser);
    } catch (err) {
        console.log("Redis error:", err);
    }

    const user = await User.findById(req._id)
        .select("-password -accessToken -refreshToken -otp -__v ")
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await redisClient.set(cacheKey, JSON.stringify(user), {
        EX: 60 * 60 // 1 hour
    });

    return user;
};

export const authService = {
    registerService,
    loginService,
    verifyUserService,
    logoutService,
    getCurrentUserService
}