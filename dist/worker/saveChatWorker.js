"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessage = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../../.env' });
const bullmq_1 = require("bullmq");
const chat_model_1 = require("../modules/chat/chat.model");
const redis_1 = require("../config/redis");
const db_1 = require("../config/db");
const saveMessage = async (userId, chatId, role, content) => {
    await (0, db_1.connectDB)();
    const chat = await chat_model_1.Chat.updateOne({ userId, chatId }, { $push: { messages: { role, content } } });
    return chat;
};
exports.saveMessage = saveMessage;
const saveChatWorker = new bullmq_1.Worker('saveChat', async (job) => {
    console.log('processing: ' + job.id);
    const { userId, chatId, role, content } = job.data;
    await (0, exports.saveMessage)(userId, chatId, role, content);
    console.log('processed: ' + job.id);
}, {
    connection: redis_1.redisQueueConnection,
    concurrency: 2,
});
saveChatWorker.on('failed', (job, error) => {
    console.error(`Worker 1 failed - Job ${job?.id}:`, error);
});
