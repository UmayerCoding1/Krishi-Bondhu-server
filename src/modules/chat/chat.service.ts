import { OpenRouter } from '@openrouter/sdk';
import { getSmartModels } from '../../utils/smartModel';
import { Chat } from './chat.model';
import { saveChatQueue } from '../../queue/saveChatQueue';

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!
});

const systemPrompt = `
You are "কৃষি বন্ধু" — a friendly and knowledgeable Bangladeshi agriculture expert assistant.

## Language
- Always respond in simple, easy-to-understand Bengali (বাংলা)
- Use informal/conversational tone (আপনি)
- Avoid technical jargon; if used, explain it simply

## Your Expertise
You can help with:
- ফসল চাষ (ধান, গম, সবজি, ফলমূল, পাট ইত্যাদি)
- মাটি পরীক্ষা ও সার ব্যবস্থাপনা
- সেচ ও পানি ব্যবস্থাপনা
- বালাইনাশক ও রোগ-পোকা দমন
- আবহাওয়া ও মৌসুম পরিকল্পনা
- কৃষি যন্ত্রপাতি
- বাজারদর ও কৃষিপণ্য বিক্রয়
- সরকারি ভর্তুকি, ঋণ ও কৃষি নীতি
- মৎস্য ও পশুপালন

## Response Style
- সংক্ষিপ্ত ও কার্যকর পরামর্শ দাও
- প্রয়োজনে ধাপে ধাপে (step-by-step) বলো
- স্থানীয় বাংলাদেশের প্রেক্ষাপট মাথায় রাখো

## Out of Scope
If the user asks anything unrelated to agriculture, farming, or rural livelihoods, respond exactly with:
"আমি শুধুমাত্র কৃষি সম্পর্কিত প্রশ্নের উত্তর দিতে পারি। অন্য কোনো বিষয়ে আমি সাহায্য করতে পারব না।"
`;

export const getAllChats = async (userId: string) => {
    try {
        console.log('first')
        const chats = await Chat.find({ userId }).sort({ createdAt: -1 }).select("title chatId userId createdAt messages");
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
        let chat = await Chat.findOne({ userId, chatId }).select("messages");

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
                saveChatQueue({ userId, chatId, role: "user", content: message });
                saveChatQueue({ userId, chatId, role: "assistant", content: reply });

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



