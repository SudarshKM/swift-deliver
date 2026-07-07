import { Request, Response } from "express";
import Order from "../models/Order";
import Restaurant from "../models/Restaurant";
import mongoose from "mongoose";
import { orderQueue } from "../queues/orderQueue";
import { JobName, OrderStatus, UserRole } from "../types/types";



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

        await session.commitTransaction();
        res.status(201).json({ message: "Order created", order: newOrder });
    } catch (e) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw e; // Rethrow to global error handler
    } finally {
        await session.endSession();
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid order ID" });
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(id).session(session);
        if (!order) {
            if (session.inTransaction()) await session.abortTransaction();
            res.status(404).json({ message: "Order not found" });
            return;
        }

        const user = (req as any).user;

        // Role-based authorization check
        if (user.role === UserRole.CUSTOMER) {
            if (status !== OrderStatus.cancelled) {
                if (session.inTransaction()) await session.abortTransaction();
                res.status(403).json({ message: "Forbidden: Customers can only cancel orders" });
                return;
            }
            if (order.customer.toString() !== user.userId) {
                if (session.inTransaction()) await session.abortTransaction();
                res.status(403).json({ message: "Forbidden: You do not own this order" });
                return;
            }
            if (![OrderStatus.pending, OrderStatus.confirmed].includes(order.status as OrderStatus)) {
                if (session.inTransaction()) await session.abortTransaction();
                res.status(400).json({ message: "Cannot cancel order at this stage" });
                return;
            }
        } else if (user.role === UserRole.RESTAURANT) {
            const restaurant = await Restaurant.findById(order.restaurant).session(session);
            if (!restaurant || restaurant.owner?.toString() !== user.userId) {
                if (session.inTransaction()) await session.abortTransaction();
                res.status(403).json({ message: "Forbidden: You do not own the restaurant for this order" });
                return;
            }
            const allowedStatuses = [OrderStatus.confirmed, OrderStatus.preparing, OrderStatus.ready, OrderStatus.cancelled];
            if (!allowedStatuses.includes(status as OrderStatus)) {
                if (session.inTransaction()) await session.abortTransaction();
                res.status(400).json({ message: `Invalid status update for restaurant: ${status}` });
                return;
            }
        } else if (user.role === UserRole.DELIVERY) {
            const allowedStatuses = [OrderStatus.picked_up, OrderStatus.delivered];
            if (!allowedStatuses.includes(status as OrderStatus)) {
                if (session.inTransaction()) await session.abortTransaction();
                res.status(400).json({ message: `Invalid status update for delivery: ${status}` });
                return;
            }
        } else if (user.role !== UserRole.ADMIN) {
            if (session.inTransaction()) await session.abortTransaction();
            res.status(403).json({ message: "Forbidden" });
            return;
        }

        order.status = status;
        await order.save({ session });

        await session.commitTransaction();

        if (global.io) {
            global.io.to(`order-${order._id.toString()}`).emit("order-status-updated", {
                orderId: order._id,
                status: order.status,
                message: 'Order status updated'
            });
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (e) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw e;
    } finally {
        await session.endSession();
    }
};