import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import "dotenv/config";
import {
  corsOptions,
  helmetOptions,
  morganLogger,
  compressionMiddleware,
  noCacheMiddleware,
  globalLimiter,
} from "./presentation/config/index.js";
import { registerRoutes } from "./presentation/routes.js";
import { setupGooglePassport } from "./presentation/controllers/auth.controller.js";
import { requestIdMiddleware } from "./presentation/middleware/request-id.js";
import { logger } from "./infrastructure/lib/logger.js";
import { setupSwagger } from "./presentation/docs/swagger.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./presentation/middleware/error.js";

import { runSeeding } from "./infrastructure/database/seed.js";

const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT || 5000);

const app = express();

// Trust proxy (nginx, load balancer, etc.) so rate-limit and IP detection work correctly
app.set("trust proxy", 1);

// --- Request tracing ---
app.use(requestIdMiddleware);

// --- Security & HTTP Hardening ---
app.use(helmetOptions);
app.use(corsOptions);
app.use(globalLimiter); // Apply rate limiting
app.use(morganLogger);

// --- Dev: disable caching ---
if (!isProd) {
  app.use(noCacheMiddleware);
}

// --- Body & response middleware ---
app.use(compressionMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

// --- Auth ---
app.use(passport.initialize());
setupGooglePassport();

// --- Docs & Routes ---
setupSwagger(app);
registerRoutes(app);

// --- Root handler ---
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: isProd
      ? "Dev Studio API is running"
      : "Dev Studio API is running (Dev)",
  });
});

// --- 404 & Global Error Handling (must be last) ---
app.use(notFoundHandler);
app.use(globalErrorHandler);

async function startServer() {
  try {
    logger.info("Checking and seeding database...");
    await runSeeding();
    logger.info("Seeding check complete.");
  } catch (err) {
    logger.error("Database seeding failed on startup", { err });
  }

  // Only start the listener if we're not running on Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Dev Studio running on port ${PORT}`, { port: PORT, env: process.env.NODE_ENV ?? "development" });
    });
  }
}

startServer();

export default app;
