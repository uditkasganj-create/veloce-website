import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, "server", "dev.db"), (err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Connected to SQLite database.");
});

// Initialize Database Tables
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

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(cors());
  app.use(express.json({ limit: "10kb" }));

  let activeVisitors = 0;
  let totalEngagement = 0;
  let pageViews = 0;

  // Real-time tracking via WebSockets
  wss.on("connection", (ws) => {
    activeVisitors++;
    broadcastStats();

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "engagement") {
          totalEngagement++;
          broadcastStats();
        }
        if (message.type === "page_view") {
          pageViews++;
          broadcastStats();
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    });

    ws.on("close", () => {
      activeVisitors--;
      broadcastStats();
    });
  });

  function broadcastStats() {
    const stats = JSON.stringify({
      type: "stats_update",
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

  // --- API Routes ---

  app.get("/api/kpis", (req, res) => {
    res.json({
      activeVisitors,
      totalEngagement,
      pageViews,
      status: "Live Tracking Active"
    });
  });

  app.post("/api/analytics/pageview", (req, res) => {
    const { path } = req.body;
    const ip = req.ip || "unknown";
    db.run(`INSERT INTO PageView (path, ip) VALUES (?, ?)`, [path, ip], (err) => {
      if (err) return res.status(500).json({ error: "DB Error" });
      pageViews++;
      broadcastStats();
      res.status(204).send();
    });
  });

  app.post("/api/analytics/ping", (req, res) => {
    const ip = req.ip || "unknown";
    db.run(
      `INSERT INTO ActiveUser (ip, lastPing) VALUES (?, CURRENT_TIMESTAMP)
       ON CONFLICT(ip) DO UPDATE SET lastPing = CURRENT_TIMESTAMP`,
      [ip],
      () => res.status(204).send()
    );
  });

  app.post("/api/analytics/click", (req, res) => {
    const { elementId } = req.body;
    const ip = req.ip || "unknown";
    db.run(`INSERT INTO ClickEvent (elementId, ip) VALUES (?, ?)`, [elementId, ip], (err) => {
      if (err) return res.status(500).json({ error: "DB Error" });
      totalEngagement++;
      broadcastStats();
      res.status(204).send();
    });
  });

  app.get("/api/analytics/stats", (req, res) => {
    const stats: any = { totalViews: pageViews, activeUsers: activeVisitors, totalEngagements: totalEngagement };
    db.get(`SELECT COUNT(*) as count FROM ContactSubmission`, (err, row: any) => {
      stats.totalContacts = row?.count || 0;
      db.all(`SELECT * FROM ContactSubmission ORDER BY timestamp DESC LIMIT 10`, (err, rows) => {
        stats.recentSubmissions = rows || [];
        res.json(stats);
      });
    });
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, phone, message, type } = req.body;
    db.run(
      `INSERT INTO ContactSubmission (name, email, phone, message, type) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, message, type],
      function (err) {
        if (err) return res.status(500).json({ error: "Failed to save submission" });
        res.status(201).json({ success: true, id: this.lastID });
      }
    );
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
