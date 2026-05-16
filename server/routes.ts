import type { Express, Request, Response, NextFunction } from "express";
import promptRoutes from "./routes/api/prompts.js";
import agentRoutes from "./routes/api/agents.js";
import componentRoutes from "./routes/api/components.js";
import templateRoutes from "./routes/api/templates.js";
import snippetRoutes from "./routes/api/snippets.js";
import connectorRoutes from "./routes/api/connectors.js";
import socialRoutes from "./routes/api/social.js";
import mailRoutes from "./routes/api/mail.js";
import interviewRoutes from "./routes/api/interview.js";
import jobRoutes from "./routes/api/jobs.js";
import offerRoutes from "./routes/api/offers.js";
import serviceRoutes from "./routes/api/services.js";
import profileRoutes from "./routes/api/profile.js";
import chatRoutes from "./routes/api/chat.js";
import authRoutes from "./routes/api/auth.js";
import cvRoutes from "./routes/api/cv.js";

export function registerRoutes(app: Express) {
  // --- Auth ---
  app.use("/api/auth", authRoutes);

  // --- Standard API Routes ---
  app.use("/api/chat", chatRoutes);
  app.use("/api/prompts", promptRoutes);
  app.use("/api/agents", agentRoutes);
  app.use("/api/components", componentRoutes);
  app.use("/api/templates", templateRoutes);
  app.use("/api/snippets", snippetRoutes);
  app.use("/api/connectors", connectorRoutes);
  app.use("/api/social", socialRoutes);
  app.use("/api/mail", mailRoutes);
  app.use("/api/interview", interviewRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/offers", offerRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/cv", cvRoutes);

  // --- Legacy Backward Compatibility ---
  
  // Progress & Interview Questions
  app.use("/api/progress", (req: Request, res: Response, next: NextFunction) => {
    req.url = "/progress" + (req.url === "/" ? "" : req.url);
    interviewRoutes(req, res, next);
  });
  
  app.use("/api/interview-questions", (req: Request, res: Response, next: NextFunction) => {
    req.url = "/questions" + (req.url === "/" ? "" : req.url);
    interviewRoutes(req, res, next);
  });

  // Social Drafts & Mail Templates
  app.use("/api/social-drafts", socialRoutes);
  app.use("/api/mail-templates", mailRoutes);
  
  // Freelance & Services
  app.use("/api/freelance-offers", offerRoutes);
  app.use("/api/my-services", serviceRoutes);
}
