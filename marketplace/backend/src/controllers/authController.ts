import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

// Helper function to create a token and save it in a cookie
const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // Prevents hackers from reading the cookie via JavaScript
    secure: process.env.NODE_ENV !== 'development', // Uses HTTPS in production
    sameSite:  'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // This calls the pre('save') hook we fixed above
    const user = await User.create({ username, email, password, role });

    if (user) {
      generateToken(res, user._id.toString());
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: any = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id.toString());
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Logout user / Clear Cookie
// @route   POST /api/auth/logout
export const logoutUser = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// Add this at the bottom of your authController.ts
export const toggleBookmark = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    
    // Safety check: Is the product ID actually there?
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Initialize the bookmarks array if it doesn't exist (Fixes the 500 error)
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    // 2. Check if already bookmarked (converting IDs to strings for comparison)
    const isBookmarked = user.bookmarks.some(id => id.toString() === productId);

    if (isBookmarked) {
      // REMOVE: keep only IDs that DON'T match the clicked one
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== productId);
    } else {
      // ADD
      user.bookmarks.push(productId);
    }

    await user.save();
    
    // Return the updated bookmarks so the frontend knows it worked
    res.json({ bookmarks: user.bookmarks });
  } catch (error: any) {
    console.error("❌ Bookmark logic crashed:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users (Admin only)
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// @desc    Delete a user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') return res.status(400).json({ message: "Cannot delete an admin" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};