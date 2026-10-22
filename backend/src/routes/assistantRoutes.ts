import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { askAssistant } from '../controllers/assistantController';

const router = Router();

// Dedicated rate limiter for AI Assistant to protect Gemini free-tier quota
const assistantLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 queries per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI Assistant rate limit reached for this IP. Please wait a few minutes before asking more questions.',
  },
});

router.post('/', assistantLimiter, askAssistant);

export default router;
