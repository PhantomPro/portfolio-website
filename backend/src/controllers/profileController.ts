import { Request, Response } from 'express';
import { Profile } from '../models/Profile';

export const getProfile = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error });
  }
};

export const createOrUpdateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update profile', error });
  }
};
