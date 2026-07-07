import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types/types";
import { createOrder, updateOrderStatus } from "../controllers/orderController";
import { validateData } from "../middleware/validate";
import { orderSchema, updateOrderStatusSchema } from "../utils/validation";


const orderRoutes = Router();

orderRoutes.post("/create-order", authenticate, authorize([UserRole.CUSTOMER]), validateData(orderSchema), createOrder);
orderRoutes.patch("/:id/status", authenticate, validateData(updateOrderStatusSchema), updateOrderStatus);

export default orderRoutes;