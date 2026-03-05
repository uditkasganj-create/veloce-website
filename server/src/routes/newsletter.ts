import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const subscribers: Map<string, { email: string; status: string; createdAt: Date }> = new Map();

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }
  next();
};

router.post(
  '/subscribe',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { email } = req.body;

    if (subscribers.has(email)) {
      const existing = subscribers.get(email)!;
      if (existing.status === 'SUBSCRIBED') {
        return res.status(400).json({
          success: false,
          error: 'This email is already subscribed',
        });
      }
      existing.status = 'SUBSCRIBED';
      existing.createdAt = new Date();
    } else {
      subscribers.set(email, {
        email,
        status: 'SUBSCRIBED',
        createdAt: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    });
  }
);

router.post(
  '/unsubscribe',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { email } = req.body;

    if (!subscribers.has(email)) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in subscribers',
      });
    }

    const subscriber = subscribers.get(email)!;
    subscriber.status = 'UNSUBSCRIBED';

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  }
);

router.get('/stats', (req: Request, res: Response) => {
  const all = Array.from(subscribers.values());
  const total = all.length;
  const active = all.filter(s => s.status === 'SUBSCRIBED').length;

  res.json({
    success: true,
    data: {
      total,
      active,
      inactive: total - active,
    },
  });
});

export default router;
