const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// SECURITY: Strict CORS Configuration
// ==========================================
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS policy.'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' })); // Prevent oversized payloads
app.set('trust proxy', true);

// ==========================================
// SECURITY: Simple In-Memory Rate Limiter
// ==========================================
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // max 60 requests per minute per IP

const rateLimit = (req, res, next) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now - record.start > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return next();
    }
    record.count++;
    if (record.count > RATE_LIMIT_MAX) {
        return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }
    next();
};

// Stricter rate limit for contact form submissions (10 per minute per IP)
const contactRateLimit = (req, res, next) => {
    const ip = req.ip || 'unknown';
    const key = `contact_${ip}`;
    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || now - record.start > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(key, { count: 1, start: now });
        return next();
    }
    record.count++;
    if (record.count > 10) {
        return res.status(429).json({ error: 'Too many submissions. Try again later.' });
    }
    next();
};

app.use(rateLimit);

// ==========================================
// SECURITY: Input Sanitization Helper
// ==========================================
const sanitizeString = (str, maxLen = 500) => {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, maxLen);
};

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// ==========================================
// DATABASE INITIALIZATION
// ==========================================
const db = new sqlite3.Database('./dev.db', (err) => {
    if (err) {
        console.error('SQLite connection error:', err);
        process.exit(1); // Critical failure — exit cleanly
    } else {
        console.log('Connected to SQLite local database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS PageView (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        ip TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS ActiveUser (
        ip TEXT PRIMARY KEY,
        lastPing DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS ClickEvent (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        elementId TEXT,
        ip TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS ContactSubmission (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Safe IP getter - req.connection.remoteAddress is deprecated
const getClientIp = (req) => req.ip || req.socket?.remoteAddress || 'unknown';

// ==========================================
// ANALYTICS ENDPOINTS
// ==========================================

app.post('/api/analytics/pageview', (req, res) => {
    const path = sanitizeString(req.body?.path, 200);
    if (!path) return res.status(400).json({ error: 'Missing path' });

    const ip = getClientIp(req);
    db.run(`INSERT INTO PageView (path, ip) VALUES (?, ?)`, [path, ip], (err) => {
        if (err) {
            console.error('Pageview error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(204).send();
    });
});

app.post('/api/analytics/ping', (req, res) => {
    const ip = getClientIp(req);
    db.run(
        `INSERT INTO ActiveUser (ip, lastPing) VALUES (?, CURRENT_TIMESTAMP)
         ON CONFLICT(ip) DO UPDATE SET lastPing = CURRENT_TIMESTAMP`,
        [ip],
        (err) => {
            if (err) {
                console.error('Ping error:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.status(204).send();
        }
    );
});

app.post('/api/analytics/click', (req, res) => {
    const elementId = sanitizeString(req.body?.elementId, 100);
    const ip = getClientIp(req);
    db.run(`INSERT INTO ClickEvent (elementId, ip) VALUES (?, ?)`, [elementId, ip], (err) => {
        if (err) {
            console.error('Click error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(204).send();
    });
});

app.get('/api/analytics/stats', (req, res) => {
    const stats = {
        totalViews: 0,
        activeUsers: 0,
        totalEngagements: 0,
        totalContacts: 0,
        recentSubmissions: []
    };

    let completed = 0;
    const total = 5;
    let hasError = false;

    const done = (err) => {
        if (err && !hasError) {
            hasError = true;
            console.error('Stats query error:', err);
        }
        completed++;
        if (completed === total) {
            if (hasError && stats.totalViews === 0 && stats.activeUsers === 0) {
                return res.status(500).json({ error: 'Failed to load stats' });
            }
            res.json(stats);
        }
    };

    db.get(`SELECT COUNT(*) as count FROM PageView`, (err, row) => {
        if (!err && row) stats.totalViews = row.count;
        done(err);
    });

    db.get(`SELECT COUNT(*) as count FROM ClickEvent`, (err, row) => {
        if (!err && row) stats.totalEngagements = row.count;
        done(err);
    });

    db.get(`SELECT COUNT(*) as count FROM ContactSubmission`, (err, row) => {
        if (!err && row) stats.totalContacts = row.count;
        done(err);
    });

    db.get(`SELECT COUNT(*) as count FROM ActiveUser WHERE lastPing >= datetime('now', '-2 minute')`, (err, row) => {
        if (!err && row) stats.activeUsers = row.count;
        done(err);
    });

    db.all(`SELECT id, name, email, type, message, timestamp FROM ContactSubmission ORDER BY timestamp DESC LIMIT 10`, (err, rows) => {
        if (!err && rows) stats.recentSubmissions = rows;
        done(err);
    });
});

// ==========================================
// CONTACT ENDPOINT — with validation
// ==========================================

app.post('/api/contact', contactRateLimit, (req, res) => {
    const name = sanitizeString(req.body?.name, 100);
    const email = sanitizeString(req.body?.email, 200);
    const phone = sanitizeString(req.body?.phone, 20);
    const message = sanitizeString(req.body?.message, 2000);
    const type = sanitizeString(req.body?.type, 50);

    // Validation
    if (!name || name.length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters.' });
    }
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!message || message.length < 10) {
        return res.status(400).json({ error: 'Message must be at least 10 characters.' });
    }
    if (!['shipping', 'size', 'privacy', 'support', 'general'].includes(type)) {
        return res.status(400).json({ error: 'Invalid contact type.' });
    }

    db.run(
        `INSERT INTO ContactSubmission (name, email, phone, message, type) VALUES (?, ?, ?, ?, ?)`,
        [name, email, phone || null, message, type],
        function (err) {
            if (err) {
                console.error('Contact error:', err);
                return res.status(500).json({ error: 'Failed to save submission. Please try again.' });
            }
            res.status(201).json({ success: true, id: this.lastID });
        }
    );
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'An unexpected error occurred.' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
    console.log(`✅ Veloce API server running on http://localhost:${PORT}`);
});
