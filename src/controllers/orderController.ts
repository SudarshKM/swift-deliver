import { Request, Response } from "express";
import Order from "../models/Order";
import mongoose from "mongoose";
import { orderQueue } from "../queues/orderQueue";
import { JobName } from "../types/types";


export const createOrder = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { restaurant, items, totalAmount, status, deliveryAddress } = req.body;
        // MUST pass session to .create() and wrap in array
        const [newOrder] = await Order.create([{
            customer: (req as any).user.userId,
            items,
            status,
            totalAmount,
            deliveryAddress,
            restaurant,
            createdAt: Date.now()
        }], { session });

        await orderQueue.add(JobName.ORDER_CONFIRMATION, {
            orderId: newOrder._id,
            customerEmail: req.body.customerEmail,
            totalAmount: newOrder.totalAmount
        })

        res.status(201).json({ message: "Order created", order: newOrder });
        await session.commitTransaction();
    } catch (e) {
        await session.abortTransaction();
        throw e; // Rethrow to global error handler
    } finally {
        await session.endSession();
    }
};