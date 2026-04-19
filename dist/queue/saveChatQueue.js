"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatQueue = void 0;
exports.saveChatQueue = saveChatQueue;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.ChatQueue = new bullmq_1.Queue('saveChat', { connection: redis_1.redisQueueConnection });
async function saveChatQueue(data) {
    try {
        const job = await exports.ChatQueue.add("save-chat", data, {
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
    }
    catch (error) {
        console.error("Error adding job to chat queue:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}
