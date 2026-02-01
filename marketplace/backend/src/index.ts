import express, { Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';

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

// 1. SETTINGS & MIDDLEWARE (Must come first!)
app.set('trust proxy', 1); 

const allowedOrigins = [
  'http://localhost:3000',
  'https://astu-msj-2025-bootcamp-sisters.vercel.app', 
  process.env.FRONTEND_URL as string
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS blocked'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json()); // Essential to read req.body
app.use(cookieParser()); // Essential to read cookies

// 2. AUTHENTICATION ROUTES
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/auth/logout', logoutUser);

// Profile Route
app.get('/api/auth/profile', protect, (req: any, res: Response) => {
  res.json(req.user);
});

// Bookmark Route
app.post('/api/auth/bookmark', protect, toggleBookmark);

// 3. ENTITY ROUTES
app.use('/api/products', productRoutes); // Handles all /api/products...
app.use('/api/users', userRoutes);       // Handles Admin User management

// 4. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));