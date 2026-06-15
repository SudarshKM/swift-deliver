import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import Product from '../models/Product';
import mongoose from 'mongoose';

export const createRestaurant = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const restaurant = await Restaurant.create([{ ...req.body, owner: (req as any).user.userId }], { session });
    res.status(201).json({message: "Restaurant created", restaurant: restaurant[0]});
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getRestaurants = async (req: Request, res: Response) => {
  const restaurants = await Restaurant.find({ isActive: true }).select('-__v'); //exclude document version
  res.json(restaurants);
};

export const getRestaurantMenu = async (req: Request, res: Response) => {
  const { id } = req.params;
  const products = await Product.find({ restaurant: id, isAvailable: true });
  res.json(products);
};