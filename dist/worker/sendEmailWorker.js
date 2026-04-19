"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const sendEmail_1 = require("../services/sendEmail");
const redis_1 = require("../config/redis");
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
}, {
    connection: redis_1.redisQueueConnection,
    concurrency: 2,
    limiter: {
        max: 5,
        duration: 1000
    }
});
emailWorker.on('failed', (job, error) => {
    console.error(`Worker 1 failed - Job ${job?.id}:`, error.message);
});
