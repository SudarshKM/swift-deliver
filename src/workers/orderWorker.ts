import { Worker } from "bullmq";
import { redis } from "../config/redis";



export const orderWorker = new Worker('order-confirmation', async (job) => {
    const { orderId, customerEmail } = job.data;

    console.log(`Processing order ${orderId} for ${customerEmail}`);

    // TODO: Real work here
    // - Send email (use nodemailer later)
    // - Notify restaurant
    // - Update analytics

    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`✅ Order ${orderId} processed successfully`);
}, {
    connection: redis as any,
    concurrency: 5  // Process up to 5 jobs simultaneously
});

orderWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});