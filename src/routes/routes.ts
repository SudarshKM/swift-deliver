import { Router } from "express";
import authRoutes from "./authRoutes";


const routes = Router();

routes.use('/auth', authRoutes);

routes.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route accessed', user: (req as any).user });
});

export default routes;