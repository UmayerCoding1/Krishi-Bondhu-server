import { OpenRouter } from '@openrouter/sdk';
import { getSmartModels } from '../../utils/smartModel';
import { Chat } from './chat.model';

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!
});

const systemPrompt = `
You are a Bangladeshi agriculture expert.

- Answer in Bangla
- Provide practical farming advice
- Keep answers simple and concise
- If the user asks about crops, soil, fertilizers, pesticides, irrigation, weather, market, government policy, etc., then answer the question
- If the user asks anything outside of agriculture, then respond with:
"আমি শুধুমাত্র কৃষি সম্পর্কিত প্রশ্নের জন্য প্রশিক্ষিত।"
`;

export const getChatHistory = async (userId: string, chatId: string, title: string) => {
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
    const history = await getChatHistory(userId, chatId, message);

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
                await saveMessage(userId, chatId, "user", message);
                await saveMessage(userId, chatId, "assistant", reply);

                return { reply, modelUsed: model };
            }
        } catch (err: any) {
            console.log("Failed:", model);
            continue;
        }
    }

    throw new Error("All models failed");
};

// 🌊 Streaming Response
export const streamAI = async (
    userId: string,
    message: string,
    chatId: string,
    res: any
) => {
    const MODELS = getSmartModels(message);
    const history = await getChatHistory(userId, chatId, message);

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

