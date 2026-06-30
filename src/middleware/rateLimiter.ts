import rateLimit from 'express-rate-limit';
import { redis } from '../config/redis';

export const apiLimiter = rateLimit({
  store: new (require('rate-limit-redis').default)({
    client: redis,
    prefix: 'ratelimit:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});