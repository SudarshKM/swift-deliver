import { Router } from "express";
import { createRestaurant, getRestaurantMenu, getRestaurants } from "../controllers/restaurantController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types/types";


const restaurantRoutes = Router();

restaurantRoutes.post("/", authenticate, authorize([UserRole.RESTAURANT]), createRestaurant);
restaurantRoutes.get("/", getRestaurants);
restaurantRoutes.get("/:id/menu", getRestaurantMenu);

export default restaurantRoutes;