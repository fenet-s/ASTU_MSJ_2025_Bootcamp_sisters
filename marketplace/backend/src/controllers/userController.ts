import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Event } from '../models/Event.js';

// @desc    Get all users (Admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user and their products (Admin only)
export const deleteUser = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Delete all their products first
    await Product.deleteMany({ owner: user._id });
    
    // 2. Delete the user
    await user.deleteOne();

    res.json({ message: "User and all their listings have been removed." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const eventCount = await Event.countDocuments();

    res.json({
      users: userCount,
      products: productCount,
      events: eventCount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};