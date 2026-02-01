import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import { registerUser, loginUser, logoutUser, deleteUser, getUsers } from './controllers/authController';
import { protect } from './middleware/authMiddleware'; // Add this import
import { Request, Response, NextFunction } from 'express';
import productRoutes from './routes/productRoutes';
import cors from 'cors';
import { admin} from './middleware/authMiddleware';
// ...


dotenv.config();
connectDB();

const app = express();
app.set('trust proxy', 1); 
app.get('/api/auth/users', protect, admin, getUsers);
app.delete('/api/auth/users/:id', protect, admin, deleteUser);



// Middleware to read JSON and Cookies
app.use(express.json());
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