"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisQueueConnection = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
let redisQueueConnection;
if (process.env.NODE_ENV === "production") {
    exports.redisQueueConnection = redisQueueConnection = {
        url: process.env.REDIS_URL || "127.0.0.1",
        tls: {},
        maxRetriesPerRequest: null,
    };
}
else {
    exports.redisQueueConnection = redisQueueConnection = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        url: process.env.REDIS_URL,
    };
}
console.log(redisQueueConnection);
