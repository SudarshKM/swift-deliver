import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) {
        return res.status(401).json({message: "No Token"});
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        (req as any).user = decodedToken;
        next();
    } catch(err) {
        return res.status(401).json({message: "Token Invalid"});
    }
    
}

export const authorize = (roles:string[]) => {
    return (req:Request, res:Response, next:NextFunction) => {
        const user = (req as any).user;
        if(!roles.includes(user.role)) {
            return res.status(403).json({message: "Forbidden"});
        }
        next();
    }
}