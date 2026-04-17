"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const bullmq_1 = require("bullmq");
const emailQueue = new bullmq_1.Queue('email-queue');
async function sendEmail(data) {
    await emailQueue.add('send-email', data);
}
