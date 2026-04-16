"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_service_1 = require("./admin.service");
exports.adminController = {
    adminAnalytics: async (req, res) => {
        try {
            const analytics = await admin_service_1.adminService.adminAnalytics();
            res.status(200).json(analytics);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
