import { Request } from "express";
import { User } from "../user/user.model";
import { ApiError } from "../../utils/ApiError";
import { sendEmail } from "../../services/sendEmail";
import { createHashPassword } from "../../utils/crypto-hash";


const registerService = async (req: Request) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const { slug, hash } = createHashPassword(otp);

    const otpData = {
        code: hash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        slug: slug

    }
    switch (true) {
        case !!existingUser:
            throw new ApiError(400, "User already exists");


        case !!existingUser && existingUser.isVerified:
            throw new ApiError(400, "User already verified");

        default:
            const sendOtp = await sendEmail(email, "Verify your email", otp);
            if (sendOtp.success) {
                const user = await User.create({ name, email, password, otp: otpData });
                return user;
            }
    }
};


const verifyUserService = async (req: Request) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });



    switch (true) {
        case !!user && user.attempt === 0:
            throw new ApiError(400, "You have exceeded the maximum attempts");

        case !!user && !user.isVerified:
            throw new ApiError(400, "User is not verified");

        case !!user && user.otp !== otp:
            throw new ApiError(400, "Invalid OTP");

        case !!user && user.otp === otp:
            user.isVerified = true;
            user.otp = "";
            user.otpExpires = undefined;
            await user.save();
            return user;

        default:
            throw new ApiError(404, "User not found");
    }
};


const loginService = async (req: Request) => {
    const { email, password } = req.body;

}

export const authService = {
    registerService,
    loginService,
    verifyUserService
}