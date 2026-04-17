"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisQueueConnection = void 0;
const redis_1 = require("redis");
exports.redisQueueConnection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
};
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
redisClient.on("connect", () => {
    console.log("Redis connected");
});
redisClient.on("error", (err) => {
    console.log("Redis error", err);
});
redisClient.connect().catch((err) => {
    console.error("Redis connection error", err);
});
exports.default = redisClient;
