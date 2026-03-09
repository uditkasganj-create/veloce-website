import { Router, Request, Response } from 'express';


const router = Router();

const analytics: any[] = [];
let pageViews = 0;
let activeUsers = new Set<string>();

router.post('/pageview', (req: Request, res: Response) => {
  const { path } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  pageViews++;

  analytics.push({
    id: 'ana_' + Date.now(),
    type: 'pageview',
    path,
    ip,
    userAgent,
    sessionId: req.headers['x-session-id'] as string || null,
    createdAt: new Date(),
  });

  res.status(204).send();
});

router.post('/click', (req: Request, res: Response) => {
  const { elementId } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  analytics.push({
    id: 'ana_' + Date.now(),
    type: 'click',
    elementId,
    ip,
    createdAt: new Date(),
  });

  res.status(204).send();
});

router.post('/ping', (req: Request, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string || 'unknown';
  activeUsers.add(sessionId);

  setTimeout(() => {
    activeUsers.delete(sessionId);
  }, 60000);

  res.status(204).send();
});

router.get('/stats', (req: Request, res: Response) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const todayViews = analytics.filter(a =>
    a.type === 'pageview' &&
    a.createdAt.toISOString().split('T')[0] === today
  ).length;

  const topPages = analytics
    .filter(a => a.type === 'pageview' && a.path)
    .reduce((acc: any, curr: any) => {
      acc[curr.path] = (acc[curr.path] || 0) + 1;
      return acc;
    }, {});

  const topPagesArray = Object.entries(topPages)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  res.json({
    success: true,
    data: {
      totalPageViews: pageViews,
      todayPageViews: todayViews,
      activeUsers: activeUsers.size,
      topPages: topPagesArray,
      recentEvents: analytics.slice(-20).reverse(),
    },
  });
});

export default router;
