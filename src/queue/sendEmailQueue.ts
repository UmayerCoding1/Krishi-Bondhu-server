import { Queue } from 'bullmq';
import { redisQueueConnection } from '../config/redis';




const emailQueue = new Queue('email-queue', { connection: redisQueueConnection });

export async function sendEmailQueue(data: {
    to: string;
    sub: string;
    otp: string;
}) {
    try {
        // Debug only (remove in production)
        if (process.env.NODE_ENV !== "production") {
            console.log("REDIS_URL:", process.env.REDIS_URL);
        }

        const job = await emailQueue.add(
            "send-email",
            {
                to: data.to,
                sub: data.sub,
                otp: data.otp,
            },
            {
                attempts: 3,

                backoff: {
                    type: "exponential",
                    delay: 2000,
                },


                removeOnComplete: true, // better than count
                removeOnFail: false, // keep failed jobs for debugging

                delay: 0,
            }
        );

        console.log(" Job added to email queue:", job.id);

        return {
            success: true,
            jobId: job.id,
        };
    } catch (error: any) {
        console.error(" Error adding job to email queue:", error.message);

        return {
            success: false,
            message: error.message,
        };
    }
}