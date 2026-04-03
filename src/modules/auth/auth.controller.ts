import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";

const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.registerService(req);
    if (!result.success) {
        console.log(result)
        return res.status(result.statusCode).json(new ApiResponse(result.statusCode, result.message || "Something went wrong"));
    }
    return res.status(201).json(new ApiResponse(201, result, "User registered successfully"));
})

export const authController = {
    register
}