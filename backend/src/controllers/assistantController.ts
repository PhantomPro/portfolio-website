import { Request, Response } from 'express';
import { geminiAssistantService, ChatMessage } from '../services/geminiService';

export const askAssistant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;

    // Input Validation
    if (!message || typeof message !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Invalid request: "message" field is required and must be a string.',
      });
      return;
    }

    const trimmed = message.trim();
    if (trimmed.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Message cannot be empty.',
      });
      return;
    }

    if (trimmed.length > 1000) {
      res.status(400).json({
        success: false,
        error: 'Message exceeds maximum allowed length of 1,000 characters.',
      });
      return;
    }

    // Sanitize conversation history
    const sanitizedHistory: ChatMessage[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (
          item &&
          (item.role === 'user' || item.role === 'assistant') &&
          typeof item.content === 'string'
        ) {
          sanitizedHistory.push({
            role: item.role,
            content: item.content.slice(0, 1000),
          });
        }
      }
    }

    // 25-second request timeout safeguard
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 25000)
    );

    const assistantResult = await Promise.race([
      geminiAssistantService.generateReply(trimmed, sanitizedHistory),
      timeoutPromise,
    ]);

    res.status(200).json({
      success: true,
      data: assistantResult,
    });
  } catch (error: any) {
    console.error('[AssistantController] Error handling assistant request:', error?.message || error);

    const isTimeout = error?.message === 'Request timed out';
    res.status(isTimeout ? 504 : 500).json({
      success: false,
      error: isTimeout
        ? 'Request timed out while generating response. Please try again with a shorter message.'
        : 'Failed to process assistant request. Please try again in a moment.',
    });
  }
};
