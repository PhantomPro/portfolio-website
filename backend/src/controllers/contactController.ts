import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { config } from '../config/env';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = new ContactMessage({ name, email, subject, message });
    await contactMessage.save();

    // Optional: Send email notification (configure in .env)
    if (config.emailUser && config.emailPass) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: config.emailUser, pass: config.emailPass },
        });

        await transporter.sendMail({
          from: config.emailUser,
          to: config.adminEmail || config.emailUser,
          subject: `Portfolio Contact: ${subject || 'New Message'} from ${name}`,
          html: `
            <h3>New contact from portfolio</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
      } catch (emailError) {
        console.warn('Email sending failed (non-critical):', emailError);
      }
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message', error });
  }
};

export const getMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error });
  }
};

export const markMessageRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params['id'],
      { read: true },
      { new: true }
    );
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update message', error });
  }
};
