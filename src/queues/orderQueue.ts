import { Queue, QueueEvents } from "bullmq";
import { redis } from "../config/redis";


export const orderQueue = new Queue('order-confirmation', {
    connection: redis as any,
    defaultJobOptions: {
        attempts: 3,    // Retry up to 3 times
        backoff: {type: "exponential", delay: 1000}  // Wait longer on each retry
    }
});


export const orderQueueEvents = new QueueEvents('order-confirmation', {
    connection: redis as any
});

orderQueueEvents.on('completed', ({ jobId }) => {
  console.log(`Job ${jobId} has completed`);
});