import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { askAI, streamAI } from "./chat.service";

export const ChatController = {
    sendMessage: asyncHandler(async (req: Request, res: Response) => {
        const { message, userId } = req.body;
        if (!message || !userId) {
            throw new ApiError(400, "Message and userId are required");
        }

        const result = await askAI(userId, message);
        res.json({
            success: true,
            reply: result.reply,
            model: result.modelUsed,
        });
    }),

    streamAI: asyncHandler(async (req: Request, res: Response) => {
        const { message, userId } = req.body;
        if (!message || !userId) {
            throw new ApiError(400, "Message and userId are required");
        }

        const result = await streamAI(userId, message, res);
        res.json({
            success: true,
            // reply: result.reply,
            // model: result.modelUsed,
            result
        });
    })
}