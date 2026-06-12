import { Router } from "express";
import { createRestaurant, getRestaurantMenu, getRestaurants } from "../controllers/restaurantController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types/types";
import { validateData } from "../middleware/validate";
import { restaurantSchema } from "../utils/validation";


const restaurantRoutes = Router();

restaurantRoutes.post("/", authenticate, authorize([UserRole.RESTAURANT]), validateData(restaurantSchema), createRestaurant);
restaurantRoutes.get("/", getRestaurants);
restaurantRoutes.get("/:id/menu", getRestaurantMenu);

export default restaurantRoutes;