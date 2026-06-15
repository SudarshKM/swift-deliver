import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types/types";
import { createOrder } from "../controllers/orderController";
import { validateData } from "../middleware/validate";
import { orderSchema } from "../utils/validation";


const orderRoutes = Router();

orderRoutes.post("/create-order", authenticate, authorize([UserRole.CUSTOMER]), validateData(orderSchema), createOrder);

export default orderRoutes;