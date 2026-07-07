import Redis from "ioredis";
import { redisLogger } from "./logger";

export const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis', port: 6379,
    maxRetriesPerRequest: null,
    // password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => {
    redisLogger.info('Redis connected');
});

redis.on('error', (err) => {
    redisLogger.error({ err }, 'Redis error');
});