"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const chat_service_1 = require("./chat.service");
exports.ChatController = {
    sendMessage: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { message, userId } = req.body;
        if (!message || !userId) {
            throw new ApiError_1.ApiError(400, "Message and userId are required");
        }
        const result = await (0, chat_service_1.askAI)(userId, message);
        res.json({
            success: true,
            reply: result.reply,
            model: result.modelUsed,
        });
    }),
    streamAI: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { message, userId } = req.body;
        if (!message || !userId) {
            throw new ApiError_1.ApiError(400, "Message and userId are required");
        }
        const result = await (0, chat_service_1.streamAI)(userId, message, res);
        res.json({
            success: true,
            // reply: result.reply,
            // model: result.modelUsed,
            result
        });
    })
};
