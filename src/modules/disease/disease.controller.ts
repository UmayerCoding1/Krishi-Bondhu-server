import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { diseaseServices } from "./disease.service";


export const diseaseController = {
    diseaseDetection: asyncHandler(async (req: Request, res: Response) => {
        const result = await diseaseServices.diseaseDetection(req);
        res.status(result?.success ? 200 : 400).json({
            success: result?.success,
            message: result?.message,
            data: result?.data
        });
    })
}