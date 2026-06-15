import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/types';
import { addProduct } from '../controllers/productController';
import { validateData } from "../middleware/validate";
import { productSchema } from "../utils/validation";


const productRoutes = Router();

productRoutes.post("/add-product", authenticate, authorize([UserRole.RESTAURANT]), validateData(productSchema), addProduct);


export default productRoutes;