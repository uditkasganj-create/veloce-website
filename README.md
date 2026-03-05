# Veloce Performance Footwear

Welcome to the **Veloce** sneaker website repository. Veloce represents the pinnacle of performance and style in modern footwear.

## Live Website

🚀 **[View the Live Website Here](https://veloce-websiteveloce-website.onrender.com/)**

## Features

### Frontend
- 🏃 **Product Catalog** - Browse shoes with filtering, sorting, and search
- 🔍 **AI Gait Analyzer** - Upload running video for personalized recommendations
- 🛒 **Shopping Cart** - Persistent cart with size selection
- 📱 **PWA Support** - Install as a native app
- 🌙 **Dark Mode** - Automatic theme switching
- ✨ **Animations** - Smooth transitions with Motion
- 📊 **Analytics Dashboard** - Real-time visitor tracking
- ♿ **Accessibility** - WCAG compliant

### Backend
- 🔐 **JWT Authentication** - Secure login/register
- 🛡️ **Security** - Rate limiting, helmet, input validation
- 💳 **Payment Ready** - Razorpay integration
- 📧 **Email Ready** - Resend integration
- 📈 **Analytics** - Track page views, clicks, users
- 🐳 **Docker** - Production-ready containers

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Animation | Motion (Framer Motion) |
| Charts | Recharts |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL (Prisma ORM) |
| Auth | JWT |
| Security | Helmet, express-rate-limit, express-validator |
| Deployment | Docker, GitHub Actions |

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/veloce.git
cd veloce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp server/.env.example server/.env
# Edit .env with your database and API credentials
```

4. Set up the database:
```bash
cd server
npm run db:generate
npm run db:push
```

5. Start development:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3000/api

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker-compose up -d
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:slug` - Get product details
- `GET /api/products/featured` - Featured products
- `GET /api/products/new-arrivals` - New arrivals

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:productId` - Update quantity
- `DELETE /api/cart/:productId` - Remove from cart

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `POST /api/orders/:id/pay` - Process payment
- `POST /api/orders/:id/cancel` - Cancel order

### Other
- `POST /api/contact` - Contact form
- `POST /api/newsletter/subscribe` - Newsletter signup
- `GET /api/analytics/stats` - Analytics data

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `RAZORPAY_KEY_ID` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `NODE_ENV` | Environment (development/production) |

## Project Structure

```
veloce/
├── server/                 # Backend
│   ├── prisma/            # Database schema
│   └── src/
│       ├── routes/        # API routes
│       └── middleware/    # Express middleware
├── src/                   # Frontend
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── context/           # React context
│   └── lib/              # Utilities
├── dist/                  # Production build
├── docker-compose.yml     # Docker configuration
└── package.json
```

## Deployment

This application is officially deployed on Render.com using the included `render.yaml` specification.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ by Team Veloce
