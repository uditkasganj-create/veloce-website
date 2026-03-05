import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const coupons: Map<string, any> = new Map([
  ['WELCOME10', { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrderValue: 1000, validFrom: new Date('2024-01-01'), validUntil: new Date('2025-12-31'), isActive: true, maxUses: 1000, usedCount: 0 }],
  ['VELOCE20', { code: 'VELOCE20', type: 'PERCENTAGE', value: 20, minOrderValue: 3000, validFrom: new Date('2024-01-01'), validUntil: new Date('2025-12-31'), isActive: true, maxUses: 500, usedCount: 0 }],
  ['FLAT500', { code: 'FLAT500', type: 'FIXED', value: 500, minOrderValue: 2500, validFrom: new Date('2024-01-01'), validUntil: new Date('2025-12-31'), isActive: true, maxUses: 200, usedCount: 0 }],
]);

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }
  next();
};

router.get('/', (req: Request, res: Response) => {
  const activeCoupons = Array.from(coupons.values()).filter(c => c.isActive);
  res.json({ success: true, data: activeCoupons });
});

router.get('/validate/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const { subtotal } = req.query;

  const coupon = coupons.get(code.toUpperCase());

  if (!coupon) {
    throw new AppError('Invalid coupon code', 404);
  }

  if (!coupon.isActive) {
    throw new AppError('This coupon is no longer active', 400);
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    throw new AppError('This coupon has expired', 400);
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new AppError('This coupon has reached its usage limit', 400);
  }

  if (coupon.minOrderValue && Number(subtotal) < coupon.minOrderValue) {
    throw new AppError(`Minimum order value of ₹${coupon.minOrderValue} required`, 400);
  }

  let discount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discount = Math.round(Number(subtotal) * (coupon.value / 100));
  } else {
    discount = coupon.value;
  }

  res.json({
    success: true,
    data: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      message: `You save ₹${discount}!`,
    },
  });
});

router.post(
  '/',
  [
    body('code').trim().notEmpty().toUpperCase(),
    body('type').isIn(['PERCENTAGE', 'FIXED']),
    body('value').isInt({ min: 1 }),
    body('validUntil').isISO8601(),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { code, type, value, minOrderValue, maxUses } = req.body;
    const validFrom = new Date();
    const validUntil = new Date(req.body.validUntil);

    if (coupons.has(code)) {
      throw new AppError('Coupon code already exists', 400);
    }

    const coupon = {
      code,
      type,
      value,
      minOrderValue: minOrderValue || null,
      maxUses: maxUses || null,
      validFrom,
      validUntil,
      isActive: true,
      usedCount: 0,
      createdAt: new Date(),
    };

    coupons.set(code, coupon);

    res.status(201).json({ success: true, data: coupon });
  }
);

export default router;
