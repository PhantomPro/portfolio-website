import { Router } from 'express';
import { submitContact, getMessages, markMessageRead } from '../controllers/contactController';

const router = Router();

router.post('/', submitContact);
router.get('/messages', getMessages);
router.patch('/messages/:id/read', markMessageRead);

export default router;
