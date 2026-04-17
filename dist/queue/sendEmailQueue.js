"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailQueue = sendEmailQueue;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const emailQueue = new bullmq_1.Queue('email-queue', { connection: redis_1.redisQueueConnection });
async function sendEmailQueue(data) {
    try {
        const res = await emailQueue.add('send-email', {
            to: data.to,
            sub: data.sub,
            otp: data.otp
        }, {
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
        });
        console.log('Job added to send email queue', res.id);
        return res;
    }
    catch (error) {
        console.error('Error adding job to send email queue', error);
        throw error;
    }
}
