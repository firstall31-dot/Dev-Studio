import express, { Request, Response } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";
import "dotenv/config";
import { registerRoutes } from "./server/routes.js";
import { setupGooglePassport } from "./server/routes/api/auth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT || 5000);

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

if (!isProd) {
  app.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  });
}
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(passport.initialize());

setupGooglePassport();
registerRoutes(app);

if (isProd) {
  const distPath = join(__dirname, "dist");
  app.use(express.static(distPath, {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    immutable: true,
  }));
  app.get("/{*path}", (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(join(distPath, "index.html"));
  });
} else {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: {
        clientPort: 443,
        host: process.env.REPLIT_DEV_DOMAIN,
      },
    },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Dev Studio running on port ${PORT}`);
});
