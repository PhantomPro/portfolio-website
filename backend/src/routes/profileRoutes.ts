import { Router } from 'express';
import { getProfile, createOrUpdateProfile } from '../controllers/profileController';

const router = Router();

router.get('/', getProfile);
router.put('/', createOrUpdateProfile);

export default router;
