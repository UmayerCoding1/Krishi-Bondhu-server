import { Request } from "express";
import { User } from "./user.model";

export const userServices = {
    getAllUsersService: async (req: Request) => {
        const { page, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const users = await User.find().skip(skip).limit(Number(limit)).select("-password -accessToken -refreshToken -otp -__v ");
        const total = await User.countDocuments();
        const tatalPage = Math.ceil(total / Number(limit));
        return { users, total, tatalPage };
    }
}