import { Router } from "express";
import { login, logout, register, rereshToken } from "../controllers/authController";
import { authenticate, authorize } from "../middleware/auth";
import { getUserStatus } from "../controllers/getUserStatusController";
import { validateData } from "../middleware/validate";
import { registerSchema, loginSchema } from "../utils/validation";

const authRoutes = Router();

authRoutes.post('/register', validateData(registerSchema), register);
authRoutes.post('/login', validateData(loginSchema), login);
authRoutes.post('/refresh', rereshToken);
authRoutes.post('/logout', logout);
authRoutes.get('/user-status', getUserStatus);

export default authRoutes;