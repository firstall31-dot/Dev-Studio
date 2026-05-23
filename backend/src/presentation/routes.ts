import type { Express, Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import promptRoutes from "./routes/prompts.routes.js";
import agentRoutes from "./routes/agents.routes.js";
import componentRoutes from "./routes/components.routes.js";
import templateRoutes from "./routes/templates.routes.js";
import snippetRoutes from "./routes/snippets.routes.js";
import connectorRoutes from "./routes/connectors.routes.js";
import socialRoutes from "./routes/social.routes.js";
import mailRoutes from "./routes/mail.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import jobRoutes from "./routes/jobs.routes.js";
import offerRoutes from "./routes/offers.routes.js";
import serviceRoutes from "./routes/services.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import cvRoutes from "./routes/cv.routes.js";
import plannerRoutes from "./routes/planner.routes.js";
import skillsRoutes from "./routes/skills.routes.js";

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
  app.use("/api/planner", plannerRoutes);
  app.use("/api/skills", skillsRoutes);

  // --- Legacy Backward Compatibility ---

  app.use(
    "/api/progress",
    (req: Request, res: Response, next: NextFunction) => {
      req.url = "/progress" + (req.url === "/" ? "" : req.url);
      interviewRoutes(req, res, next);
    },
  );

  app.use(
    "/api/interview-questions",
    (req: Request, res: Response, next: NextFunction) => {
      req.url = "/questions" + (req.url === "/" ? "" : req.url);
      interviewRoutes(req, res, next);
    },
  );

  app.use("/api/social-drafts", socialRoutes);
  app.use("/api/mail-templates", mailRoutes);
  app.use("/api/freelance-offers", offerRoutes);
  app.use("/api/my-services", serviceRoutes);
  app.use("/api/jobs/offers", offerRoutes);
  app.use("/api/jobs/services", serviceRoutes);
}
