import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, role: string) => 
  jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });

export const generateRefreshToken = (userId: string) => 
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });