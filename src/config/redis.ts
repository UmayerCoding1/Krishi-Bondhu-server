import { createClient } from "redis";

export const redisQueueConnection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
};

const redisClient = createClient({
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




export default redisClient;