import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const attemptChecker = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Todo  
})