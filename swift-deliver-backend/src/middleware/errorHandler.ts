import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err, url: req.originalUrl, method: req.method }, "Unhandled error");
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};  