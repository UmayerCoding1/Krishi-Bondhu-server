import { Queue, Worker } from 'bullmq';
import { Chat } from '../modules/chat/chat.model';
import { redisQueueConnection } from '../config/redis';





export const ChatQueue = new Queue('saveChat', { connection: redisQueueConnection });

export async function saveChatQueue(data: {
    userId: string;
    chatId: string;
    role: string;
    content: string;
}) {
    try {
        const job = await ChatQueue.add("save-chat", data, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 2000,
            },
            removeOnComplete: true,
            removeOnFail: false,
            delay: 0,
        });
        console.log("Job added to chat queue:", job.id);
        return {
            success: true,
            jobId: job.id,
        };
    } catch (error: any) {
        console.error("Error adding job to chat queue:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}