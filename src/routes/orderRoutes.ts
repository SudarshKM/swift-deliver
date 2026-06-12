import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types/types";
import { createOrder } from "../controllers/orderController";


const orderRoutes = Router();

orderRoutes.post("/create-order", authenticate, authorize([UserRole.CUSTOMER]), createOrder);

export default orderRoutes;