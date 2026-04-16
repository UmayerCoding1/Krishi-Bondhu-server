import { adminService } from "./admin.service";
import { Request, Response } from "express";


export const adminController = {
    adminAnalytics: async (req: Request, res: Response) => {
        try {
            const analytics = await adminService.adminAnalytics();
            res.status(200).json(analytics);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}