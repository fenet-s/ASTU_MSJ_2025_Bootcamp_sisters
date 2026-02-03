import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController.js'; // ADDED .js
import { protect, admin } from '../middleware/authMiddleware.js';       // ADDED .js
import { getAdminStats } from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.get('/stats', protect, admin, getAdminStats);


export default router;