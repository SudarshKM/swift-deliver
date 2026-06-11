import { Router } from "express";
import { login, logout, register, rereshToken } from "../controllers/authController";
import { authenticate, authorize } from "../middleware/auth";
import { getUserStatus } from "../controllers/getUserStatusController";

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/refresh', rereshToken);
authRoutes.post('/logout', logout);
authRoutes.get('/user-status', getUserStatus);

export default authRoutes;