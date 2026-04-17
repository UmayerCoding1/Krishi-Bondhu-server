import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.REDIS_URL);

export const redisQueueConnection = {
    url: process.env.REDIS_URL!,
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