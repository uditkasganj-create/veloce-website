import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

const cartStore: Map<string, Array<{ productId: string; quantity: number; size: string }>> = new Map();

router.get('/', authenticate, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const cart = cartStore.get(userId) || [];
  res.json({ success: true, data: cart });
});

router.post('/', authenticate, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId, quantity = 1, size } = req.body;

  if (!productId || !size) {
    return res.status(400).json({ success: false, error: 'Product ID and size are required' });
  }

  const cart = cartStore.get(userId) || [];
  const existingIndex = cart.findIndex(item => item.productId === productId && item.size === size);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity, size });
  }

  cartStore.set(userId, cart);

  res.status(201).json({ success: true, data: cart });
});

router.put('/:productId', authenticate, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.params;
  const { quantity, size } = req.body;

  const cart = cartStore.get(userId) || [];
  const index = cart.findIndex(item => item.productId === productId && item.size === size);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Item not found in cart' });
  }

  if (quantity > 0) {
    cart[index].quantity = quantity;
  } else {
    cart.splice(index, 1);
  }

  cartStore.set(userId, cart);

  res.json({ success: true, data: cart });
});

router.delete('/:productId', authenticate, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.params;
  const { size } = req.query;

  let cart = cartStore.get(userId) || [];
  cart = cart.filter(item => !(item.productId === productId && item.size === size));

  cartStore.set(userId, cart);

  res.json({ success: true, data: cart });
});

router.delete('/', authenticate, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  cartStore.delete(userId);
  res.json({ success: true, data: [] });
});

export default router;
