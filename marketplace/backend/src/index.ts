import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import { registerUser, loginUser, logoutUser } from './controllers/authController';
import { protect } from './middleware/authMiddleware'; // Add this import
import { Request, Response, NextFunction } from 'express';
import productRoutes from './routes/productRoutes';



dotenv.config();
connectDB();

const app = express();

// Middleware to read JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// Auth Routes
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/auth/logout', logoutUser);
app.get('/api/auth/profile', protect, (req: any, res: Response) => {
  res.json(req.user);
});
app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));