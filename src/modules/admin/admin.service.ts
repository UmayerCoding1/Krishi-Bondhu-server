import { User } from "../user/user.model";

export const adminService = {
    adminAnalytics: async () => {
        try {
            const users = await User.countDocuments();


        } catch (error) {
            throw error;
        }
    }
}