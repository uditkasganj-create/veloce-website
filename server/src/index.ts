import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';
import analyticsRoutes from './routes/analytics.js';
import couponRoutes from './routes/coupons.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(requestLogger);

let activeVisitors = 0;
let totalEngagement = 0;
let pageViews = 0;

wss.on('connection', (ws, req) => {
  activeVisitors++;
  console.log('WebSocket client connected');
  broadcastStats();

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'engagement') {
        totalEngagement++;
        broadcastStats();
      }
      if (message.type === 'page_view') {
        pageViews++;
        broadcastStats();
      }
    } catch (e) {
      console.error('Failed to parse WS message', e);
    }
  });

  ws.on('close', () => {
    activeVisitors--;
    console.log('WebSocket client disconnected');
    broadcastStats();
  });

  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to Veloce WebSocket server'
  }));
});

function broadcastStats() {
  const stats = JSON.stringify({
    type: 'stats_update',
    activeVisitors,
    totalEngagement,
    pageViews,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(stats);
    }
  });
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

app.get('/api/kpis', (req, res) => {
  res.json({
    activeVisitors,
    totalEngagement,
    pageViews,
    status: 'Live Tracking Active',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/coupons', couponRoutes);

app.use(errorHandler);

if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Veloce API Server</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; backgroud: #111; color: #fff; }
            h1 { color: #d4af37; }
            a { color: #d4af37; }
          </style>
        </head>
        <body style="background: #111; color: #fff;">
          <h1>🏃 Veloce API Server Running</h1>
          <p>The backend is running successfully!</p>
          <p>The frontend development server is running on <a href="http://localhost:5173">http://localhost:5173</a></p>
          <p>Available endpoints:</p>
          <ul>
            <li><a href="/api/health">/api/health</a> - Health Check</li>
            <li><a href="/api/kpis">/api/kpis</a> - Live KPIs</li>
          </ul>
        </body>
      </html>
    `);
  });
}

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏃 VELOCE Server Running                                ║
║                                                           ║
║   Environment: ${NODE_ENV.padEnd(42)}║
║   Port: ${PORT.toString().padEnd(50)}║
║   API: http://localhost:${PORT}/api${' '.repeat(29)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export { app, server, wss };
