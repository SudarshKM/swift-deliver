import { Queue, QueueEvents } from "bullmq";
import { redis } from "../config/redis";
import { queueLogger } from "../config/logger";
import { JobName } from "../types/types";


export const orderQueue = new Queue(JobName.ORDER_CONFIRMATION, {
    connection: redis as any,
    defaultJobOptions: {
        attempts: 3,    // Retry up to 3 times
        backoff: {type: "exponential", delay: 1000}  // Wait longer on each retry
    }
});


export const orderQueueEvents = new QueueEvents(JobName.ORDER_CONFIRMATION, {
    connection: redis as any
});

orderQueueEvents.on('completed', ({ jobId }) => {
  queueLogger.info({ jobId }, "Job completed");
});