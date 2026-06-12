import { Request, Response } from 'express';
import Product from '../models/Product';


export const addProduct = async (req: Request, res: Response) => {
    const { name, description, price, restaurant, category, isAvailable } = req.body;
    const product = await Product.create({
        name,
        description,
        price,
        restaurant,
        category,
        isAvailable
    })
    res.status(201).json({ message: "Product added", product });
}
    
