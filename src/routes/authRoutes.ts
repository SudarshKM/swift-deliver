import { Router } from "express";
import { login, logout, register, rereshToken } from "../controllers/authController";
import { authenticate, authorize } from "../middleware/auth";

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', authenticate, authorize, login);
authRoutes.post('/refresh', rereshToken);
authRoutes.post('/logout', logout);

export default authRoutes;