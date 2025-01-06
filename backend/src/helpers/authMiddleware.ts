import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    if (token !== 'your-secret-token') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    next(); 
};

export default authMiddleware;
export function comparePassword(password: string, data: any, propertyPassword: string): boolean {
    let savedPassword = data[propertyPassword];
    return bcrypt.compareSync(password, savedPassword);
}