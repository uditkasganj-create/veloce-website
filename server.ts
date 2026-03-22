import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

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

  // API Routes
  app.get("/api/kpis", (req, res) => {
    res.json({
      activeVisitors,
      totalEngagement,
      pageViews,
      status: "Live Tracking Active"
    });
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

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
