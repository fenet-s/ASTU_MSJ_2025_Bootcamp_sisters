import { Request, Response } from 'express';
import { Event } from '../models/Event.js';

export const createEvent = async (req: any, res: Response) => {
  try {
    const { title, description, location, date, imageUrl } = req.body;
    const event = await Event.create({
      title, description, location, date, imageUrl,
      organizer: req.user._id
    });
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({}).populate('organizer', 'username').sort({ date: 1 });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req: any, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    // Ownership or Admin check
    if (event.organizer.toString() === req.user._id.toString() || req.user.role === 'admin') {
      await event.deleteOne();
      res.json({ message: "Event removed" });
    } else {
      res.status(403).json({ message: "Not authorized" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};