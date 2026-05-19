import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dev Studio API Documentation",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for Dev Studio backend and frontend integration.",
      contact: {
        name: "Dev Studio Team",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "ds_token",
          description: "Cookie-based session token for secure endpoints",
        },
      },
    },
  },
  apis: [
    "./src/presentation/docs/swagger-docs.js",
    "./src/presentation/docs/swagger-docs.ts",
    "./src/presentation/controllers/*.js",
    "./src/presentation/controllers/*.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/swagger", (_req, res) => res.redirect("/api-docs"));
  app.get("/docs", (_req, res) => res.redirect("/api-docs"));
  app.get("/swagger.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
