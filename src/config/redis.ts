import { createClient } from "redis";
import dotenv from "dotenv";
import { RedisOptions } from "bullmq";

dotenv.config();

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

let redisQueueConnection: RedisOptions;

if (process.env.NODE_ENV === "production") {
    redisQueueConnection = {
        url: process.env.REDIS_URL || "127.0.0.1",
        tls: {},
        maxRetriesPerRequest: null,

    }
} else {
    redisQueueConnection = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        url: process.env.REDIS_URL!,
    };
}
export { redisQueueConnection };
console.log(redisQueueConnection);