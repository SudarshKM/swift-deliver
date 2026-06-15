import { Request, Response } from 'express';
import Product from '../models/Product';


import mongoose from 'mongoose';

export const addProduct = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, description, price, restaurant, category, isAvailable } = req.body;
        const product = await Product.create([{
            name,
            description,
            price,
            restaurant,
            category,
            isAvailable
        }], { session });

        res.status(201).json({ message: "Product added", product: product[0] });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};
