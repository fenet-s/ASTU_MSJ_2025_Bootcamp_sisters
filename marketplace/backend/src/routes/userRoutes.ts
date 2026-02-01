import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController.js'; // ADDED .js
import { protect, admin } from '../middleware/authMiddleware.js';       // ADDED .js

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;