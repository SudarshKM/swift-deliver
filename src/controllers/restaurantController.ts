import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import Product from '../models/Product';

export const createRestaurant = async (req: Request, res: Response) => {
  const restaurant = await Restaurant.create({ ...req.body, owner: (req as any).user.userId });
  res.status(201).json(restaurant);
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