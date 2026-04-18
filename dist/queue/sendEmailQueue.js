"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisQueueConnection = void 0;
exports.sendEmailQueue = sendEmailQueue;
const bullmq_1 = require("bullmq");
exports.redisQueueConnection = {
    url: process.env.REDIS_URL || "127.0.0.1",
    tls: {},
    maxRetriesPerRequest: null,
};
const emailQueue = new bullmq_1.Queue('email-queue', { connection: exports.redisQueueConnection });
async function sendEmailQueue(data) {
    try {
        // Debug only (remove in production)
        if (process.env.NODE_ENV !== "production") {
            console.log("REDIS_URL:", process.env.REDIS_URL);
        }
        const job = await emailQueue.add("send-email", {
            to: data.to,
            sub: data.sub,
            otp: data.otp,
        }, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 2000,
            },
            removeOnComplete: true, // better than count
            removeOnFail: false, // keep failed jobs for debugging
            delay: 0,
        });
        console.log(" Job added to email queue:", job.id);
        return {
            success: true,
            jobId: job.id,
        };
    }
    catch (error) {
        console.error(" Error adding job to email queue:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}
