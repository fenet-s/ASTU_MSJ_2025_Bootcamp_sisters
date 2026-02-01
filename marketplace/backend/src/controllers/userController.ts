import { Request, Response } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';

// @desc    Get all users (Admin only)
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// @desc    Delete user and their products (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete all products owned by this user
    await Product.deleteMany({ owner: user._id });
    await user.deleteOne();

    res.json({ message: 'User and their listings removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};