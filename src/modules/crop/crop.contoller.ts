import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { cropService } from "./crop.service";



export const getCropDataInAi = asyncHandler(async (req: Request, res: Response) => {

    await cropService.getCropDataOnAi(req, res);



});

