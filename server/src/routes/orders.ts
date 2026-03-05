import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest, generateToken } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const orders: any[] = [];

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }
  next();
};

router.get('/', authenticate, (req: AuthRequest, res: Response) => {
  const userOrders = orders.filter(o => o.userId === req.user!.id);
  res.json({ success: true, data: userOrders });
});

router.get('/:orderNumber', authenticate, (req: AuthRequest, res: Response) => {
  const order = orders.find(
    o => o.orderNumber === req.params.orderNumber && o.userId === req.user!.id
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({ success: true, data: order });
});

router.post(
  '/',
  authenticate,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('shippingAddress').isObject().withMessage('Shipping address is required'),
    body('paymentMethod').optional().isString(),
  ],
  validateRequest,
  (req: AuthRequest, res: Response) => {
    const { items, shippingAddress, billingAddress, paymentMethod, notes, couponCode } = req.body;
    const userId = req.user!.id;

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 2000 ? 0 : 199;
    const discount = 0;
    const total = subtotal + tax + shipping - discount;

    const orderNumber = 'VEL' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    const order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      userId,
      status: 'PENDING',
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      paymentMethod: paymentMethod || 'RAZORPAY',
      paymentStatus: 'PENDING',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(order);

    res.status(201).json({
      success: true,
      data: order,
    });
  }
);

router.post('/:orderId/pay', authenticate, (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { paymentId, razorpayOrderId } = req.body;

  const order = orders.find(o => o.id === orderId && o.userId === req.user!.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.paymentId = paymentId || razorpayOrderId;
  order.paymentStatus = 'COMPLETED';
  order.status = 'CONFIRMED';

  res.json({ success: true, data: order });
});

router.post('/:orderId/cancel', authenticate, (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;

  const order = orders.find(o => o.id === orderId && o.userId === req.user!.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw new AppError('Cannot cancel order in current status', 400);
  }

  order.status = 'CANCELLED';
  order.updatedAt = new Date();

  res.json({ success: true, data: order });
});

export default router;
