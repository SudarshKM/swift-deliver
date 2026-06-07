import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (userId: string, role: string) => 
  jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

export const generateRefreshToken = (userId: string) => 
  jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });