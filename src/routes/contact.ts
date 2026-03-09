import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const contacts: any[] = [];

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }
  next();
};

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('type').optional().isString(),
    body('phone').optional().isMobilePhone('any'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { name, email, phone, message, type = 'general' } = req.body;

    const contact = {
      id: 'cnt_' + Date.now(),
      name,
      email,
      phone,
      message,
      type,
      status: 'NEW',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    contacts.push(contact);

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you soon!',
      data: { id: contact.id },
    });
  }
);

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: contacts });
});

export default router;
