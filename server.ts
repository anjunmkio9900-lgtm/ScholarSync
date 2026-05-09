import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example API for order calculation (can be expanded)
  app.post("/api/orders/calculate", (req, res) => {
    const { pages, hours, urgency } = req.body;
    let basePrice = 0;
    
    if (pages) basePrice = pages * 10; // $10 per page
    if (hours) basePrice = hours * 15; // $15 per hour
    
    const urgencyFee = urgency === 'urgent' ? basePrice * 0.5 : 0;
    const total = basePrice + urgencyFee;
    
    res.json({ total, currency: 'USD' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
