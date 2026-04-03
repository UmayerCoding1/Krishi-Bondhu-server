import { Request } from "express";
import { User } from "../user/user.model";
import { ApiError } from "../../utils/ApiError";


const registerService = async (req: Request) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    switch (true) {
        case !!existingUser:
            throw new ApiError(400, "User already exists");

        case !!existingUser && existingUser.attempt === 0:
            throw new ApiError(400, "You have exceeded the maximum attempts");

        case !!existingUser && existingUser.isVerified:
            throw new ApiError(400, "User already verified");

        default:
            const user = await User.create({ name, email, password });
            return user;
    }
};

export const authService = {
    registerService
}