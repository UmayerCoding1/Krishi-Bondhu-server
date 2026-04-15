import { OpenRouter } from '@openrouter/sdk';
import { getSmartModels } from '../../utils/smartModel';
import { Chat } from './chat.model';

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!
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

export const getAllChats = async (userId: string) => {
    try {
        const chats = await Chat.find({ userId }).sort({ createdAt: -1 }).select("title chatId userId createdAt");
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
    } catch (error) {
        console.log(error)
    }
};

export const getSingleChatHistory = async (userId: string, chatId: string | string[]) => {
    const chat = await Chat.findOne({ userId, chatId });
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
}

export const deleteChat = async (userId: string, chatId: string | string[]) => {
    const chat = await Chat.deleteOne({ userId, chatId });
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
}


// this ai AI hepler function
export const getAChatHistory = async (userId: string, chatId: string, title?: string) => {
    try {
        let chat = await Chat.findOne({ userId, chatId });

        if (!chat) {
            chat = await Chat.create({ userId, chatId, title, messages: [] });
        }

        return chat.messages;
    } catch (error) {
        console.log(error)
    }
};

export const saveMessage = async (
    userId: string,
    chatId: string,
    role: string,
    content: string
) => {
    await Chat.updateOne(
        { userId, chatId },
        { $push: { messages: { role, content } } }
    );
};

export const askAI = async (userId: string, message: string, chatId: string) => {
    const MODELS = getSmartModels(message);
    const history = await getAChatHistory(userId, chatId, message);

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
                await saveMessage(userId, chatId, "user", message);
                await saveMessage(userId, chatId, "assistant", reply);

                return { reply, modelUsed: model };
            }
        } catch (err: any) {
            console.error(`Model ${model} failed:`, err.message);
            continue;
        }
    }

    throw new Error("All models failed");
};

// Streaming Response
export const streamAI = async (
    userId: string,
    message: string,
    chatId: string,
    res: any
) => {
    const MODELS = getSmartModels(message);
    const history = await getAChatHistory(userId, chatId, message);

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

            await saveMessage(userId, chatId, "user", message);
            await saveMessage(userId, chatId, "assistant", fullReply);

            res.end();
            return;
        } catch (err) {
            console.log("Stream failed:", model);
            continue;
        }
    }

    res.end("সব মডেল কাজ করছে না 😢");
};



