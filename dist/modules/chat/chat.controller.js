"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const chat_service_1 = require("./chat.service");
exports.ChatController = {
    sendMessage: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { message, userId, chatId } = req.body;
        if (!message || !userId) {
            throw new ApiError_1.ApiError(400, "Message and userId are required");
        }
        const result = await (0, chat_service_1.askAI)(userId, message, chatId);
        res.json({
            success: true,
            reply: result.reply,
            model: result.modelUsed,
        });
    }),
    streamAI: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { message, userId, chatId } = req.body;
        if (!message || !userId) {
            throw new ApiError_1.ApiError(400, "Message and userId are required");
        }
        const result = await (0, chat_service_1.streamAI)(userId, message, chatId, res);
        res.json({
            success: true,
            // reply: result.reply,
            // model: result.modelUsed,
            result
        });
    }),
    getAllChats: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await (0, chat_service_1.getAllChats)(req._id);
        res.status(result?.success ? 200 : 400).json({
            success: result?.success,
            chats: result?.chats,
            message: result?.message
        });
    }),
    getSingleChatHistory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await (0, chat_service_1.getSingleChatHistory)(req._id, req.params.chatId);
        res.status(result?.success ? 200 : 400).json({
            success: result?.success,
            chat: result?.chat,
            message: result?.message
        });
    }),
    deleteChat: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await (0, chat_service_1.deleteChat)(req._id, req.params.chatId);
        res.status(result?.success ? 200 : 400).json({
            success: result?.success,
            message: result?.message
        });
    })
};
