import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { workerLogger } from "../config/logger";
import { JobName } from "../types/types";



export const orderWorker = new Worker(JobName.ORDER_CONFIRMATION, async (job) => {
    const { orderId, customerEmail } = job.data;

    workerLogger.info({ orderId, customerEmail }, "Processing order");

    // TODO: Real work here
    // - Send email (use nodemailer later)
    // - Notify restaurant
    // - Update analytics

    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 2000));
    workerLogger.info({ orderId }, "Order processed successfully");
}, {
    connection: redis as any,
    concurrency: 5  // Process up to 5 jobs simultaneously
});

orderWorker.on("failed", (job, err) => {
    workerLogger.error({ jobId: job?.id, err }, "Job failed");
});