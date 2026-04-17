import { Queue } from 'bullmq';
import { redisQueueConnection } from '../config/redis';



const emailQueue = new Queue('email-queue', { connection: redisQueueConnection });

export async function sendEmailQueue(data: { to: string, sub: string, otp: string }) {
    try {
        const res = await emailQueue.add('send-email', {
            to: data.to,
            sub: data.sub,
            otp: data.otp
        },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000
                },
                removeOnComplete: {
                    count: 1000
                },
                removeOnFail: {
                    count: 500
                },
            }

        );

        console.log('Job added to send email queue', res.id);
        return res;
    } catch (error) {
        console.error('Error adding job to send email queue', error);
        throw error;
    }
}

