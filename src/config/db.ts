import mongoose from "mongoose";
import { dbLogger } from "./logger";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        dbLogger.info("MongoDB connected");
    } catch (err) {
        dbLogger.fatal({ err }, "MongoDB connection error");
        process.exit(1);
    }
}