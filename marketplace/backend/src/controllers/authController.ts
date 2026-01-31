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
    sameSite: 'none',
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