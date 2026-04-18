import { Worker } from 'bullmq';
import { sendEmail } from '../services/sendEmail';
export const redisQueueConnection = {
    url: process.env.REDIS_URL || "127.0.0.1",
    tls: {},
    maxRetriesPerRequest: null,

};


const emailWorker = new Worker('email-queue', async (job) => {
    console.log(`Worker 1 processing job ${job.id}`);
    try {
        const { to, sub, otp } = job.data;
        await sendEmail(to, sub, otp);
        console.log(`Worker 1 processed job ${job.id}`);
    } catch (error: any) {
        console.error(`Worker 1 failed - Job ${job.id}:`, error.message);

        // send retry-queue

    }
}, { connection: redisQueueConnection });

emailWorker.on('failed', (job, error) => {
    console.error(`Worker 1 failed - Job ${job?.id}:`, error.message);
});