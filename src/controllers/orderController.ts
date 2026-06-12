import { Request, Response } from "express";
import Order from "../models/Order";


export const createOrder = async (req: Request, res: Response) => {
    const { restaurant, items, totalAmount, status, deliveryAddress } = req.body;
    const order = await Order.create({
        customer: (req as any).user.userId,
        items,
        status,
        totalAmount,
        deliveryAddress,
        restaurant,
        createdAt: Date.now()
    })
    res.status(201).json({ message: "Order created", order })

}