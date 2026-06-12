import { Router } from "express";
import authRoutes from "./authRoutes";
import { authenticate } from "../middleware/auth";
import restaurantRoutes from "./restaurantRoutes";
import orderRoutes from "./orderRoutes";
import productRoutes from "./productRoutes";


const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/restaurants', restaurantRoutes);
routes.use('/orders', orderRoutes);
routes.use('/products', productRoutes);

routes.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route accessed', user: (req as any).user });
});

export default routes;