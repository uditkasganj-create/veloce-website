import { Router, Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';

const router = Router();

const PRODUCTS = [
  {
    id: 'v1',
    name: 'VELOCE STRIDE X',
    slug: 'veloce-stride-x',
    price: 5499,
    originalPrice: 6599,
    category: 'PERFORMANCE',
    description: 'Engineered aerated mesh keeps your foot cool and blister-free. Designed for high-impact shock absorption.',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800'],
    hoverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800',
    specs: { weight: '240g', drop: '8mm', terrain: 'Road', foam: 'V-Cloud Pro' },
    emi: '₹1,750/mo for 3 months',
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    id: 'v2',
    name: 'URBAN NOMAD',
    slug: 'urban-nomad',
    price: 3999,
    originalPrice: 4999,
    category: 'LIFESTYLE',
    description: 'The ultimate city companion. Lightweight and stylish for the modern urban explorer.',
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800'],
    hoverImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800',
    specs: { weight: '210g', drop: '4mm', terrain: 'Urban', foam: 'Soft-Step' },
    emi: '₹1,333/mo for 3 months',
    rating: 4.5,
    reviewCount: 89,
    stock: 75,
    isFeatured: false,
    isNewArrival: true,
  },
  {
    id: 'v3',
    name: 'AERO FLOW 2.0',
    slug: 'aero-flow-2',
    price: 6499,
    originalPrice: 7999,
    category: 'PRO',
    description: 'Lighter than air, faster than sound. Carbon-fiber plate for maximum energy return.',
    images: ['https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=800'],
    hoverImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800',
    specs: { weight: '190g', drop: '10mm', terrain: 'Track', foam: 'Nitro-Fuel' },
    emi: '₹2,166/mo for 3 months',
    rating: 4.9,
    reviewCount: 56,
    stock: 25,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    id: 'v4',
    name: 'ONYX ELITE',
    slug: 'onyx-elite',
    price: 8999,
    originalPrice: 10999,
    category: 'LIMITED',
    description: 'Exclusivity in every step. Premium materials and limited production run.',
    images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800'],
    hoverImage: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=800',
    specs: { weight: '260g', drop: '6mm', terrain: 'All', foam: 'Elite-Core' },
    emi: '₹2,999/mo for 3 months',
    rating: 5.0,
    reviewCount: 12,
    stock: 10,
    isFeatured: false,
    isNewArrival: false,
  },
];

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.get('/', (req: Request, res: Response) => {
  const { 
    category, 
    minPrice, 
    maxPrice, 
    search, 
    sort = 'createdAt',
    order = 'desc',
    page = '1',
    limit = '12',
    featured,
    newArrival,
  } = req.query;

  let filteredProducts = [...PRODUCTS];

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
  }

  if (search) {
    const searchLower = (search as string).toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  if (featured === 'true') {
    filteredProducts = filteredProducts.filter(p => p.isFeatured);
  }

  if (newArrival === 'true') {
    filteredProducts = filteredProducts.filter(p => p.isNewArrival);
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  filteredProducts.sort((a, b) => {
    switch (sort) {
      case 'price':
        return (a.price - b.price) * sortOrder;
      case 'rating':
        return (a.rating - b.rating) * sortOrder;
      case 'name':
        return a.name.localeCompare(b.name) * sortOrder;
      default:
        return 0;
    }
  });

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(filteredProducts.length / limitNum),
      },
    },
  });
});

router.get('/featured', (req: Request, res: Response) => {
  const featured = PRODUCTS.filter(p => p.isFeatured);
  res.json({ success: true, data: featured });
});

router.get('/new-arrivals', (req: Request, res: Response) => {
  const newArrivals = PRODUCTS.filter(p => p.isNewArrival);
  res.json({ success: true, data: newArrivals });
});

router.get('/categories', (req: Request, res: Response) => {
  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  res.json({ success: true, data: categories });
});

router.get('/:slug', (req: Request, res: Response) => {
  const product = PRODUCTS.find(p => p.slug === req.params.slug);
  
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const relatedProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.json({ 
    success: true, 
    data: { 
      product,
      relatedProducts,
    } 
  });
});

export default router;
