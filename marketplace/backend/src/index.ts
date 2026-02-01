import express, { Response, Request, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import { User } from './models/User.js';

// Controllers
import { registerUser, loginUser, logoutUser, toggleBookmark } from './controllers/authController.js';
import { getUsers, deleteUser } from './controllers/userController.js';

// Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

// --- 1. PROXY & CORS SETTINGS ---
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'https://astu-msj-2025-bootcamp-sisters.vercel.app' // Double check this matches your Vercel URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS. Origin was:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// --- 2. ESSENTIAL MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser());

// Debug Logger (See every request in Render logs)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// --- 3. ROUTES ---

// Auth
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/auth/logout', logoutUser);
app.get('/api/auth/profile', protect, async (req: any, res: Response) => {
  const user = await User.findById(req.user._id).populate('bookmarks');
  res.json(user);
});
app.post('/api/auth/bookmark', protect, toggleBookmark);

// Domain Entities
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Root test route
app.get('/', (req, res) => res.send('API is running...'));

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));