import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      // 1. Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      
      // 2. Get user from DB (excluding password) and attach to request
      req.user = await User.findById(decoded.userId).select('-password');
      
      next(); // Move to the next function
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check for Admin role
export const admin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};