"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamAI = exports.askAI = exports.saveMessage = exports.getAChatHistory = exports.deleteChat = exports.getSingleChatHistory = exports.getAllChats = void 0;
const sdk_1 = require("@openrouter/sdk");
const smartModel_1 = require("../../utils/smartModel");
const chat_model_1 = require("./chat.model");
const saveChatQueue_1 = require("../../queue/saveChatQueue");
const openRouter = new sdk_1.OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
});
const systemPrompt = `
You are a Bangladeshi agriculture expert.

- Answer in Banglaz
- Provide practical farming advice
- Keep answers simple and concise
- If the user asks about crops, soil, fertilizers, pesticides, irrigation, weather, market, government policy, etc., then answer the question
- If the user asks anything outside of agriculture, then respond with:
"আমি শুধুমাত্র কৃষি সম্পর্কিত প্রশ্নের জন্য প্রশিক্ষিত।"
`;
const getAllChats = async (userId) => {
    try {
        const chats = await chat_model_1.Chat.find({ userId }).sort({ createdAt: -1 }).select("title chatId userId createdAt messages");
        if (!chats || chats.length === 0) {
            return {
                success: false,
                message: "No chats found",
                chats: []
            };
        }
        return {
            success: true,
            message: "Chats fetched successfully",
            chats
        };
    }
    catch (error) {
        console.log(error);
    }
};
exports.getAllChats = getAllChats;
const getSingleChatHistory = async (userId, chatId) => {
    const chat = await chat_model_1.Chat.findOne({ userId, chatId });
    if (!chat) {
        return {
            success: false,
            message: "Chat not found",
            chat: null
        };
    }
    return {
        success: true,
        message: "Chat fetched successfully",
        chat
    };
};
exports.getSingleChatHistory = getSingleChatHistory;
const deleteChat = async (userId, chatId) => {
    const chat = await chat_model_1.Chat.deleteOne({ userId, chatId });
    if (!chat) {
        return {
            success: false,
            message: "Chat not found",
            chat: null
        };
    }
    return {
        success: true,
        message: "Chat deleted successfully",
    };
};
exports.deleteChat = deleteChat;
// this ai AI hepler function
const getAChatHistory = async (userId, chatId, title) => {
    try {
        let chat = await chat_model_1.Chat.findOne({ userId, chatId }).select("messages");
        if (!chat) {
            chat = await chat_model_1.Chat.create({ userId, chatId, title, messages: [] });
        }
        return chat.messages;
    }
    catch (error) {
        console.log(error);
    }
};
exports.getAChatHistory = getAChatHistory;
const saveMessage = async (userId, chatId, role, content) => {
    await chat_model_1.Chat.updateOne({ userId, chatId }, { $push: { messages: { role, content } } });
};
exports.saveMessage = saveMessage;
const askAI = async (userId, message, chatId) => {
    const MODELS = (0, smartModel_1.getSmartModels)(message);
    const history = await (0, exports.getAChatHistory)(userId, chatId, message);
    console.log('history', history);
    for (const model of MODELS) {
        try {
            const completion = await openRouter.chat.send({
                chatRequest: {
                    model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...history,
                        { role: "user", content: message },
                    ],
                },
            });
            const reply = completion.choices?.[0]?.message?.content;
            if (!reply || reply.trim() === "") {
                continue;
            }
            if (reply) {
                (0, saveChatQueue_1.saveChatQueue)({ userId, chatId, role: "user", content: message });
                (0, saveChatQueue_1.saveChatQueue)({ userId, chatId, role: "assistant", content: reply });
                return { reply, modelUsed: model };
            }
        }
        catch (err) {
            console.error(`Model ${model} failed:`, err.message);
            continue;
        }
    }
    throw new Error("All models failed");
};
exports.askAI = askAI;
// Streaming Response
const streamAI = async (userId, message, chatId, res) => {
    const MODELS = (0, smartModel_1.getSmartModels)(message);
    const history = await (0, exports.getAChatHistory)(userId, chatId, message);
    for (const model of MODELS) {
        try {
            const stream = await openRouter.chat.send({
                chatRequest: {
                    model,
                    stream: true,
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt,
                        },
                        ...history,
                        {
                            role: "user",
                            content: message,
                        },
                    ],
                },
            });
            let fullReply = "";
            for await (const chunk of stream) {
                const content = chunk.choices?.[0]?.delta?.content;
                if (content) {
                    fullReply += content;
                    res.write(content);
                }
            }
            await (0, exports.saveMessage)(userId, chatId, "user", message);
            await (0, exports.saveMessage)(userId, chatId, "assistant", fullReply);
            res.end();
            return;
        }
        catch (err) {
            console.log("Stream failed:", model);
            continue;
        }
    }
    res.end("সব মডেল কাজ করছে না 😢");
};
exports.streamAI = streamAI;
