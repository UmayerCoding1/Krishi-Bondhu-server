import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { askAI, deleteChat, getAChatHistory, getAllChats, getSingleChatHistory, streamAI } from "./chat.service";

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
    }),


    getAllChats: asyncHandler(async (req: Request, res: Response) => {
        const result = await getAllChats(req._id);
        res.status(result?.success ? 200 : 400).json({
            success: result?.success,
            chats: result?.chats,
            message: result?.message
        });
    }),

    getSingleChatHistory: asyncHandler(async (req: Request, res: Response) => {
        const result = await getSingleChatHistory(req._id, req.params.chatId);
        res.status(result?.success ? 200 : 400).json({
            success: result?.success,
            chat: result?.chat,
            message: result?.message
        });
    }),

    deleteChat: asyncHandler(async (req: Request, res: Response) => {
        const result = await deleteChat(req._id, req.params.chatId);
        res.status(result?.success ? 200 : 400).json({
            success: result?.success,
            message: result?.message
        });
    })
}