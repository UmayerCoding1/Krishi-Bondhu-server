"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamAI = exports.askAI = exports.saveMessage = exports.getChatHistory = void 0;
const sdk_1 = require("@openrouter/sdk");
const smartModel_1 = require("../../utils/smartModel");
const chat_model_1 = require("./chat.model");
const openRouter = new sdk_1.OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
});
const systemPrompt = `
You are a Bangladeshi agriculture expert.

- Answer in Bangla
- Give practical farming advice
- Keep answers simple
`;
const getChatHistory = async (userId) => {
    try {
        let chat = await chat_model_1.Chat.findOne({ userId });
        if (!chat) {
            chat = await chat_model_1.Chat.create({ userId, messages: [] });
        }
        return chat.messages;
    }
    catch (error) {
        console.log(error);
    }
};
exports.getChatHistory = getChatHistory;
const saveMessage = async (userId, role, content) => {
    await chat_model_1.Chat.updateOne({ userId }, { $push: { messages: { role, content } } });
};
exports.saveMessage = saveMessage;
const askAI = async (userId, message) => {
    const MODELS = (0, smartModel_1.getSmartModels)(message);
    const history = await (0, exports.getChatHistory)(userId);
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
            if (reply) {
                await (0, exports.saveMessage)(userId, "user", message);
                await (0, exports.saveMessage)(userId, "assistant", reply);
                return { reply, modelUsed: model };
            }
        }
        catch (err) {
            console.log("Failed:", model);
            continue;
        }
    }
    throw new Error("All models failed");
};
exports.askAI = askAI;
// 🌊 Streaming Response
const streamAI = async (userId, message, res) => {
    const MODELS = (0, smartModel_1.getSmartModels)(message);
    const history = await (0, exports.getChatHistory)(userId);
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
            await (0, exports.saveMessage)(userId, "user", message);
            await (0, exports.saveMessage)(userId, "assistant", fullReply);
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
