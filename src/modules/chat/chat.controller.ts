import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { askAI, streamAI } from "./chat.service";

export const ChatController = {
    sendMessage: asyncHandler(async (req: Request, res: Response) => {
        const { message, userId, chatId } = req.body;
        if (!message || !userId) {
            throw new ApiError(400, "Message and userId are required");
        }

        const result = await askAI(userId, message, chatId);
        res.json({
            success: true,
            reply: result.reply,
            model: result.modelUsed,
        });
    }),

    streamAI: asyncHandler(async (req: Request, res: Response) => {
        const { message, userId, chatId } = req.body;
        if (!message || !userId) {
            throw new ApiError(400, "Message and userId are required");
        }

        const result = await streamAI(userId, message, chatId, res);
        res.json({
            success: true,
            // reply: result.reply,
            // model: result.modelUsed,
            result
        });
    })
}