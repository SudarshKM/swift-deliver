import User from "../models/User"
import { Request, Response } from "express";


export const getUserStatus = async (req: Request, res: Response) => {
    const status = await User.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({status, message: "User status fetched successfully"});
}
    
