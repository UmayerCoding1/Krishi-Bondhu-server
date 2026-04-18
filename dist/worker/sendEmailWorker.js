"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisQueueConnection = void 0;
const bullmq_1 = require("bullmq");
const sendEmail_1 = require("../services/sendEmail");
exports.redisQueueConnection = {
    url: process.env.REDIS_URL || "127.0.0.1",
    tls: {},
    maxRetriesPerRequest: null,
};
const emailWorker = new bullmq_1.Worker('email-queue', async (job) => {
    console.log(`Worker 1 processing job ${job.id}`);
    try {
        const { to, sub, otp } = job.data;
        await (0, sendEmail_1.sendEmail)(to, sub, otp);
        console.log(`Worker 1 processed job ${job.id}`);
    }
    catch (error) {
        console.error(`Worker 1 failed - Job ${job.id}:`, error.message);
        // send retry-queue
    }
}, { connection: exports.redisQueueConnection });
emailWorker.on('failed', (job, error) => {
    console.error(`Worker 1 failed - Job ${job?.id}:`, error.message);
});
