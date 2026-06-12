import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/types';
import { addProduct } from '../controllers/productController';


const productRoutes = Router();

productRoutes.post("/add-product", authenticate, authorize([UserRole.RESTAURANT]), addProduct);


export default productRoutes;