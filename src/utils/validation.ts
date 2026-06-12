import { z } from 'zod';
import { UserRole, OrderStatus } from '../types/types';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER)
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters long"),
  description: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  cuisine: z.array(z.string()).min(1, "At least one cuisine type is required")
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters long"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  restaurant: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid restaurant ID"),
  category: z.string().min(2, "Category is required"),
  isAvailable: z.boolean().default(true)
});

export const orderItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  price: z.number().positive("Price must be greater than 0")
});

export const orderSchema = z.object({
  restaurant: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid restaurant ID"),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  totalAmount: z.number().positive("Total amount must be greater than 0"),
  status: z.enum(OrderStatus).default(OrderStatus.pending),
  deliveryAddress: z.string().min(5, "Delivery address must be at least 5 characters long")
});
