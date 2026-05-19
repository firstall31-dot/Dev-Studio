import type { Express, Request, Response, NextFunction } from "express";
import authController from "./controllers/auth.controller.js";
import chatController from "./controllers/chat.controller.js";
import promptController from "./controllers/prompts.controller.js";
import agentController from "./controllers/agents.controller.js";
import componentController from "./controllers/components.controller.js";
import templateController from "./controllers/templates.controller.js";
import snippetController from "./controllers/snippets.controller.js";
import connectorController from "./controllers/connectors.controller.js";
import socialController from "./controllers/social.controller.js";
import mailController from "./controllers/mail.controller.js";
import interviewController from "./controllers/interview.controller.js";
import jobController from "./controllers/jobs.controller.js";
import offerController from "./controllers/offers.controller.js";
import serviceController from "./controllers/services.controller.js";
import profileController from "./controllers/profile.controller.js";
import cvController from "./controllers/cv.controller.js";
import plannerController from "./controllers/planner.controller.js";

export function registerRoutes(app: Express) {
  // --- Auth ---
  app.use("/api/auth", authController);

  // --- Standard API Routes ---
  app.use("/api/chat", chatController);
  app.use("/api/prompts", promptController);
  app.use("/api/agents", agentController);
  app.use("/api/components", componentController);
  app.use("/api/templates", templateController);
  app.use("/api/snippets", snippetController);
  app.use("/api/connectors", connectorController);
  app.use("/api/social", socialController);
  app.use("/api/mail", mailController);
  app.use("/api/interview", interviewController);
  app.use("/api/jobs", jobController);
  app.use("/api/offers", offerController);
  app.use("/api/services", serviceController);
  app.use("/api/profile", profileController);
  app.use("/api/cv", cvController);
  app.use("/api/planner", plannerController);

  // --- Legacy Backward Compatibility ---

  app.use(
    "/api/progress",
    (req: Request, res: Response, next: NextFunction) => {
      req.url = "/progress" + (req.url === "/" ? "" : req.url);
      interviewController(req, res, next);
    },
  );

  app.use(
    "/api/interview-questions",
    (req: Request, res: Response, next: NextFunction) => {
      req.url = "/questions" + (req.url === "/" ? "" : req.url);
      interviewController(req, res, next);
    },
  );

  app.use("/api/social-drafts", socialController);
  app.use("/api/mail-templates", mailController);
  app.use("/api/freelance-offers", offerController);
  app.use("/api/my-services", serviceController);
}
