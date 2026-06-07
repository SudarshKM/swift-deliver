import { Router } from "express";
import { login, register } from "../controllers/authController";
import { authenticate, authorize } from "../middleware/auth";

const userRoutes = Router();

userRoutes.post('/register', register);
userRoutes.post('/login', authenticate, authorize, login);

export default userRoutes;