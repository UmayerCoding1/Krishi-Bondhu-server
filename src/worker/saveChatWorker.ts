import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });
import { Worker } from 'bullmq';

import { Chat } from '../modules/chat/chat.model';
import { redisQueueConnection } from '../config/redis';
import { connectDB } from '../config/db';



export const saveMessage = async (
    userId: string,
    chatId: string,
    role: string,
    content: string
) => {
    await connectDB();
    const chat = await Chat.updateOne(
        { userId, chatId },
        { $push: { messages: { role, content } } }
    );

    return chat;
};

const saveChatWorker = new Worker(
    'saveChat',
    async (job) => {
        console.log('processing: ' + job.id)
        const { userId, chatId, role, content } = job.data;
        await saveMessage(userId, chatId, role, content);

        console.log('processed: ' + job.id)
    },
    {
        connection: redisQueueConnection,
        concurrency: 2,



    }
);

saveChatWorker.on('failed', (job, error) => {
    console.error(`Worker 1 failed - Job ${job?.id}:`, error);
});