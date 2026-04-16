"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const user_model_1 = require("../user/user.model");
exports.adminService = {
    adminAnalytics: async () => {
        try {
            const users = await user_model_1.User.countDocuments();
        }
        catch (error) {
            throw error;
        }
    }
};
