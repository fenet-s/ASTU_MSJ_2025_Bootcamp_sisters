import express from 'express';
import { createEvent, getEvents, deleteEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getEvents).post(protect, createEvent);
router.delete('/:id', protect, deleteEvent);

export default router;