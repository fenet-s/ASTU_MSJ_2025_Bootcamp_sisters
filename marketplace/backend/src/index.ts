import express, { Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js'; 
import { User } from './models/User.js';

// Controllers
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  toggleBookmark 
} from './controllers/authController.js'; 

// Routes & Middleware
import productRoutes from './routes/productRoutes.js'; 
import userRoutes from './routes/userRoutes.js';       
import { protect } from './middleware/authMiddleware.js'; 

dotenv.config();
connectDB();

const app = express();
app.set('trust proxy', 1); 

const allowedOrigins = [
  'http://localhost:3000',
  'https://astu-msj-2025-bootcamp-sisters.vercel.app', 
  process.env.FRONTEND_URL as string
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/auth/logout', logoutUser);
// backend/src/index.ts
app.get('/api/auth/profile', protect, async (req: any, res: Response) => {
  // We find the user and "populate" the bookmarks so we see titles/prices
  const user = await User.findById(req.user._id).populate('bookmarks');
  res.json(user);
});
app.post('/api/auth/bookmark', protect, toggleBookmark);

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));