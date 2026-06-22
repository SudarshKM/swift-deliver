import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis', port: 6379,
    // password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => {
    console.log('Redis connected');
});

redis.on('error', (err) => {
    console.log('Redis error', err);
});