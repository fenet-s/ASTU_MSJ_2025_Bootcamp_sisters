import express, { Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';

// Controllers
import { registerUser, loginUser, logoutUser, toggleBookmark } from './controllers/authController.js';
import { getUsers, deleteUser } from './controllers/userController.js';

// Routes & Middleware
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js'; // Ensure this is correct
import { protect } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

// --- 1. MIDDLEWARE (MUST BE AT THE TOP) ---
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'https://astu-msj-2025-bootcamp-sisters.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// --- 2. AUTH & USER ROUTES ---
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/auth/logout', logoutUser);
app.get('/api/auth/profile', protect, async (req: any, res: Response) => {
  const user = await User.findById(req.user._id).populate('bookmarks');
  res.json(user);
});
app.post('/api/auth/bookmark', protect, toggleBookmark);

// --- 3. ENTITY ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes); // This is the route that's failing

// --- 4. ERROR HANDLING (Prevents CORS errors on crashes) ---
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));