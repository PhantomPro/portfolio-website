import { Request, Response } from 'express';
import { Achievement } from '../models/Achievement';

export const getAchievements = async (_req: Request, res: Response): Promise<void> => {
  try {
    const achievements = await Achievement.find().sort({ order: 1 });
    res.json({ success: true, data: achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch achievements', error });
  }
};

export const createAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create achievement', error });
  }
};

export const updateAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params['id'], req.body, {
      new: true,
      runValidators: true,
    });
    if (!achievement) {
      res.status(404).json({ success: false, message: 'Achievement not found' });
      return;
    }
    res.json({ success: true, data: achievement });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update achievement', error });
  }
};

export const deleteAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params['id']);
    if (!achievement) {
      res.status(404).json({ success: false, message: 'Achievement not found' });
      return;
    }
    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete achievement', error });
  }
};
